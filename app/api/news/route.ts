import { NextRequest, NextResponse } from 'next/server';
import { getAllNews } from '@/lib/news';
import type { Language } from '@/lib/news';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const lang = (req.nextUrl.searchParams.get('lang') || 'en') as Language;
    const { news, builtAt, fromCache } = await getAllNews(lang);
    return NextResponse.json({ news, updatedAt: builtAt, fromCache });
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
