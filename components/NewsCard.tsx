'use client';

import { useState } from 'react';
import type { NewsCard as NewsCardType } from '@/lib/news';

const CATEGORY_STYLES: Record<string, { pill: string; label: string }> = {
  'Stocks & Equity': { pill: 'cat-stocks',  label: 'Stocks & Equity' },
  'Mutual Funds':    { pill: 'cat-mutual',  label: 'Mutual Funds' },
  'Gold & Silver':   { pill: 'cat-gold',    label: 'Gold & Silver' },
  'Economy & RBI':   { pill: 'cat-economy', label: 'Economy & RBI' },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ', ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

interface Props {
  card: NewsCardType;
  index: number;
}

export default function NewsCard({ card, index }: Props) {
  const [copied, setCopied] = useState(false);
  const style = CATEGORY_STYLES[card.category] || CATEGORY_STYLES['Economy & RBI'];

  const shareText = `${card.title}\n\n${card.bullets.map(b => `• ${b}`).join('\n')}\n\nRead more: ${card.sourceUrl}\n\nvia FEWS – fews.in`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: card.title, text: shareText, url: card.sourceUrl });
      } catch {}
      return;
    }
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article
      className="animate-fade-up"
      style={{
        animationDelay: `${index * 60}ms`,
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-md)',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        border: '1px solid var(--border)',
        width: '100%',
      }}
    >
      {/* Top row: category pill + date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <span
          className={style.pill}
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '4px 10px',
            borderRadius: '20px',
            whiteSpace: 'nowrap',
          }}
        >
          {style.label}
        </span>
        <time
          dateTime={card.publishedAt}
          style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}
        >
          {formatDate(card.publishedAt)}
        </time>
      </div>

      {/* Title */}
      <h2
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(18px, 4.5vw, 22px)',
          fontWeight: 400,
          lineHeight: 1.35,
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
        }}
      >
        {card.title}
      </h2>

      {/* Bullet points */}
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {card.bullets.map((bullet, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              gap: '10px',
              fontSize: '14px',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--primary)',
                flexShrink: 0,
                marginTop: '8px',
              }}
            />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* Footer: source + actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <a
          href={card.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '12px',
            color: 'var(--primary)',
            fontWeight: 500,
            textDecoration: 'none',
            padding: '6px 12px',
            borderRadius: '20px',
            border: '1.5px solid var(--primary)',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'var(--primary)';
            (e.currentTarget as HTMLElement).style.color = '#fff';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'var(--primary)';
          }}
        >
          <span>Read Full Article</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>

        <button
          onClick={handleShare}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '12px',
            color: copied ? '#1E8A4C' : 'var(--text-secondary)',
            fontWeight: 500,
            background: copied ? '#EDF7F0' : 'var(--surface-2)',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.15s',
            fontFamily: 'var(--font-body)',
          }}
          aria-label="Share this news"
        >
          {copied ? (
            <>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 7l3.5 3.5L11 3" stroke="#1E8A4C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <circle cx="10" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
                <circle cx="10" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
                <circle cx="2.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M8.5 3.3L4 5.7M4 7.3l4.5 2.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              Share
            </>
          )}
        </button>
      </div>
    </article>
  );
}
