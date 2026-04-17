import { NextRequest, NextResponse } from 'next/server';
import { stkPush } from '@/lib/mpesa';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

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

    // Save to Firebase for callback
    try {
      await setDoc(doc(db, 'mpesa_payments', mpesaResult.CheckoutRequestID), {
        type: 'BOOKING',
        clientName,
        phone,
        email: email || '',
        eventName: eventName || '',
        eventType,
        date,
        location: location || '',
        guests: guests || '',
        notes: notes || '',
        amount: deposit,
        status: 'pending',
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.error('Firebase save failed:', e);
    }

    return NextResponse.json({ success: true, checkoutRequestId: mpesaResult.CheckoutRequestID });
  } catch (err: any) {
    console.error('Booking API error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal server error' }, { status: 500 });
  }
}
