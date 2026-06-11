'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show banner only if user hasn't already consented
    const consent = localStorage.getItem('fews-cookie-consent');
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('fews-cookie-consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('fews-cookie-consent', 'declined');
    setVisible(false);
    // Disable Google Analytics and AdSense personalisation if declined
    if (typeof window !== 'undefined') {
      (window as any)['ga-disable-G-XXXXXXXX'] = true; // replace with your GA ID
    }
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        padding: '16px max(16px, env(safe-area-inset-left))',
        boxShadow: '0 -4px 24px rgba(13,27,42,0.10)',
      }}
    >
      <div
        style={{
          maxWidth: 680,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          We use cookies and similar technologies to improve your experience, analyse site traffic, and show relevant ads via Google AdSense.
          Third parties including Google may place and read cookies on your browser.{' '}
          <a
            href="/privacy"
            style={{ color: 'var(--primary)', textDecoration: 'underline' }}
          >
            Privacy Policy
          </a>{' '}
          ·{' '}
          <a
            href="https://www.google.com/policies/privacy/partners/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--primary)', textDecoration: 'underline' }}
          >
            How Google uses data
          </a>
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={accept}
            style={{
              padding: '8px 20px',
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            Accept All
          </button>
          <button
            onClick={decline}
            style={{
              padding: '8px 20px',
              background: 'transparent',
              color: 'var(--text-secondary)',
              border: '1.5px solid var(--border)',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            Decline
          </button>
          <a
            href="/privacy"
            style={{
              padding: '8px 16px',
              fontSize: 13,
              color: 'var(--text-muted)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            Manage preferences
          </a>
        </div>
      </div>
    </div>
  );
}
