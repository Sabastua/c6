import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

// ─── M-Pesa Daraja helpers ──────────────────────────────────────────────────

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

  const timestamp = new Date()
    .toISOString()
    .replace(/[-T:.Z]/g, '')
    .slice(0, 14);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

  // Normalize phone: 07XX → 2547XX
  const normalizedPhone = phone.replace(/^0/, '254');

  const body = {
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
  };

  const res = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return res.json();
}

// WhatsApp logic has been moved to lib/whatsapp.ts

// ─── Route handler ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { name, phone, song, artist, message, amount } = await req.json();

    if (!name || !phone || !song || !amount) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const parsedAmount = Math.max(1, parseInt(amount, 10) || 1);

    // 1. Initiate M-Pesa STK push
    const mpesaResult = await stkPush(phone, parsedAmount, 'C6', `Song Request: ${song}`);

    if (mpesaResult.ResponseCode !== '0') {
      return NextResponse.json({ success: false, error: mpesaResult.errorMessage || 'M-Pesa error' }, { status: 400 });
    }

    // 2. Save the transaction detail into Firebase for the callback hook to locate
    try {
      await setDoc(doc(db, 'song_requests', mpesaResult.CheckoutRequestID), {
        name, phone, song, artist: artist || '', message: message || '',
        amount: parsedAmount,
        status: 'pending',
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.error("Firebase temporary storage failed", e);
    }

    return NextResponse.json({ success: true, checkoutRequestId: mpesaResult.CheckoutRequestID });
  } catch (err: any) {
    console.error('Song request error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
