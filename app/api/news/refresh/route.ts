import { NextRequest, NextResponse } from 'next/server';
import { incrementalRefresh } from '@/lib/news';
import type { Language } from '@/lib/news';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const lang = (req.nextUrl.searchParams.get('lang') || 'en') as Language;
    const { news, newsTamil, builtAt, newCount } = await incrementalRefresh();
    const result = lang === 'ta' ? newsTamil : news;
    return NextResponse.json({ news: result, updatedAt: builtAt, newCount });
  } catch (error) {
    console.error('Refresh failed:', error);
    return NextResponse.json({ error: 'Refresh failed' }, { status: 500 });
  }
}
