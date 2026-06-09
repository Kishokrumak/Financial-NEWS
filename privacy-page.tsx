export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 20px', fontFamily: 'var(--font-body)' }}>
      <a href="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>
        ← Back to FEWS
      </a>

      <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 32, marginBottom: 8, fontWeight: 700 }}>Privacy Policy</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 32 }}>Last updated: January 2025</p>

      <div style={{ lineHeight: 1.8, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 28 }}>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>1. About FEWS</h2>
          <p>FEWS (fews.in) is a financial news aggregation service that uses artificial intelligence to summarise publicly available news articles into simple, beginner-friendly bullet points for Indian retail investors. FEWS does not publish original news — all summaries are clearly labelled "AI Summary by FEWS" and link to the original source article.</p>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>2. Information We Collect</h2>
          <p>FEWS does not require you to register or create an account. We do not directly collect any personally identifiable information such as your name, email address, or phone number.</p>
          <p style={{ marginTop: 10 }}>However, when you visit FEWS, certain information may be automatically collected by third-party services we use, including:</p>
          <ul style={{ marginTop: 10, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>Your IP address and approximate location</li>
            <li>Browser type and version</li>
            <li>Pages visited and time spent on the site</li>
            <li>Device type (mobile, tablet, desktop)</li>
            <li>Referring website</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>3. Cookies</h2>
          <p>FEWS uses cookies — small text files stored on your browser — for the following purposes:</p>
          <ul style={{ marginTop: 10, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li><strong>Analytics cookies</strong> — to understand how visitors use our site (via Google Analytics)</li>
            <li><strong>Advertising cookies</strong> — to show relevant advertisements (via Google AdSense)</li>
          </ul>
          <p style={{ marginTop: 10 }}>You can disable cookies at any time through your browser settings. Note that disabling cookies may affect some functionality of the site.</p>
        </section>

        {/* This section is specifically required by Google AdSense policy */}
        <section style={{ background: 'var(--primary-light)', border: '1px solid #C5D8FF', borderRadius: 12, padding: '20px 24px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>4. Third-Party Advertising (Google AdSense)</h2>
          <p>FEWS uses <strong>Google AdSense</strong> to display advertisements. Google AdSense is a third-party advertising service operated by Google LLC.</p>

          <p style={{ marginTop: 12 }}><strong>Important:</strong> Google and its partners may use cookies, web beacons, and similar tracking technologies to:</p>
          <ul style={{ marginTop: 10, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>Place and read cookies on your browser</li>
            <li>Collect data about your visits to FEWS and other websites</li>
            <li>Show you personalised advertisements based on your browsing history</li>
            <li>Measure the performance of advertisements</li>
          </ul>

          <p style={{ marginTop: 12 }}>
            To learn more about how Google uses data collected from sites that use Google services, please visit:{' '}
            <a
              href="https://www.google.com/policies/privacy/partners/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--primary)', fontWeight: 500 }}
            >
              How Google uses data when you use our partners' sites or apps
            </a>
          </p>

          <p style={{ marginTop: 12 }}>
            You can opt out of personalised advertising by visiting:{' '}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--primary)', fontWeight: 500 }}
            >
              Google Ads Settings
            </a>
          </p>

          <p style={{ marginTop: 12 }}>
            You can also opt out of third-party vendor cookies for personalised advertising by visiting the{' '}
            <a
              href="https://www.networkadvertising.org/choices/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--primary)', fontWeight: 500 }}
            >
              Network Advertising Initiative opt-out page
            </a>.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>5. Google Analytics</h2>
          <p>We use Google Analytics to understand how visitors interact with FEWS. Google Analytics collects information such as how often users visit, what pages they visit, and what other sites they used prior to coming to FEWS. We use this information only to improve FEWS.</p>
          <p style={{ marginTop: 10 }}>Google Analytics collects only the IP address assigned to you on the date you visit FEWS. We do not combine the information collected through Google Analytics with personally identifiable information.</p>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>6. News Content & AI Summaries</h2>
          <p>All news summaries on FEWS are generated by an AI model (Claude by Anthropic) based on publicly available news articles sourced via licensed third-party APIs (NewsAPI, Marketaux, GNews). Every summary is clearly labelled <strong>"AI Summary by FEWS"</strong> and includes a link to the original source article. FEWS does not claim ownership of any original news content.</p>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>7. Data Sharing</h2>
          <p>FEWS does not sell, trade, or rent your personal information to third parties. We do not share personal information with third parties except as described in this policy (Google AdSense, Google Analytics) or when required by law.</p>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>8. Children's Privacy</h2>
          <p>FEWS is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided personal information to us, please contact us and we will delete it.</p>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify users of significant changes by updating the date at the top of this page. Continued use of FEWS after changes constitutes acceptance of the updated policy.</p>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>10. Contact</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:{' '}
            <a href="mailto:hello@fews.in" style={{ color: 'var(--primary)' }}>hello@fews.in</a>
          </p>
        </section>

      </div>
    </div>
  );
}
