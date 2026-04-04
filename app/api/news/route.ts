import { NextResponse } from 'next/server';
import { fetchAllNews } from '@/lib/news';

// Revalidate every 24 hours (midnight refresh via ISR)
export const revalidate = 86400;

export async function GET() {
  try {
    const news = await fetchAllNews();
    return NextResponse.json({ news, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
