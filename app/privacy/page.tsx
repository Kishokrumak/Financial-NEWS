export default function PrivacyPolicy() {
  const sectionHead = { fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 } as const;
  const link = { color: 'var(--primary)', textDecoration: 'none' } as const;

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 20px', fontFamily: 'var(--font-body)' }}>
      <a href="/" style={{ ...link, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>
        ← Back to FEWS
      </a>

      <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 32, marginBottom: 8, fontWeight: 700 }}>Privacy Policy</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 32 }}>Last updated: June 2025</p>

      <div style={{ lineHeight: 1.8, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 28 }}>

        <section>
          <h2 style={sectionHead}>1. About FEWS</h2>
          <p>FEWS (fews.in) is a financial news aggregation and summarisation platform. We use artificial intelligence to rewrite publicly available news articles into simple, beginner-friendly summaries for Indian retail investors. All summaries are clearly labelled <strong>"AI Summary by FEWS"</strong> and link to the original source article. FEWS does not publish original news or claim ownership of any source content.</p>
        </section>

        <section>
          <h2 style={sectionHead}>2. Information We Collect</h2>
          <p>FEWS does not require registration or login. We do not directly collect personally identifiable information such as your name, email address, or phone number. However, when you visit FEWS, the following information may be automatically collected by third-party services we use:</p>
          <ul style={{ marginTop: 10, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>Your IP address and approximate location</li>
            <li>Browser type, version, and device type</li>
            <li>Pages visited, time on site, and referring website</li>
          </ul>
        </section>

        <section>
          <h2 style={sectionHead}>3. Cookies</h2>
          <p>FEWS and our third-party partners use cookies — small text files stored in your browser — for the following purposes:</p>
          <ul style={{ marginTop: 10, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li><strong>Analytics cookies</strong> — to understand aggregate usage patterns (Google Analytics)</li>
            <li><strong>Advertising cookies</strong> — to show relevant advertisements (Google AdSense)</li>
          </ul>
          <p style={{ marginTop: 10 }}>You can disable cookies at any time in your browser settings. Disabling cookies may affect how some parts of this site work.</p>
        </section>

        {/* This section satisfies Google's mandatory privacy disclosure requirement */}
        <section style={{ background: 'var(--primary-light)', border: '1px solid #C5D8FF', borderRadius: 12, padding: '20px 24px' }}>
          <h2 style={sectionHead}>4. Third-Party Advertising — Google AdSense</h2>
          <p>FEWS uses <strong>Google AdSense</strong> to display advertisements. This is a third-party advertising service operated by Google LLC.</p>

          <p style={{ marginTop: 12 }}><strong>Third parties, including Google, may place and read cookies on your browser</strong> and use web beacons, pixel tags, and similar technologies to collect information as a result of ad serving on this website. This information may be used to serve ads based on your prior visits to this or other websites.</p>

          <p style={{ marginTop: 12 }}>To learn how Google uses data when you use sites that use Google services, please visit:<br />
            <a href="https://www.google.com/policies/privacy/partners/" target="_blank" rel="noopener noreferrer" style={link}>
              How Google uses data when you use our partners' sites or apps →
            </a>
          </p>

          <p style={{ marginTop: 12 }}>To opt out of personalised advertising by Google:<br />
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={link}>
              Google Ads Settings →
            </a>
          </p>

          <p style={{ marginTop: 12 }}>To opt out of third-party vendor advertising cookies generally:<br />
            <a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" style={link}>
              Network Advertising Initiative opt-out →
            </a>
          </p>

          <p style={{ marginTop: 12 }}>To learn more about interest-based advertising and your choices:<br />
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={link}>
              Digital Advertising Alliance — Your Ad Choices →
            </a>
          </p>
        </section>

        <section>
          <h2 style={sectionHead}>5. Google Analytics</h2>
          <p>We use Google Analytics to understand how visitors interact with FEWS in aggregate. Google Analytics collects information such as how often users visit, what pages they visit, and what other sites they used prior to visiting FEWS. We use this solely to improve the site. We do not combine Google Analytics data with personally identifiable information.</p>
        </section>

        <section>
          <h2 style={sectionHead}>6. AI-Generated Content</h2>
          <p>All news summaries on FEWS are generated by an AI model (Claude by Anthropic) based on publicly available news articles sourced through licensed third-party APIs. Every summary is clearly labelled <strong>"AI Summary by FEWS"</strong> and includes a link to the original article. We do not claim ownership of any source content.</p>
        </section>

        <section>
          <h2 style={sectionHead}>7. Data Sharing</h2>
          <p>FEWS does not sell, trade, or rent your personal information. We share data only as described in this policy (Google AdSense, Google Analytics) or when required by law.</p>
        </section>

        <section>
          <h2 style={sectionHead}>8. Children's Privacy</h2>
          <p>FEWS is not directed at children under 13 years of age. We do not knowingly collect personal information from children. If you believe a child has provided personal information to us, please contact us and we will delete it promptly.</p>
        </section>

        <section>
          <h2 style={sectionHead}>9. Your Rights</h2>
          <p>You have the right to access, correct, or request deletion of any personal information we hold about you. To make such a request, contact us at the email below. We will respond within 30 days.</p>
        </section>

        <section>
          <h2 style={sectionHead}>10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify users of significant changes by updating the date at the top of this page. Continued use of FEWS after any changes constitutes your acceptance of the updated policy.</p>
        </section>

        <section>
          <h2 style={sectionHead}>11. Contact</h2>
          <p>For any questions about this Privacy Policy:<br />
            <a href="mailto:hello@fews.in" style={link}>hello@fews.in</a>
          </p>
        </section>

      </div>
    </div>
  );
}
