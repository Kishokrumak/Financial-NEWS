import { NextResponse } from 'next/server';
import { getAllNews } from '@/lib/news';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { news, builtAt, fromCache } = await getAllNews();
    return NextResponse.json({ news, updatedAt: builtAt, fromCache });
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
