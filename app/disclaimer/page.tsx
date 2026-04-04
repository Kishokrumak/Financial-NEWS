export default function Disclaimer() {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 20px', fontFamily: 'var(--font-body)' }}>
      <a href="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>
        ← Back to FEWS
      </a>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 8, fontWeight: 400 }}>Disclaimer</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 32 }}>Last updated: January 2025</p>

      <div style={{ lineHeight: 1.8, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <section style={{ background: '#FFF8E8', border: '1px solid #F5D87A', borderRadius: 12, padding: '16px 20px' }}>
          <p style={{ color: '#7A5C00', fontWeight: 500, fontSize: 14 }}>
            ⚠️ FEWS is a news aggregation and summarization service. Nothing on this website constitutes financial advice, investment advice, or a recommendation to buy or sell any financial instrument.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Not Financial Advice</h2>
          <p>All content on FEWS is for informational and educational purposes only. The news summaries are AI-generated rewrites of publicly available news articles. Always consult a SEBI-registered investment advisor before making any investment decisions.</p>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Accuracy of Information</h2>
          <p>While we strive to present accurate summaries, FEWS cannot guarantee the accuracy, completeness, or timeliness of news summaries. AI-generated summaries may contain errors. Always verify information from original sources before acting on it.</p>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Third-Party Content</h2>
          <p>News articles are sourced from third-party providers via licensed APIs. FEWS is not responsible for the content of external websites. Original article links are provided for reference.</p>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Investment Risk</h2>
          <p>Investments in stocks, mutual funds, gold, and other financial instruments are subject to market risks. Past performance is not indicative of future results. Please read all scheme-related documents carefully.</p>
        </section>
      </div>
    </div>
  );
}
