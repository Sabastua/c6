import { NextRequest, NextResponse } from 'next/server';
import { stkPush } from '@/lib/mpesa';

export async function POST(req: NextRequest) {
  try {
    const { phone, amount, mixTitle } = await req.json();

    if (!phone || !amount) {
      return NextResponse.json({ success: false, error: 'Phone and amount are required' }, { status: 400 });
    }

    const parsedAmount = Math.max(1, parseInt(amount, 10));
    
    const mpesaResult = await stkPush(
      phone,
      parsedAmount,
      'TIP',
      `Tip for Mix: ${mixTitle || 'DJ C6'}`
    );

    if (mpesaResult.ResponseCode !== '0') {
      return NextResponse.json({ 
        success: false, 
        error: mpesaResult.errorMessage || mpesaResult.CustomerMessage || 'M-Pesa error' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      checkoutRequestId: mpesaResult.CheckoutRequestID 
    });
  } catch (err: any) {
    console.error('Tip API error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal server error' }, { status: 500 });
  }
}
