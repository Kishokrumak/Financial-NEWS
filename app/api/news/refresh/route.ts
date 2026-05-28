import { NextResponse } from 'next/server';
import { incrementalRefresh } from '@/lib/news';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { news, builtAt, newCount } = await incrementalRefresh();
    return NextResponse.json({ news, updatedAt: builtAt, newCount });
  } catch (error) {
    console.error('Incremental refresh failed:', error);
    return NextResponse.json({ error: 'Refresh failed' }, { status: 500 });
  }
}
