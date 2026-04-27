/**
 * Centralized M-Pesa Daraja Utility
 * Handles Sandbox vs Production toggle based on environment.
 */

export const MPESA_CONFIG = {
  consumerKey: process.env.MPESA_CONSUMER_KEY!,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
  shortcode: process.env.MPESA_SHORTCODE || '174379',
  passkey: process.env.MPESA_PASSKEY!,
  callbackUrl: process.env.MPESA_CALLBACK_URL!,
  // Allow forcing environment via MPESA_ENV, otherwise fallback to NODE_ENV
  baseUrl: (process.env.MPESA_ENV === 'production' || (process.env.NODE_ENV === 'production' && !process.env.MPESA_ENV))
    ? 'https://api.safaricom.co.ke' 
    : 'https://sandbox.safaricom.co.ke',
};

/**
 * Generates an OAuth Access Token for Daraja
 */
export async function getMpesaToken(): Promise<string> {
  const { consumerKey, consumerSecret, baseUrl } = MPESA_CONFIG;
  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  const res = await fetch(
    `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${credentials}` } }
  );
  
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to get M-Pesa token: ${err}`);
  }

  const data = await res.json();
  return data.access_token;
}

/**
 * Initiates an STK Push (Lipa Na M-Pesa Online)
 */
export async function stkPush(phone: string, amount: number, accountRef: string, description: string) {
  const token = await getMpesaToken();
  const { shortcode, passkey, callbackUrl, baseUrl } = MPESA_CONFIG;

  const timestamp = new Date()
    .toISOString()
    .replace(/[-T:.Z]/g, '')
    .slice(0, 14);
    
  // Password = Base64(Shortcode + Passkey + Timestamp)
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

  // Normalize phone number (07XX... -> 2547XX...)
  const normalizedPhone = phone.replace(/^0/, '254');

  const res = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline', // or 'CustomerBuyGoodsOnline' for Tills
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
