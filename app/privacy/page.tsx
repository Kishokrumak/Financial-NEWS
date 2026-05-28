export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 20px', fontFamily: 'var(--font-body)' }}>
      <a href="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>← Back to FEWS</a>
      <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 32, marginBottom: 8, fontWeight: 700 }}>Privacy Policy</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 32 }}>Last updated: January 2025</p>
      <div style={{ lineHeight: 1.8, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <section><h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>1. Information We Collect</h2><p>FEWS does not collect personally identifiable information. We may use Google Analytics for aggregate usage patterns.</p></section>
        <section><h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>2. Cookies</h2><p>We use cookies for analytics and advertising (Google AdSense). You can disable cookies in your browser settings.</p></section>
        <section><h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>3. Third-Party Advertising</h2><p>FEWS uses Google AdSense. Google may use cookies to personalise ads. Opt out at <a href="https://adssettings.google.com" target="_blank" rel="noopener" style={{ color: 'var(--primary)' }}>Google Ads Settings</a>.</p></section>
        <section><h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>4. Contact</h2><p><a href="mailto:hello@fews.in" style={{ color: 'var(--primary)' }}>hello@fews.in</a></p></section>
      </div>
    </div>
  );
}
