import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const backendRes = await fetch(`${process.env.BACKEND_URL}/portfolio`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!backendRes.ok) {
      throw new Error('Backend fetch failed');
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[Portfolio API] Error:', err);
    return new NextResponse('Failed to fetch portfolios', { status: 500 });
  }
}
