import { NextRequest, NextResponse } from 'next/server';
import { stkPush } from '@/lib/mpesa';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const { itemName, price, phone, size } = await req.json();

    if (!itemName || !price || !phone) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // STK Push
    const mpesaResult = await stkPush(
      phone, 
      price, 
      'DJMERCH', 
      `DJ C6 Merch: ${itemName}`
    );

    if (mpesaResult.ResponseCode !== '0') {
      return NextResponse.json({ 
        success: false, 
        error: mpesaResult.errorMessage || mpesaResult.CustomerMessage || 'M-Pesa error' 
      }, { status: 400 });
    }

    // Save to Firebase for callback
    try {
      await setDoc(doc(db, 'mpesa_payments', mpesaResult.CheckoutRequestID), {
        type: 'MERCH',
        itemName,
        amount: price,
        phone,
        size: size || 'N/A',
        status: 'pending',
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.error('Firebase save failed:', e);
    }

    return NextResponse.json({ 
      success: true, 
      checkoutRequestId: mpesaResult.CheckoutRequestID 
    });
  } catch (err: any) {
    console.error('Merch order error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal server error' }, { status: 500 });
  }
}
