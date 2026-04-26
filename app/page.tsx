import NewsFeed from '@/components/NewsFeed';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <header style={{ padding: '20px 0 0', textAlign: 'center' }}>
        <div style={{ paddingInline: 'max(16px, env(safe-area-inset-left))' }}>
          <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 8vw, 44px)', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1 }}>
              FEWS
            </h1>
            <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', marginBottom: 6, flexShrink: 0 }} />
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--secondary)', marginTop: 2 }}>
            Financial News
          </p>
        </div>
        <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, var(--primary), var(--accent), transparent)', marginTop: 16 }} />
      </header>

      <main style={{ flex: 1, width: '100%', maxWidth: 680, margin: '0 auto', padding: '20px max(16px, env(safe-area-inset-left)) 40px' }}>
        <NewsFeed />
      </main>

      <footer style={{ textAlign: 'center', padding: '20px 16px max(20px, env(safe-area-inset-bottom))', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
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
  );
}
