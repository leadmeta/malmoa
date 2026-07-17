import { Link } from 'react-router-dom'
import { curriculum } from '../data/content'
import './InnerPages.css'

export function ProgramPage() {
  return (
    <div className="shell page-hero reveal" style={{ paddingBottom: '4rem' }}>
      <p className="section-label">Curriculum</p>
      <h1>From Hangul Sounds to Hanja Meaning</h1>
      <p style={{ maxWidth: '44rem', fontSize: '1.15rem', color: 'var(--ink-soft)' }}>
        A structured, 4-stage path designed specifically for global Korean language learners. 
        Start with the visual alphabet foundations, build fluent everyday dialogue, and unlock thousands of intermediate-to-advanced words through Malmoa’s picture-story Hanja bridge.
      </p>

      <div className="stage-stack section" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginTop: '2rem' }}>
        {curriculum.map((stage) => (
          <article key={stage.id} className="stage-block" id={stage.id} style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--line)', display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.01)' }}>
            <div className="stage-meta" style={{ borderBottom: '1px solid var(--line)', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--ember)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stage.week}</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', margin: '0.25rem 0 0 0' }}>{stage.title}</h2>
            </div>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>{stage.summary}</p>
            <h4 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '0.92rem', fontWeight: 'bold', color: 'var(--teal-deep)' }}>Key Learning Outcomes:</h4>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--ink-soft)', display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.92rem', margin: 0 }}>
              {stage.outcomes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="pilot-note" style={{ background: 'color-mix(in srgb, var(--paper-cool) 35%, white)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--line)', marginTop: '2rem' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', margin: '0 0 0.5rem 0' }}>1:1 Live Online Coaching</h3>
        <p style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
          Align your study speed with a professional native Korean tutor. 
          Get custom homework grading, live pronunciation coaching over Zoom (twice a week), and milestone certifications. 
          Order our Mnemonic Coaching Bundle in the store, or schedule a free 15-minute level check to learn more.
        </p>
        <div className="hero-actions" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link className="btn btn-primary" to="/shop">
            Order Study Package
          </Link>
          <Link className="btn btn-secondary" to="/waitlist">
            Book Free Consultation
          </Link>
        </div>
      </div>
    </div>
  )
}
