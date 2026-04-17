import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { stkPush } from '@/lib/mpesa';

export async function POST(req: NextRequest) {
  try {
    const { name, phone, song, artist, message, amount } = await req.json();

    if (!name || !phone || !song || !amount) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const parsedAmount = Math.max(1, parseInt(amount, 10) || 1);

    // 1. Initiate M-Pesa STK push
    const mpesaResult = await stkPush(phone, parsedAmount, 'C6', `Song Req: ${song}`);

    if (mpesaResult.ResponseCode !== '0') {
      return NextResponse.json({ 
        success: false, 
        error: mpesaResult.errorMessage || mpesaResult.CustomerMessage || 'M-Pesa error' 
      }, { status: 400 });
    }

    // 2. Save the request into Firebase
    try {
      await setDoc(doc(db, 'song_requests', mpesaResult.CheckoutRequestID), {
        name, phone, song, artist: artist || '', message: message || '',
        amount: parsedAmount,
        status: 'pending',
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.error("Firebase storage failed", e);
    }

    return NextResponse.json({ success: true, checkoutRequestId: mpesaResult.CheckoutRequestID });
  } catch (err: any) {
    console.error('Song request error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal server error' }, { status: 500 });
  }
}
