'use client';

import { useState, useEffect, useCallback } from 'react';
import NewsCard from './NewsCard';
import SkeletonCard from './SkeletonCard';
import type { NewsCard as NewsCardType, Category } from '@/lib/news';

type Language = 'en' | 'ta';

const CATEGORIES: { label: string; labelTa: string; value: Category | 'All' }[] = [
  { label: 'All',           labelTa: 'அனைத்தும்',     value: 'All' },
  { label: 'Stocks',        labelTa: 'பங்குகள்',       value: 'Stocks & Equity' },
  { label: 'Mutual Funds',  labelTa: 'மியூச்சுவல் ஃபண்ட்', value: 'Mutual Funds' },
  { label: 'Gold & Silver', labelTa: 'தங்கம் & வெள்ளி', value: 'Gold & Silver' },
  { label: 'Economy',       labelTa: 'பொருளாதாரம்',    value: 'Economy & RBI' },
];

function formatUpdated(iso: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function NewsFeed() {
  const [allNews, setAllNews]         = useState<NewsCardType[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [category, setCategory]       = useState<Category | 'All'>('All');
  const [sort, setSort]               = useState<'newest' | 'oldest'>('newest');
  const [lastUpdated, setLastUpdated] = useState('');
  const [newBadge, setNewBadge]       = useState(0);
  const [lang, setLang]               = useState<Language>('en');
  const [langLoading, setLangLoading] = useState(false);

  const fetchNews = useCallback(async (language: Language = 'en') => {
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(`/api/news?lang=${language}`);
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

  // Language switch — re-fetch in chosen language
  const handleLangToggle = async () => {
    const newLang: Language = lang === 'en' ? 'ta' : 'en';
    setLang(newLang);
    setLangLoading(true);
    setError('');
    try {
      const res  = await fetch(`/api/news?lang=${newLang}`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setAllNews(data.news || []);
      setLastUpdated(data.updatedAt);
    } catch {
      setError('Could not load news. Please try again.');
    } finally {
      setLangLoading(false);
    }
  };

  // Silent 15-min refresh — passes current language
  const silentRefresh = useCallback(async (language: Language) => {
    try {
      const res  = await fetch(`/api/news/refresh?lang=${language}`);
      if (!res.ok) return;
      const data = await res.json();
      const incoming: NewsCardType[] = data.news || [];
      setAllNews(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const newArticles = incoming.filter(n => !existingIds.has(n.id));
        if (newArticles.length === 0) return prev;
        setNewBadge(b => b + newArticles.length);
        return [...newArticles, ...prev];
      });
      setLastUpdated(data.updatedAt);
    } catch {}
  }, []);

  useEffect(() => {
    fetchNews('en');
  }, [fetchNews]);

  useEffect(() => {
    const interval = setInterval(() => silentRefresh(lang), 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [lang, silentRefresh]);

  const filtered = allNews
    .filter(n => category === 'All' || n.category === category)
    .sort((a, b) => {
      const diff = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      return sort === 'newest' ? diff : -diff;
    });

  const isTamil = lang === 'ta';

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* Sticky filter bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(245,247,250,0.93)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        paddingTop: 12, paddingBottom: 10, marginBottom: 20,
      }}>
        {/* Row 1: Category pills + sort */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 2 }}>
          {CATEGORIES.map(c => (
            <button key={c.value} onClick={() => setCategory(c.value)} style={{
              whiteSpace: 'nowrap', padding: '7px 16px', borderRadius: 20,
              border: category === c.value ? '2px solid var(--primary)' : '1.5px solid var(--border)',
              background: category === c.value ? 'var(--primary)' : 'var(--surface)',
              color: category === c.value ? '#fff' : 'var(--text-secondary)',
              fontFamily: 'var(--font-body)', fontSize: 13,
              fontWeight: category === c.value ? 600 : 400,
              cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
            }}>
              {isTamil ? c.labelTa : c.label}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
            <button onClick={() => setSort(s => s === 'newest' ? 'oldest' : 'newest')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '7px 14px', borderRadius: 20,
              border: '1.5px solid var(--border)', background: 'var(--surface)',
              color: 'var(--text-secondary)', fontFamily: 'var(--font-body)',
              fontSize: 12, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
            }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                {sort === 'newest'
                  ? <path d="M2 3h9M2 6.5h6M2 10h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  : <path d="M2 3h3M2 6.5h6M2 10h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>}
              </svg>
              {isTamil ? (sort === 'newest' ? 'புதியது' : 'பழையது') : (sort === 'newest' ? 'Newest' : 'Oldest')}
            </button>
          </div>
        </div>

        {/* Row 2: Updated time + new badge + language toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, paddingLeft: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {lastUpdated && (
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {isTamil ? 'புதுப்பிக்கப்பட்டது' : 'Updated'} {formatUpdated(lastUpdated)}
              </p>
            )}
            {newBadge > 0 && (
              <button
                onClick={() => { setNewBadge(0); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                style={{ fontSize: 11, fontWeight: 600, color: '#fff', background: 'var(--accent)', border: 'none', padding: '2px 10px', borderRadius: 20, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
              >
                +{newBadge} {isTamil ? 'புதியவை ↑' : 'new ↑'}
              </button>
            )}
          </div>

          {/* Language toggle */}
          <button
            onClick={handleLangToggle}
            disabled={langLoading}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 20,
              border: '1.5px solid var(--primary)',
              background: isTamil ? 'var(--primary)' : 'transparent',
              color: isTamil ? '#fff' : 'var(--primary)',
              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
              cursor: langLoading ? 'wait' : 'pointer',
              transition: 'all 0.2s', opacity: langLoading ? 0.6 : 1,
              flexShrink: 0,
            }}
          >
            {langLoading ? (
              <span style={{ fontSize: 11 }}>...</span>
            ) : (
              <>
                <span style={{ fontSize: 13 }}>அ</span>
                {isTamil ? 'தமிழ்' : 'Tamil'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Feed */}
      {loading || langLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>{error}</p>
          <button onClick={() => fetchNews(lang)} style={{ padding: '10px 24px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 20, fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
            {isTamil ? 'மீண்டும் முயற்சி' : 'Try Again'}
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 28, marginBottom: 12 }}>🌅</p>
          <p style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
            {isTamil ? 'இன்றைய செய்திகள் வருகின்றன' : "Today's news is on its way"}
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {isTamil
              ? 'இன்று புதிய செய்திகள் வெளியிடப்படும்போது இங்கே தோன்றும். கொஞ்சம் நேரம் கழித்து சரிபாருங்கள்.'
              : `Fresh news for ${category === 'All' ? 'all categories' : category} will appear here as it gets published today. Check back in a little while.`
            }
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map((card, i) => <NewsCard key={card.id} card={card} index={i} lang={lang} />)}
        </div>
      )}

      {!loading && !langLoading && !error && filtered.length > 0 && (
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', padding: '24px 0 8px' }}>
          {filtered.length} {isTamil ? 'கட்டுரைகள் இன்று' : `article${filtered.length !== 1 ? 's' : ''} today`}
        </p>
      )}
    </div>
  );
}
