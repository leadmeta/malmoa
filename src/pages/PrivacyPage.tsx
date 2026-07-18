import './InnerPages.css'

export function PrivacyPage() {
  return (
    <div className="shell reveal" style={{ marginTop: '3rem', paddingBottom: '5rem', maxWidth: '800px' }}>
      <div className="edu-card-chunky" style={{ padding: '2.5rem', background: 'white' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--teal-deep)' }}>
          🔒 Privacy Policy (개인정보처리방침)
        </h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginBottom: '2rem' }}>
          *Last updated: July 19, 2026*
        </p>

        <p style={{ color: 'var(--ink)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Malmoa Education Co., Ltd. ("we", "our", or "us") values your privacy. This Privacy Policy describes how we collect, use, and share your personal data when you visit our portal, use our interactive Hangul and Hanja demo classes, buy textbook kits, or submit coaching slot inquiries.
        </p>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 'bold', marginTop: '2rem', marginBottom: '0.75rem' }}>
          1. Information We Collect (수집하는 개인정보)
        </h3>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
          We collect personal information that you provide to us directly:
        </p>
        <ul style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', lineHeight: 1.6, paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
          <li><strong>Identity & Account Data:</strong> Usernames, credentials, and level placements.</li>
          <li><strong>Contact Details:</strong> Email address and phone numbers provided during coaching inquiries or waitlist requests.</li>
          <li><strong>Billing & Shipping Data:</strong> Destination addresses for physical textbook deliveries. (We do not process credit cards directly; all processing is handled by third-party payment gateways).</li>
          <li><strong>Activity Logs:</strong> XP points, typing speeds, game score statistics, and user forum contributions.</li>
        </ul>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 'bold', marginTop: '2rem', marginBottom: '0.75rem' }}>
          2. How We Use Your Information (개인정보 이용 목적)
        </h3>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          We use the collected information to:
          <br />• Provide, maintain, and optimize our learning games and classrooms.
          <br />• Ship Wadiz textbook packages and bookmarks to your location.
          <br />• Match you with certified native Korean tutors for VIP Coaching.
          <br />• Keep you updated on level achievements, homework comments, and leaderboard rankings.
        </p>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 'bold', marginTop: '2rem', marginBottom: '0.75rem' }}>
          3. Sharing and Retention (개인정보 제공 및 보유 기간)
        </h3>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          We do not sell your personal data. We only share information with trusted shipping courier partners to deliver textbook kits or tutor networks to arrange classroom meetings. 
          Your information is retained as long as your account is active, or up to 3 years after waitlist submission to resolve user service queries.
        </p>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 'bold', marginTop: '2rem', marginBottom: '0.75rem' }}>
          4. Your Rights (이용자의 권리)
        </h3>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          You have the right to request access, correction, or deletion of your personal data at any time. You can submit these requests by contacting us directly through our waitlist inquiry form or by emailing support@malmoa.edu.
        </p>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 'bold', marginTop: '2rem', marginBottom: '0.75rem' }}>
          5. Contact Us (문의처)
        </h3>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          If you have any questions about this Privacy Policy, please reach out to our privacy officer at privacy@malmoa.edu.
        </p>
      </div>
    </div>
  )
}
