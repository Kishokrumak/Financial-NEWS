'use client';

import { useState } from 'react';
import type { NewsCard as NewsCardType } from '@/lib/news';

type Language = 'en' | 'ta';

const CATEGORY_STYLES: Record<string, { pill: string; label: string; labelTa: string }> = {
  'Stocks & Equity': { pill: 'cat-stocks',  label: 'Stocks & Equity', labelTa: 'பங்குகள்' },
  'Mutual Funds':    { pill: 'cat-mutual',  label: 'Mutual Funds',    labelTa: 'மியூச்சுவல் ஃபண்ட்' },
  'Gold & Silver':   { pill: 'cat-gold',    label: 'Gold & Silver',   labelTa: 'தங்கம் & வெள்ளி' },
  'Economy & RBI':   { pill: 'cat-economy', label: 'Economy & RBI',   labelTa: 'பொருளாதாரம்' },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    + ', ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function NewsCard({ card, index, lang = 'en' }: { card: NewsCardType; index: number; lang?: Language }) {
  const [copied, setCopied] = useState(false);
  const style = CATEGORY_STYLES[card.category] || CATEGORY_STYLES['Economy & RBI'];
  const isTamil = lang === 'ta';

  const shareText = `${card.title}\n\n${card.bullets.map(b => `• ${b}`).join('\n')}\n\n${isTamil ? 'முழு கட்டுரை படிக்க' : 'Read more'}: ${card.sourceUrl}\n\nvia FEWS – fews.in`;

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: card.title, text: shareText, url: card.sourceUrl }); } catch {}
      return;
    }
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="animate-fade-up" style={{
      animationDelay: `${index * 60}ms`,
      background: 'var(--surface)', borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow-md)', padding: '24px 20px',
      display: 'flex', flexDirection: 'column', gap: 16,
      border: '1px solid var(--border)', width: '100%',
    }}>

      {/* Row 1: Category pill + date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <span className={style.pill} style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
          {isTamil ? style.labelTa : style.label}
        </span>
        <time dateTime={card.publishedAt} style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {formatDate(card.publishedAt)}
        </time>
      </div>

      {/* Title */}
      <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(17px,4.5vw,20px)', fontWeight: 600, lineHeight: 1.35, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
        {card.title}
      </h2>

      {/* AI Summary label — clearly marks this as transformed/curated content */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <circle cx="6.5" cy="6.5" r="5.5" stroke="#3176FF" strokeWidth="1.3"/>
          <path d="M4 6.5l1.8 1.8L9 4.5" stroke="#3176FF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600, letterSpacing: '0.04em' }}>
          {isTamil ? 'FEWS-ஆல் AI சுருக்கம்' : 'AI Summary by FEWS'}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 2 }}>
          · {isTamil ? 'மூல கட்டுரையிலிருந்து' : `Source: ${card.sourceName}`}
        </span>
      </div>

      {/* Bullet points */}
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {card.bullets.map((bullet, i) => (
          <li key={i} style={{ display: 'flex', gap: 10, fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: 8 }} />
            <span style={{ fontFamily: isTamil ? "'Noto Sans Tamil', 'Latha', sans-serif" : 'var(--font-body)' }}>
              {bullet}
            </span>
          </li>
        ))}
      </ul>

      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* Footer: Read Full Article + Share */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <a href={card.sourceUrl} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--primary)', fontWeight: 500, textDecoration: 'none', padding: '6px 12px', borderRadius: 20, border: '1.5px solid var(--primary)', transition: 'background 0.15s, color 0.15s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--primary)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--primary)'; }}
        >
          {isTamil ? 'முழு கட்டுரை' : 'Read Full Article'}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </a>

        <button onClick={handleShare} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: copied ? '#1E8A4C' : 'var(--text-secondary)', fontWeight: 500, background: copied ? '#EDF7F0' : 'var(--surface-2)', border: 'none', padding: '6px 12px', borderRadius: 20, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font-body)' }}>
          {copied
            ? <><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 7l3.5 3.5L11 3" stroke="#1E8A4C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>{isTamil ? 'நகலெடுக்கப்பட்டது!' : 'Copied!'}</>
            : <><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="10" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.4"/><circle cx="10" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.4"/><circle cx="2.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8.5 3.3L4 5.7M4 7.3l4.5 2.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>{isTamil ? 'பகிர்' : 'Share'}</>
          }
        </button>
      </div>
    </article>
  );
}
