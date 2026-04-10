import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { sendWhatsApp } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const stksCallback = data?.Body?.stkCallback;
    
    if (!stksCallback) {
      return NextResponse.json({ success: false, message: 'Invalid callback payload' }, { status: 400 });
    }

    const { CheckoutRequestID, ResultCode, CallbackMetadata } = stksCallback;

    // Check if payment was successful (ResultCode 0 is success in Daraja)
    if (ResultCode === 0 && CallbackMetadata) {
      // It was successful. Get the metadata items like Receipt and Phone.
      const getMetaItem = (name: string) => CallbackMetadata.Item.find((i: any) => i.Name === name)?.Value;
      const receipt = getMetaItem('MpesaReceiptNumber');
      const amount = getMetaItem('Amount');
      const phone = getMetaItem('PhoneNumber');

      // Fetch the reserved song details from Firebase
      const docRef = doc(db, 'song_requests', CheckoutRequestID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { name, song, artist, message } = docSnap.data();

        // Fire WhatsApp dynamically
        const waMsg = `✅ *Paid Song Request*\n\n👤 Fan: ${name}\n📞 Phone: ${phone}\n🎶 Song: ${song}${artist ? ` by ${artist}` : ''}\n💬 Message: ${message || 'No message'}\n\n💰 Paid: KES ${amount} (Receipt: ${receipt})`;
        await sendWhatsApp(waMsg);

        // Update database as completed securely
        await updateDoc(docRef, {
          status: 'completed',
          receipt,
          completedAt: new Date().toISOString()
        });
      }
    } else {
      // Payment failed or was canceled
      const docRef = doc(db, 'song_requests', CheckoutRequestID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
         await updateDoc(docRef, { status: 'failed' });
      }
    }

    // Safaricom explicitly requires us to bounce back success
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (err: any) {
    console.error('Mpesa callback error:', err);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Error" });
  }
}
