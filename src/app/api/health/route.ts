import { NextResponse } from 'next/server';
import { getMpesaToken, MPESA_CONFIG } from '@/lib/mpesa';

export async function GET() {
  const startTime = Date.now();
  let mpesaStatus = 'ok';
  let mpesaError = null;

  try {
    // Attempt to connect to M-Pesa API to verify credentials and connectivity
    await getMpesaToken();
  } catch (error: any) {
    mpesaStatus = 'error';
    mpesaError = error.message;
  }

  const duration = Date.now() - startTime;
  const isHealthy = mpesaStatus === 'ok';

  return NextResponse.json(
    {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      mpesaEnvironment: process.env.MPESA_ENV || 'sandbox (default)',
      mpesaBaseUrl: MPESA_CONFIG.baseUrl,
      checks: {
        mpesa: {
          status: mpesaStatus,
          error: mpesaError,
        },
      },
      responseTimeMs: duration,
    },
    { status: isHealthy ? 200 : 503 }
  );
}
