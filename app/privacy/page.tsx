export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 20px', fontFamily: 'var(--font-body)' }}>
      <a href="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>
        ← Back to FEWS
      </a>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 8, fontWeight: 400 }}>Privacy Policy</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 32 }}>Last updated: January 2025</p>

      <div style={{ lineHeight: 1.8, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>1. Information We Collect</h2>
          <p>FEWS (fews.in) does not collect any personally identifiable information from our visitors. We do not require registration or login. We may use third-party analytics tools (such as Google Analytics) to understand aggregate usage patterns. These tools may set cookies.</p>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>2. Cookies</h2>
          <p>We may use cookies for analytics and advertising purposes (Google AdSense). You can disable cookies in your browser settings. By using FEWS, you consent to our use of cookies in accordance with this policy.</p>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>3. Third-Party Advertising</h2>
          <p>FEWS uses Google AdSense to serve advertisements. Google may use cookies to show ads based on your prior visits to our website or other websites. You may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener" style={{ color: 'var(--primary)' }}>Google Ads Settings</a>.</p>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>4. News Content</h2>
          <p>All news summaries on FEWS are AI-generated rewrites based on publicly available news. Original articles are linked and attributed to their respective sources. FEWS does not claim ownership of any original news content.</p>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>5. Contact</h2>
          <p>For any privacy concerns, please contact us at: <a href="mailto:hello@fews.in" style={{ color: 'var(--primary)' }}>hello@fews.in</a></p>
        </section>
      </div>
    </div>
  );
}
