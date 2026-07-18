import './InnerPages.css'

export function TermsPage() {
  return (
    <div className="shell reveal" style={{ marginTop: '3rem', paddingBottom: '5rem', maxWidth: '800px' }}>
      <div className="edu-card-chunky" style={{ padding: '2.5rem', background: 'white' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--teal-deep)' }}>
          📋 Terms of Service (이용약관)
        </h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginBottom: '2rem' }}>
          *Last updated: July 19, 2026*
        </p>

        <p style={{ color: 'var(--ink)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Welcome to the Malmoa learning portal. By accessing our services, websites, interactive typing games, and enrolling in classes, you agree to comply with and be bound by the following Terms of Service. Please read them carefully.
        </p>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 'bold', marginTop: '2rem', marginBottom: '0.75rem' }}>
          1. Use of Services (서비스 이용 규칙)
        </h3>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
          You must follow all guidelines provided within our games and classroom templates:
        </p>
        <ul style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', lineHeight: 1.6, paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
          <li>You are responsible for keeping your student account avatar and credentials secure.</li>
          <li>You agree not to bypass classroom paywalls or copy proprietary Mnemonic sticker assets.</li>
          <li>You may not use bots or scripts to automate typing speeds or artificially inflate XP leaderboard points.</li>
        </ul>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 'bold', marginTop: '2rem', marginBottom: '0.75rem' }}>
          2. Intellectual Property Rights (지식재산권)
        </h3>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          All content, including Hangul/Hanja associative diagrams, textbooks, bookmarks, game designs, and portal codebase, are the intellectual property of Malmoa Education Co., Ltd. and Wadiz project creators. 
          Unauthorized distribution, reproduction, or modification of these learning assets is strictly prohibited.
        </p>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 'bold', marginTop: '2rem', marginBottom: '0.75rem' }}>
          3. Deliveries and Refund Policies (배송 및 환불 정책)
        </h3>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          For physical textbook packages ordered via our waitlist:
          <br />• Shipments are dispatched from Seoul, South Korea, and domestic/international tracking details are updated in the admin desk.
          <br />• Requests for refunds or exchanges on physical kits must be submitted within 7 days of package delivery.
          <br />• Digital licensing packages and unlocked tiers are non-refundable once the course is accessed or started.
        </p>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 'bold', marginTop: '2rem', marginBottom: '0.75rem' }}>
          4. Limitation of Liability (책임의 한계)
        </h3>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Our interactive games and class exercises are designed to help learners study, but we make no guarantees about specific score improvements or linguistic test outcomes. 
          The service is provided "as is" without warranties of any kind.
        </p>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 'bold', marginTop: '2rem', marginBottom: '0.75rem' }}>
          5. Governing Law (관할법)
        </h3>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          These Terms of Service shall be governed by and construed in accordance with the laws of the Republic of Korea.
        </p>
      </div>
    </div>
  )
}
