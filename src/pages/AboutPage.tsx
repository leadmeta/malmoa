import { Link } from 'react-router-dom'
import './InnerPages.css'

export function AboutPage() {
  return (
    <div className="shell reveal" style={{ marginTop: '3rem', paddingBottom: '5rem', maxWidth: '800px' }}>
      <div className="edu-card-chunky" style={{ padding: '2.5rem', background: 'white' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--teal-deep)' }}>
          🏢 About Malmoa (회사 소개)
        </h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Welcome to Malmoa. We are dedicated to revolutionizing Korean language and literacy education for global learners. 
          By combining advanced cognitive association methods with interactive digital classrooms, we make mastering Hangul and Hanja (Sino-Korean roots) intuitive, engaging, and memorable.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '2rem 0' }} />

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Our Core Mission (우리의 사명)
        </h3>
        <p style={{ color: 'var(--ink)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
          Korean literacy is often perceived as a daunting hurdle due to complex spelling rules and the heavy influence of Hanja (Hanja accounts for over 60% of Korean vocabulary). 
          Our mission is to lower this barrier through our **"Picture-Mnemonic & Story Association"** curriculum, helping learners build concrete mental bridges between shapes, sounds, and meanings.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '2rem', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--paper-cool)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--line)' }}>
            <h4 style={{ fontWeight: 'bold', color: 'var(--teal-deep)', margin: '0 0 0.5rem 0' }}>🎓 Pedagogical Excellence</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', margin: 0, lineHeight: 1.5 }}>
              Designed by certified Korean linguists and memory coaches to optimize retention rates.
            </p>
          </div>
          <div style={{ background: 'var(--paper-cool)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--line)' }}>
            <h4 style={{ fontWeight: 'bold', color: 'var(--teal-deep)', margin: '0 0 0.5rem 0' }}>🚀 Wadiz Crowdfunded</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', margin: 0, lineHeight: 1.5 }}>
              Backed by over thousands of supporters who validated our physical textbooks & mnemonic kits.
            </p>
          </div>
        </div>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Company Overview (기업 개요)
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: '2.5rem' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--line)' }}>
              <td style={{ padding: '0.75rem 0', fontWeight: 'bold', width: '150px' }}>Company Name</td>
              <td style={{ padding: '0.75rem 0', color: 'var(--ink-soft)' }}>Malmoa Education Co., Ltd. (주식회사 말모아 에듀케이션)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--line)' }}>
              <td style={{ padding: '0.75rem 0', fontWeight: 'bold' }}>Founding Date</td>
              <td style={{ padding: '0.75rem 0', color: 'var(--ink-soft)' }}>August 2024</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--line)' }}>
              <td style={{ padding: '0.75rem 0', fontWeight: 'bold' }}>HQ Location</td>
              <td style={{ padding: '0.75rem 0', color: 'var(--ink-soft)' }}>Seoul, Republic of Korea</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--line)' }}>
              <td style={{ padding: '0.75rem 0', fontWeight: 'bold' }}>Business Area</td>
              <td style={{ padding: '0.75rem 0', color: 'var(--ink-soft)' }}>EdTech platform, Textbook publishing, 1:1 online coaching systems</td>
            </tr>
          </tbody>
        </table>

        <div style={{ textAlign: 'center' }}>
          <Link to="/waitlist" className="edu-btn-3d" style={{ display: 'inline-block', padding: '0.75rem 2rem', fontSize: '0.92rem', borderRadius: '12px' }}>
            Book a Partnership Consultation ➔
          </Link>
        </div>
      </div>
    </div>
  )
}
