import NewsFeed from '@/components/NewsFeed';

export default function Home() {
  return (
    <>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg)',
        }}
      >
        {/* Header — white with shadow, no gradient line */}
        <header
          style={{
            padding: '18px 0',
            textAlign: 'center',
            background: '#FFFFFF',
            boxShadow: '0 1px 12px rgba(13,27,42,0.07)',
            position: 'sticky',
            top: 0,
            zIndex: 20,
          }}
        >
          <div style={{ paddingInline: 'max(16px, env(safe-area-inset-left))' }}>
            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>
              <h1
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(24px, 6vw, 32px)',
                  fontWeight: 600,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                }}
              >
                FEWS
              </h1>
              <span
                style={{
                  display: 'inline-block',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  marginBottom: 5,
                  flexShrink: 0,
                }}
              />
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginTop: 2,
              }}
            >
              Financial News
            </p>
          </div>
        </header>

        {/* Main content */}
        <main
          style={{
            flex: 1,
            width: '100%',
            maxWidth: 680,
            margin: '0 auto',
            padding: '20px max(16px, env(safe-area-inset-left)) 40px',
          }}
        >
          <NewsFeed />
        </main>

        {/* Footer */}
        <footer
          style={{
            textAlign: 'center',
            padding: '20px 16px max(20px, env(safe-area-inset-bottom))',
            borderTop: '1px solid var(--border)',
            background: 'var(--surface)',
          }}
        >
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            © 2025 FEWS · Financial news simplified for Indian investors
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 4 }}>
            News sourced from public APIs · AI-summarized for clarity ·{' '}
            <a href="/disclaimer" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Disclaimer</a>
            {' · '}
            <a href="/privacy" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Privacy Policy</a>
          </p>
        </footer>
      </div>
    </>
  );
}
