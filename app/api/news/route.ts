import { NextResponse } from 'next/server';
import { fetchAllNews } from '@/lib/news';

// Do not cache - always fetch fresh
export const revalidate = 0;
export const dynamic = 'force-dynamic';

function isTodayIST(isoString: string): boolean {
  // Get current date in IST (UTC+5:30)
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffset);
  const todayIST = istNow.toISOString().slice(0, 10); // "YYYY-MM-DD"

  // Convert article date to IST
  const articleDate = new Date(isoString);
  const articleIST = new Date(articleDate.getTime() + istOffset);
  const articleDayIST = articleIST.toISOString().slice(0, 10);

  return articleDayIST === todayIST;
}

export async function GET() {
  try {
    const allNews = await fetchAllNews();
    // Only return today's news in IST
    const todayNews = allNews.filter(n => isTodayIST(n.publishedAt));
    return NextResponse.json({
      news: todayNews,
      updatedAt: new Date().toISOString(),
      total: todayNews.length,
    });
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
