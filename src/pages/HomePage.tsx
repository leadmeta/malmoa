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
          <p id="hero-brand" className="hero-brand">
            Malmoa
          </p>
          <h1>Learn Hangul, then unlock Korean through Hanja stories.</h1>
          <p className="hero-support">
            Picture, sticker, and story — the Malmoa method that turns letters
            and characters into lasting memory.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/waitlist">
              Join early access
            </Link>
            <Link className="btn btn-secondary" to="/lesson/hangul-demo">
              Try a sample lesson
            </Link>
          </div>
        </div>
      </section>

      <section className="section shell home-method">
        <p className="section-label">Why Malmoa</p>
        <h2>Stories you remember. Literacy that sticks.</h2>
        <p className="lede">
          Since 2020 we have built Korean materials for foreign learners. After
          crowdfunding our picture-and-story Hanja textbook on Wadiz, we are
          opening a guided path from Hangul foundations to Hanja vocabulary —
          online.
        </p>
        <div className="method-strip">
          <article>
            <h3>See it</h3>
            <p>Shapes map to vivid pictures — a gun, a nose, a tree trunk.</p>
          </article>
          <article>
            <h3>Story it</h3>
            <p>A short narrative locks sound, form, and meaning together.</p>
          </article>
          <article>
            <h3>Speak it</h3>
            <p>From jamo to everyday words, then character-powered vocab.</p>
          </article>
        </div>
        <Link className="text-link" to="/method">
          Explore the method →
        </Link>
      </section>

      <section className="section path-section">
        <div className="shell">
          <p className="section-label">Learning path</p>
          <h2>Hangul first. Hanja next.</h2>
          <p className="lede">
            One continuous program — four stages from alphabet to literacy.
          </p>
          <ol className="path-list">
            {curriculum.map((stage, i) => (
              <li key={stage.id} className="path-item" style={{ animationDelay: `${i * 80}ms` }}>
                <span className="path-week">{stage.week}</span>
                <h3>{stage.title}</h3>
                <p>{stage.summary}</p>
              </li>
            ))}
          </ol>
          <Link className="btn btn-secondary" to="/program">
            Full curriculum
          </Link>
        </div>
      </section>

      <section className="section shell demos-teaser">
        <p className="section-label">Sample lessons</p>
        <h2>Feel the method in two minutes.</h2>
        <div className="demo-pair">
          <Link to="/lesson/hangul-demo" className="demo-tile">
            <span className="demo-kicker">Hangul</span>
            <strong>Story consonants</strong>
            <span>ㄱ · ㄴ · ㅁ with a matching quiz</span>
          </Link>
          <Link to="/lesson/hanja-demo" className="demo-tile demo-tile-alt">
            <span className="demo-kicker">Hanja</span>
            <strong>木 tree story</strong>
            <span>Meaning + derivative words</span>
          </Link>
        </div>
      </section>

      <section className="cta-band">
        <div className="shell cta-inner">
          <h2>Early access for the first pilot cohort</h2>
          <p>
            Leave your email. We will invite a small group to the Hangul → Hanja
            path with textbook-aligned guidance.
          </p>
          <Link className="btn btn-ember" to="/waitlist">
            Request a seat
          </Link>
        </div>
      </section>
    </>
  )
}
