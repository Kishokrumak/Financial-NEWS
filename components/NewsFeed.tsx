'use client';

import { useState, useEffect, useCallback } from 'react';
import NewsCard from './NewsCard';
import SkeletonCard from './SkeletonCard';
import type { NewsCard as NewsCardType, Category } from '@/lib/news';

const CATEGORIES: { label: string; value: Category | 'All' }[] = [
  { label: 'All',          value: 'All' },
  { label: 'Stocks',       value: 'Stocks & Equity' },
  { label: 'Mutual Funds', value: 'Mutual Funds' },
  { label: 'Gold & Silver',value: 'Gold & Silver' },
  { label: 'Economy',      value: 'Economy & RBI' },
];

export default function NewsFeed() {
  const [allNews, setAllNews]       = useState<NewsCardType[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [category, setCategory]     = useState<Category | 'All'>('All');
  const [sort, setSort]             = useState<'newest' | 'oldest'>('newest');
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setAllNews(data.news || []);
      setLastUpdated(data.updatedAt);
    } catch {
      setError('Could not load news. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Silent background refresh every 15 mins — no spinner, just adds new articles quietly
  const silentRefresh = useCallback(async () => {
    try {
      const res = await fetch('/api/news');
      if (!res.ok) return;
      const data = await res.json();
      const incoming: NewsCardType[] = data.news || [];
      setAllNews(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const newArticles = incoming.filter(n => !existingIds.has(n.id));
        if (newArticles.length === 0) return prev;
        return [...newArticles, ...prev];
      });
      setLastUpdated(data.updatedAt);
    } catch {
      // Silently fail — never show error for background refresh
    }
  }, []);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(silentRefresh, 15 * 60 * 1000); // every 15 mins
    return () => clearInterval(interval);
  }, [fetchNews, silentRefresh]);

  const filtered = allNews
    .filter(n => category === 'All' || n.category === category)
    .sort((a, b) => {
      const diff = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      return sort === 'newest' ? diff : -diff;
    });

  const formatUpdated = (iso: string) => {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Sticky filter bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(245,247,250,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', paddingTop: 12, paddingBottom: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
          {CATEGORIES.map(c => (
            <button key={c.value} onClick={() => setCategory(c.value)}
              style={{ whiteSpace: 'nowrap', padding: '7px 16px', borderRadius: '20px', border: category === c.value ? '2px solid var(--primary)' : '1.5px solid var(--border)', background: category === c.value ? 'var(--primary)' : 'var(--surface)', color: category === c.value ? '#fff' : 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: category === c.value ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0 }}>
              {c.label}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
            <button onClick={() => setSort(s => s === 'newest' ? 'oldest' : 'newest')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: '20px', border: '1.5px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                {sort === 'newest'
                  ? <path d="M2 3h9M2 6.5h6M2 10h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  : <path d="M2 3h3M2 6.5h6M2 10h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>}
              </svg>
              {sort === 'newest' ? 'Newest' : 'Oldest'}
            </button>
          </div>
        </div>
        {lastUpdated && (
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 8, paddingLeft: 2 }}>
            Updated {formatUpdated(lastUpdated)}
          </p>
        )}
      </div>

      {/* Feed */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>{error}</p>
          <button onClick={fetchNews} style={{ padding: '10px 24px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '20px', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
            Try Again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '28px', marginBottom: 12 }}>🌅</p>
          <p style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>Today&apos;s news is on its way</p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Fresh news for {category === 'All' ? 'all categories' : category} will appear here as it gets published today. Check back in a little while.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map((card, i) => <NewsCard key={card.id} card={card} index={i} />)}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', padding: '24px 0 8px' }}>
          {filtered.length} articles today
        </p>
      )}
    </div>
  );
}
