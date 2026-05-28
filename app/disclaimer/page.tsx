export default function Disclaimer() {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 20px', fontFamily: 'var(--font-body)' }}>
      <a href="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>← Back to FEWS</a>
      <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 32, marginBottom: 8, fontWeight: 700 }}>Disclaimer</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 32 }}>Last updated: January 2025</p>
      <div style={{ lineHeight: 1.8, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <section style={{ background: '#FFF8E8', border: '1px solid #F5D87A', borderRadius: 12, padding: '16px 20px' }}>
          <p style={{ color: '#7A5C00', fontWeight: 500, fontSize: 14 }}>⚠️ Nothing on FEWS constitutes financial advice or a recommendation to buy or sell any financial instrument.</p>
        </section>
        <section><h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Not Financial Advice</h2><p>All content is for informational purposes only. Consult a SEBI-registered advisor before making investment decisions.</p></section>
        <section><h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Accuracy</h2><p>AI-generated summaries may contain errors. Always verify from original sources before acting.</p></section>
        <section><h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Investment Risk</h2><p>All investments are subject to market risks. Past performance is not indicative of future results.</p></section>
      </div>
    </div>
  );
}
