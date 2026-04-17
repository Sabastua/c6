import { NextRequest, NextResponse } from 'next/server';
import { stkPush } from '@/lib/mpesa';

async function sendWhatsApp(message: string) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN!;
  const djPhone = process.env.DJ_WHATSAPP_NUMBER!;
  try {
    await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: djPhone,
        type: 'text',
        text: { body: message },
      }),
    });
  } catch (err) {
    console.error('WhatsApp notification failed:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientName, phone, email, eventName, eventType, date, location, guests, notes, deposit } = body;

    if (!clientName || !phone || !date || !eventType) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const mpesaResult = await stkPush(
      phone,
      deposit,
      'DJBOOKING',
      `DJ C6 Booking Deposit — ${eventType}`
    );

    if (mpesaResult.ResponseCode !== '0') {
      return NextResponse.json({ 
        success: false, 
        error: mpesaResult.errorMessage || mpesaResult.CustomerMessage || 'M-Pesa error' 
      }, { status: 400 });
    }

    const waMsg = [
      `📅 *New Booking Request*`,
      ``,
      `👤 Client: ${clientName}`,
      `📞 Phone: ${phone}`,
      `📧 Email: ${email || 'N/A'}`,
      `🎉 Event: ${eventName || eventType}`,
      `📌 Type: ${eventType}`,
      `🗓️ Date: ${date}`,
      `📍 Location: ${location || 'TBD'}`,
      `👥 Guests: ${guests || 'TBD'}`,
      `📝 Notes: ${notes || 'None'}`,
      ``,
      `💰 Deposit: KES ${deposit?.toLocaleString()} via M-Pesa`,
      `🔑 CheckoutID: ${mpesaResult.CheckoutRequestID}`,
    ].join('\n');

    await sendWhatsApp(waMsg);

    return NextResponse.json({ success: true, checkoutRequestId: mpesaResult.CheckoutRequestID });
  } catch (err: any) {
    console.error('Booking API error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal server error' }, { status: 500 });
  }
}
