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
        <p className="lede" style={{ marginBottom: '1.5rem' }}>
          Since 2020, Malmoa has researched Korean literacy for global learners. After
          two highly successful crowdfunding campaigns on Wadiz, we have digitized our
          proven visual workbook system. Now, you can build a sustainable bridge from basic Hangul letters
          to advanced vocabulary.
        </p>

        {/* Real Wadiz Philosophy Card */}
        <div style={{ margin: '1.5rem 0 2.5rem 0', textAlign: 'center' }}>
          <img
            src="/wadiz-assets/asset2.jpg"
            alt="Philosophy of Literacy and Vocabulary"
            style={{ maxWidth: '500px', width: '100%', borderRadius: '16px', border: '1px solid var(--line)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}
          />
        </div>

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

        {/* Real Wadiz Video and Kit Demo Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', marginTop: '3.5rem', alignItems: 'start' }}>
          {/* 1. Real Wadiz Campaign Video */}
          <div>
            <h4 style={{ margin: '0 0 0.75rem 0', fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--teal-deep)' }}>
              🎥 Watch the Mnemonic Stickers in Action
            </h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', marginBottom: '1rem', lineHeight: 1.5 }}>
              See how global students apply our colorful mnemonic stickers directly onto the workbook pages to trigger active retrieval.
            </p>
            <video
              src="/wadiz-assets/asset3.mp4"
              controls
              loop
              muted
              autoPlay
              style={{ width: '100%', borderRadius: '16px', border: '1px solid var(--line)', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}
            />
          </div>

          {/* 2. Real Mnemonic Workbook & Stickers */}
          <div>
            <h4 style={{ margin: '0 0 0.75rem 0', fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--teal-deep)' }}>
              📚 The Complete Mnemonic Study Kit
            </h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', marginBottom: '1rem', lineHeight: 1.5 }}>
              Our 2x successful Wadiz campaign kit featuring 4 core workbooks, 170+ association stickers, and intermediate vocabulary maps.
            </p>
            <img
              src="/wadiz-assets/asset1.jpg"
              alt="Wadiz campaign textbook kit"
              style={{ width: '100%', height: 'auto', borderRadius: '16px', border: '1px solid var(--line)', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}
            />
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
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

      {/* Wadiz Campaign Gallery & Media Archive */}
      <section className="section shell wadiz-gallery-section" style={{ background: 'color-mix(in srgb, var(--paper-cool) 30%, white)', padding: '4rem 2rem', borderRadius: '32px', border: '1px solid var(--line)', margin: '3rem auto' }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Wadiz Media Archive</p>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontFamily: 'var(--font-display)', fontSize: '2.2rem' }}>
          Real Campaign Assets & Tacit Materials
        </h2>
        <p style={{ textAlign: 'center', maxWidth: '44rem', margin: '0 auto 3rem auto', color: 'var(--ink-soft)' }}>
          Explore the actual study materials, interactive GIFs, and short clips that drove our 2,300%+ funding success on Wadiz. See the direct-reading system in motion.
        </p>

        {/* Media Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          
          {/* Item 1: Animated Sticker Loop (GIF) */}
          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid var(--line)', padding: '1.25rem', boxShadow: '0 4px 15px rgba(0,0,0,0.01)', transition: 'all 0.25s ease' }} className="board-post-card">
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--teal-deep)' }}>✨ Interactive Sticker Play (Wadiz GIF)</h4>
            <img 
              src="/wadiz-assets/wadiz_8.gif" 
              alt="Mnemonic sticker application" 
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }} 
            />
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginTop: '0.75rem', lineHeight: 1.4 }}>
              Tactile Mnemonic stickers trigger visual association, forcing active recall of Hanja root meanings.
            </p>
          </div>

          {/* Item 2: Real Class Video (MP4) */}
          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid var(--line)', padding: '1.25rem', boxShadow: '0 4px 15px rgba(0,0,0,0.01)', transition: 'all 0.25s ease' }} className="board-post-card">
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--teal-deep)' }}>🎥 Real Study Demonstration</h4>
            <video 
              src="/wadiz-assets/wadiz_6.mp4" 
              controls 
              loop 
              muted 
              autoPlay 
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }} 
            />
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginTop: '0.75rem', lineHeight: 1.4 }}>
              Demonstration clip showing children and adults mapping visual roots to intermediate 어휘 (vocabulary).
            </p>
          </div>

          {/* Item 3: Satisfaction Graphic (PNG) */}
          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid var(--line)', padding: '1.25rem', boxShadow: '0 4px 15px rgba(0,0,0,0.01)', transition: 'all 0.25s ease' }} className="board-post-card">
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--teal-deep)' }}>⭐️ Backer Satisfaction Score</h4>
            <img 
              src="/wadiz-assets/wadiz_1.png" 
              alt="Backer satisfaction 5.0" 
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }} 
            />
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginTop: '0.75rem', lineHeight: 1.4 }}>
              A perfect 5.0 satisfaction score across our campaigns. Backed by hundreds of eager Korean learners.
            </p>
          </div>

          {/* Item 4: Rote Memorization VS Mnemonic (PNG) */}
          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid var(--line)', padding: '1.25rem', boxShadow: '0 4px 15px rgba(0,0,0,0.01)', transition: 'all 0.25s ease' }} className="board-post-card">
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--teal-deep)' }}>📈 The Core Methodology Card</h4>
            <img 
              src="/wadiz-assets/wadiz_4.png" 
              alt="Hanja root mapping comparison" 
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }} 
            />
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginTop: '0.75rem', lineHeight: 1.4 }}>
              Traditional rote writing compared against Malmoa\'s visual association meaning networks.
            </p>
          </div>

          {/* Item 5: Direct Reading Concept (GIF) */}
          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid var(--line)', padding: '1.25rem', boxShadow: '0 4px 15px rgba(0,0,0,0.01)', transition: 'all 0.25s ease' }} className="board-post-card">
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--teal-deep)' }}>⚡️ Direct Meaning Matching (GIF)</h4>
            <img 
              src="/wadiz-assets/wadiz_12.gif" 
              alt="Direct reading animation" 
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }} 
            />
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginTop: '0.75rem', lineHeight: 1.4 }}>
              Watch how our digital bridge automatically structures Chinese radicals into readable Korean words.
            </p>
          </div>

          {/* Item 6: Children Literacy Class (MP4) */}
          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid var(--line)', padding: '1.25rem', boxShadow: '0 4px 15px rgba(0,0,0,0.01)', transition: 'all 0.25s ease' }} className="board-post-card">
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--teal-deep)' }}>🎥 Classroom Sticker Activity</h4>
            <video 
              src="/wadiz-assets/wadiz_15.mp4" 
              controls 
              loop 
              muted 
              autoPlay 
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }} 
            />
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginTop: '0.75rem', lineHeight: 1.4 }}>
              Live clip from our offline literacy classrooms where learners match sticker shapes to words.
            </p>
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
