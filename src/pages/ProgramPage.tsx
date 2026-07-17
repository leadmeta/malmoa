import { Link } from 'react-router-dom'
import { curriculum } from '../data/content'
import './InnerPages.css'

export function ProgramPage() {
  return (
    <div className="shell page-hero reveal">
      <p className="section-label">Program</p>
      <h1>From Hangul blocks to Hanja meaning</h1>
      <p>
        A four-stage path designed for adult foreign learners. Start with the
        alphabet, build everyday Korean, then expand vocabulary through Malmoa’s
        picture-and-story Hanja bridge.
      </p>

      <div className="stage-stack section">
        {curriculum.map((stage) => (
          <article key={stage.id} className="stage-block" id={stage.id}>
            <div className="stage-meta">
              <span>{stage.week}</span>
              <h2>{stage.title}</h2>
            </div>
            <p>{stage.summary}</p>
            <ul>
              {stage.outcomes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="pilot-note">
        <h3>Pilot format (Phase 1)</h3>
        <p>
          Small cohorts of 20–40 learners. Twice-weekly guided sessions plus
          async practice aligned with the Malmoa textbook. Early-access waitlist
          members are invited first — pricing will be shared at invite time.
        </p>
        <div className="hero-actions" style={{ marginTop: '1.25rem' }}>
          <Link className="btn btn-primary" to="/waitlist">
            Join the waitlist
          </Link>
          <Link className="btn btn-secondary" to="/lesson/hangul-demo">
            Preview Hangul demo
          </Link>
        </div>
      </div>
    </div>
  )
}
