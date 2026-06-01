import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    
    // If the mock/dummy secret is used, just return success
    if (process.env.TURNSTILE_SECRET_KEY === '1x0000000000000000000000000000000AA') {
      return NextResponse.json({ success: true });
    }

    // Allow bypass if no secret is set at all so we don't break local development
    if (!process.env.TURNSTILE_SECRET_KEY) {
      console.warn("No TURNSTILE_SECRET_KEY found, bypassing check");
      return NextResponse.json({ success: true, bypassed: true });
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${token}`,
    });

    const data = await res.json();
    
    if (data.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'verification_failed' }, { status: 400 });
    }
  } catch (e) {
    return NextResponse.json({ success: false, error: 'server_error' }, { status: 500 });
  }
}
