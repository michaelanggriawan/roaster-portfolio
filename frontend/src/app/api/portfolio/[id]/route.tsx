import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/portfolio/${id}`);
    if (!res.ok) throw new Error('Failed to fetch portfolio');

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[API] Error fetching portfolio by id:', err);
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
  }
}
