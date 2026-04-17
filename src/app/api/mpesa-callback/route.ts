import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

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
    console.error('WhatsApp notify failed:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const stkCallback = data?.Body?.stkCallback;
    
    if (!stkCallback) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Rejected" });
    }

    const { CheckoutRequestID, ResultCode, CallbackMetadata } = stkCallback;

    // Fetch the pending payment from Firebase
    const docRef = doc(db, 'mpesa_payments', CheckoutRequestID);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
    }

    const paymentData = docSnap.data();

    // ─── CASE: SUCCESS ──────────────────────────────────────────────────────────
    if (ResultCode === 0 && CallbackMetadata) {
      const getMeta = (name: string) => CallbackMetadata.Item.find((i: any) => i.Name === name)?.Value;
      const receipt = getMeta('MpesaReceiptNumber');
      const amount = getMeta('Amount');

      let waMsg = '';

      switch (paymentData.type) {
        case 'TIP':
          waMsg = `💰 *New Tip Received!*\n\n🔥 Mix: ${paymentData.mixTitle}\n💵 Amount: KES ${amount}\n📱 Phone: ${paymentData.phone}\n🧾 Receipt: ${receipt}`;
          break;
        
        case 'SONG_REQUEST':
          waMsg = `🎶 *Song Request Paid*\n\n👤 Fan: ${paymentData.name}\n🎵 Song: ${paymentData.song}\n💵 Amount: KES ${amount}\n💬 Msg: ${paymentData.message || 'None'}\n🧾 Receipt: ${receipt}`;
          break;

        case 'MERCH':
          waMsg = `🛍️ *Merch Order Paid*\n\n📦 Item: ${paymentData.itemName}\n📏 Size: ${paymentData.size}\n💵 Amount: KES ${amount}\n📱 Phone: ${paymentData.phone}\n🧾 Receipt: ${receipt}\n\n🚀 Time to fulfill!`;
          break;

        case 'BOOKING':
          waMsg = `📅 *Booking Deposit Paid*\n\n👤 Client: ${paymentData.clientName}\n📌 Event: ${paymentData.eventType}\n🗓️ Date: ${paymentData.date}\n💵 Deposit: KES ${amount}\n🧾 Receipt: ${receipt}`;
          break;
      }

      if (waMsg) await sendWhatsApp(waMsg);

      await updateDoc(docRef, {
        status: 'completed',
        receipt,
        completedAt: new Date().toISOString()
      });
    } 
    // ─── CASE: FAILED/CANCELLED ──────────────────────────────────────────────────
    else {
      await updateDoc(docRef, { 
        status: 'failed',
        failureReason: stkCallback.ResultDesc 
      });
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (err: any) {
    console.error('Mpesa callback error:', err);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Error" });
  }
}
