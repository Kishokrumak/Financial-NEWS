export default function About() {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 20px', fontFamily: 'var(--font-body)' }}>
      <a href="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>
        ← Back to FEWS
      </a>

      <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 32, marginBottom: 8, fontWeight: 700 }}>About FEWS</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 32 }}>Financial News · Simplified for Every Indian Investor</p>

      <div style={{ lineHeight: 1.8, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 28 }}>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>What is FEWS?</h2>
          <p>FEWS is a financial news platform built for beginners. We believe that every Indian — not just those with a finance background — deserves access to clear, simple, and timely financial news.</p>
          <p style={{ marginTop: 10 }}>Whether you have a SIP, want to understand what the RBI does, or simply want to know why gold prices are rising, FEWS explains it in plain English (and Tamil).</p>
        </section>

        <section style={{ background: 'var(--surface-2)', borderRadius: 12, padding: '20px 24px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>How Our Editorial Process Works</h2>
          <p style={{ marginBottom: 12 }}>Every article on FEWS goes through a multi-step process before it reaches you:</p>
          <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <li><strong>Source:</strong> We fetch financial news from licensed third-party news APIs (NewsAPI, Marketaux, GNews) that aggregate from reputed Indian and global financial publications.</li>
            <li><strong>Filter:</strong> Our system automatically removes any articles that are not finance-related — lifestyle, fashion, celebrity news, and non-financial topics are blocked.</li>
            <li><strong>Rewrite:</strong> Each article is independently rewritten by an AI model (Claude by Anthropic) into 3–4 beginner-friendly bullet points in simple English. This is not a copy or paraphrase — it is an original summary written for a first-time Indian retail investor.</li>
            <li><strong>Label:</strong> Every summary is clearly labelled <strong>"AI Summary by FEWS"</strong> so readers always know they are reading an AI-generated summary, not the original article.</li>
            <li><strong>Link:</strong> Every card links directly to the original source article so readers can read the full story.</li>
          </ol>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>What FEWS Covers</h2>
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li><strong>Stocks & Equity</strong> — Nifty, Sensex, NSE, BSE, individual stocks</li>
            <li><strong>Mutual Funds</strong> — SIPs, NAV changes, SEBI regulations, new fund launches</li>
            <li><strong>Gold & Silver</strong> — MCX prices, global commodity movements, import duty changes</li>
            <li><strong>Economy & RBI</strong> — Repo rate decisions, inflation, GDP, Union Budget, fiscal policy</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Our Commitment</h2>
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>We never recommend buying or selling specific stocks or assets</li>
            <li>We only report facts — no opinions, no predictions, no stock tips</li>
            <li>We clearly label all AI-generated content</li>
            <li>We always credit and link to the original source</li>
            <li>News resets daily — only today's news is shown</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Disclaimer</h2>
          <p>FEWS is for informational purposes only. Nothing on this site is financial advice. Always consult a SEBI-registered investment advisor before making investment decisions. See our full <a href="/disclaimer" style={{ color: 'var(--primary)' }}>Disclaimer</a>.</p>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Contact</h2>
          <p><a href="mailto:hello@fews.in" style={{ color: 'var(--primary)' }}>hello@fews.in</a></p>
        </section>

      </div>
    </div>
  );
}
