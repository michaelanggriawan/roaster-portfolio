// frontend/app/api/scrape/route.ts
import { NextRequest, NextResponse } from 'next/server';

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url, useAI = false } = await req.json();

    if (!isValidUrl(url)) {
      return new NextResponse('Invalid URL format', { status: 400 });
    }

    const backendRes = await fetch(`${process.env.BACKEND_URL}/portfolio/scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, useAI }),
    });

    if (!backendRes.ok) {
      throw new Error('Backend scrape failed');
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[Scrape API] Error:', err);
    return new NextResponse('Failed to scrape', { status: 500 });
  }
}
