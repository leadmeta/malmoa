import { Link } from 'react-router-dom'
import { curriculum } from '../data/content'
import './HomePage.css'

export function HomePage() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-brand">
        <div className="hero-plane" aria-hidden="true">
          <div className="hero-glyphs">
            <span>ㄱ</span>
            <span>ㅏ</span>
            <span>木</span>
            <span>한</span>
            <span>글</span>
          </div>
          <svg className="hero-wave" viewBox="0 0 1440 200" preserveAspectRatio="none">
            <path
              d="M0,120 C240,40 480,180 720,110 C960,40 1200,150 1440,80 L1440,200 L0,200 Z"
              fill="url(#heroGrad)"
            />
            <defs>
              <linearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0d7377" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#c45c26" stopOpacity="0.22" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="shell hero-copy reveal">
          <div className="wadiz-badge">
            <span className="badge-icon">★</span> 2,300%+ Funded on Wadiz Crowdfunding
          </div>
          <p id="hero-brand" className="hero-brand">
            Malmoa
          </p>
          <h1>Master Korean Vocabulary via Picture-Story Mnemonics.</h1>
          <p className="hero-support">
            Picture, sticker, and story — Malmoa’s patented system unlocks the Hanja roots that form over 70% of intermediate Korean vocabulary.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/shop">
              Get Textbook & Coaching
            </Link>
            <Link className="btn btn-secondary" to="/lesson/hanja-demo">
              Try Hanja Demo
            </Link>
          </div>
        </div>
      </section>

      <section className="section shell home-method">
        <p className="section-label">Our Philosophy</p>
        <h2>Stories you remember. Literacy that lasts.</h2>
        <p className="lede">
          Since 2020, Malmoa has researched Korean literacy for global learners. After
          two highly successful crowdfunding campaigns on Wadiz, we have digitized our
          proven visual workbook system. Now, you can build a sustainable bridge from basic Hangul letters
          to advanced vocabulary.
        </p>
        <div className="method-strip">
          <article>
            <div className="step-num">01</div>
            <h3>See the Image</h3>
            <p>Letter shapes and characters map directly to vivid, intuitive pictures (like tree branches or a profile nose).</p>
          </article>
          <article>
            <div className="step-num">02</div>
            <h3>Lock with a Story</h3>
            <p>A simple, contextual English narrative binds the sound, visual shape, and core meaning together forever.</p>
          </article>
          <article>
            <div className="step-num">03</div>
            <h3>Bridge to Vocabulary</h3>
            <p>Use root meanings to deconstruct and learn dozens of advanced words from a single Hanja root.</p>
          </article>
        </div>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link className="btn btn-secondary" to="/method">
            Explore the Method Details →
          </Link>
        </div>
      </section>

      <section className="section path-section">
        <div className="shell">
          <p className="section-label">Learning Path</p>
          <h2>Four Stages to Native Literacy</h2>
          <p className="lede">
            A cohesive curriculum bridging basic phonetic letters to advanced reading and critical thinking.
          </p>
          <ol className="path-list">
            {curriculum.map((stage, i) => (
              <li key={stage.id} className="path-item" style={{ animationDelay: `${i * 80}ms` }}>
                <span className="path-week">{stage.week}</span>
                <h3>{stage.title}</h3>
                <p>{stage.summary}</p>
                <ul className="path-outcomes" style={{ marginTop: '0.75rem', paddingLeft: '1.2rem', fontSize: '0.9rem', opacity: 0.9 }}>
                  {stage.outcomes.map((out, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>{out}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <Link className="btn btn-secondary" to="/program">
              Full Program & Schedule
            </Link>
          </div>
        </div>
      </section>

      <section className="section shell demos-teaser">
        <p className="section-label">Try it Now</p>
        <h2>Feel the difference in just 2 minutes.</h2>
        <div className="demo-pair">
          <Link to="/lesson/hangul-demo" className="demo-tile">
            <span className="demo-kicker">Stage 1 Demo</span>
            <strong>Hangul Mnemonic Play</strong>
            <span>Study consonants ㄱ, ㄴ, ㅁ with interactive sound matching</span>
          </Link>
          <Link to="/lesson/hanja-demo" className="demo-tile demo-tile-alt">
            <span className="demo-kicker">Stage 2 Demo</span>
            <strong>Hanja Bridge: 木 (Tree)</strong>
            <span>See how one symbol unlocks four complex Korean words</span>
          </Link>
        </div>
      </section>

      <section className="cta-band">
        <div className="shell cta-inner">
          <h2>Ready to fast-track your Korean literacy?</h2>
          <p>
            Get our 2x Wadiz-Funded physical workbook package shipped to your door, complete with sticker packs, bookmarks, and 1:1 coach supervision.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <Link className="btn btn-ember" to="/shop">
              Visit the Store
            </Link>
            <Link className="btn btn-secondary" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }} to="/waitlist">
              Book a Free Consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
