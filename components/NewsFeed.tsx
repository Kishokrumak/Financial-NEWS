'use client';

import { useState, useEffect, useCallback } from 'react';
import NewsCard from './NewsCard';
import SkeletonCard from './SkeletonCard';
import type { NewsCard as NewsCardType, Category } from '@/lib/news';

const CATEGORIES: { label: string; value: Category | 'All' }[] = [
  { label: 'All', value: 'All' },
  { label: 'Stocks & Equity', value: 'Stocks & Equity' },
  { label: 'Mutual Funds', value: 'Mutual Funds' },
  { label: 'Gold & Silver', value: 'Gold & Silver' },
  { label: 'Economy & RBI', value: 'Economy & RBI' },
];

export default function NewsFeed() {
  const [allNews, setAllNews] = useState<NewsCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState<Category | 'All'>('All');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);
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

  // Silent background refresh — runs every 15 minutes
  // No loading spinner — just quietly adds new articles to the top
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
      // Silently fail — never show an error for background refresh
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

  const activeLabel = CATEGORIES.find(c => c.value === category)?.label || 'All';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── Control bar ── */}
      <div
        style={{
          marginBottom: 16,
        }}
      >
        {/* Row 1: always visible — active filter chip + sort toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: filtersOpen ? 10 : 0 }}>

          {/* Active category chip — tapping opens filters */}
          <button
            onClick={() => setFiltersOpen(o => !o)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              borderRadius: '20px',
              border: '1.5px solid var(--primary)',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
              flexShrink: 0,
            }}
          >
            {activeLabel}
            {/* chevron */}
            <svg
              width="12" height="12" viewBox="0 0 12 12" fill="none"
              style={{ transform: filtersOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
            >
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Sort toggle — always visible */}
          <button
            onClick={() => setSort(s => s === 'newest' ? 'oldest' : 'newest')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '7px 14px',
              borderRadius: '20px',
              border: '1.5px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              {sort === 'newest'
                ? <path d="M2 3h9M2 6.5h6M2 10h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                : <path d="M2 3h3M2 6.5h6M2 10h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              }
            </svg>
            {sort === 'newest' ? 'Newest first' : 'Oldest first'}
          </button>
        </div>

        {/* Row 2: expandable filter pills */}
        {filtersOpen && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              padding: '10px 0 4px',
              borderTop: '1px solid var(--border)',
              animation: 'fadeIn 0.18s ease both',
            }}
          >
            {CATEGORIES.map(c => (
              <button
                key={c.value}
                onClick={() => { setCategory(c.value); setFiltersOpen(false); }}
                style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  border: category === c.value ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                  background: category === c.value ? 'var(--primary)' : 'var(--surface)',
                  color: category === c.value ? '#fff' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: category === c.value ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}

        {/* Last updated */}
        {lastUpdated && (
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 8 }}>
            Updated {new Date(lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </p>
        )}
      </div>

      {/* ── Feed ── */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            background: 'var(--surface)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
          }}
        >
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>{error}</p>
          <button
            onClick={fetchNews}
            style={{
              padding: '10px 24px',
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            background: 'var(--surface)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
          }}
        >
          <p style={{ fontSize: '28px', marginBottom: '12px' }}>🌅</p>
          <p style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
            Today&apos;s news is on its way
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Fresh news for {category === 'All' ? 'all categories' : category} will appear here as it gets published today. Check back in a little while.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map((card, i) => (
            <NewsCard key={card.id} card={card} index={i} />
          ))}
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
