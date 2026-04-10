import { NextRequest, NextResponse } from 'next/server';

async function getMpesaToken(): Promise<string> {
  const consumerKey = process.env.MPESA_CONSUMER_KEY!;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const res = await fetch(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    { headers: { Authorization: `Basic ${credentials}` } }
  );
  const data = await res.json();
  return data.access_token;
}

async function stkPush(phone: string, amount: number, accountRef: string, description: string) {
  const token = await getMpesaToken();
  const shortcode = process.env.MPESA_SHORTCODE!;
  const passkey = process.env.MPESA_PASSKEY!;
  const callbackUrl = process.env.MPESA_CALLBACK_URL!;
  const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
  const normalizedPhone = phone.replace(/^0/, '254');

  const res = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: normalizedPhone,
      PartyB: shortcode,
      PhoneNumber: normalizedPhone,
      CallBackURL: callbackUrl,
      AccountReference: accountRef,
      TransactionDesc: description,
    }),
  });
  return res.json();
}

async function sendWhatsApp(message: string) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN!;
  const djPhone = process.env.DJ_WHATSAPP_NUMBER!;
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
}

export async function POST(req: NextRequest) {
  try {
    const { itemName, price, phone, size } = await req.json();

    if (!itemName || !price || !phone) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // STK Push
    const mpesaResult = await stkPush(phone, price, 'DJMERCH', `DJ C6 Merch: ${itemName}`);

    if (mpesaResult.ResponseCode !== '0') {
      return NextResponse.json({ success: false, error: mpesaResult.errorMessage || 'M-Pesa error' }, { status: 400 });
    }

    // WhatsApp notification
    const waMsg = [
      `🛍️ *New Merch Order*`,
      ``,
      `👤 Customer Phone: ${phone}`,
      `📦 Item: ${itemName}`,
      `📏 Size: ${size || 'N/A'}`,
      `💰 Amount: KES ${Number(price).toLocaleString()}`,
      ``,
      `🔑 CheckoutID: ${mpesaResult.CheckoutRequestID}`,
      `✅ Awaiting M-Pesa confirmation`,
    ].join('\n');

    await sendWhatsApp(waMsg);

    return NextResponse.json({ success: true, checkoutRequestId: mpesaResult.CheckoutRequestID });
  } catch (err: any) {
    console.error('Merch order error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
