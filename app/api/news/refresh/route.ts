import { NextResponse } from 'next/server';
import { forceRefreshNews } from '@/lib/news';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Midnight cron triggered — refreshing news cache...');
    const { news, builtAt } = await forceRefreshNews();
    return NextResponse.json({
      success: true,
      articleCount: news.length,
      builtAt,
    });
  } catch (error) {
    console.error('Refresh failed:', error);
    return NextResponse.json({ error: 'Refresh failed' }, { status: 500 });
  }
}
