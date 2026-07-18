import { Link } from 'react-router-dom'
import { curriculum } from '../data/content'
import './InnerPages.css'

export function CurriculumPage() {
  return (
    <div className="shell reveal" style={{ paddingBottom: '4rem', marginTop: '2rem' }}>
      
      {/* Course Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div className="wadiz-badge" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
          📖 Malmoa V2.0 Syllabus Preview
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 'bold' }}>
          Explore the Full 12-Week Course Roadmap
        </h1>
        <p style={{ color: 'var(--ink-soft)', maxWidth: '38rem', margin: '0.75rem auto 0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
          A systemic curriculum designed to bridge absolute beginners from single phoneme letters to complex newspaper editorial reading. Click <strong>⚡ Classroom</strong> above to join the active classes matching your tier.
        </p>
      </div>

      {/* SECTION 1: 12-WEEK ROADMAP BLOCKS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        {curriculum.map((stage, i) => (
          <div 
            key={stage.id} 
            className="edu-card-chunky" 
            style={{ 
              padding: '2rem', 
              animationDelay: `${i * 100}ms`,
              position: 'relative'
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--teal-deep)', background: '#e2f1f1', padding: '0.25rem 0.6rem', borderRadius: '6px', textTransform: 'uppercase' }}>
              {stage.week}
            </span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 'bold', margin: '0.85rem 0 0.5rem 0' }}>
              {stage.title}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              {stage.summary}
            </p>
            <hr style={{ borderColor: 'var(--line)', margin: '1rem 0' }} />
            <h5 style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>Core Outcomes:</h5>
            <ul className="path-outcomes" style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--ink-soft)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {stage.outcomes.map((out, idx) => (
                <li key={idx}>{out}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* NEW SECTION: PHYSICAL TEXTBOOK KIT SHOWCASE (와디즈 이미지 연동) */}
      <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: '28px', padding: '3rem', marginBottom: '4rem' }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Wadiz Physical Kit Pack</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
          Deconstruct the 2,300%+ Funded Study Materials
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--ink-soft)', maxWidth: '36rem', margin: '0 auto 3rem auto', fontSize: '0.98rem', lineHeight: 1.6 }}>
          Offline physical workbook packs designed to maximize visual mapping logic. Trace strokes on paper, paste mnemonic stickers, and track your retention.
        </p>

        {/* 1. Core Textbook, Workbook, bookmark */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
          <div className="edu-card-chunky" style={{ background: 'var(--paper-cool)', padding: '1.5rem' }}>
            <img src="/wadiz-assets/wadiz_34.png" alt="문해력 고수의 일급비밀 교재" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '16px', border: '1px solid var(--line)', marginBottom: '1.25rem' }} />
            <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>1. Primary Study Textbook</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              The core textbook outlining phonetic organ mapping, Chinese Hanja radical trees, and direct reading (직독직해) translation formulas.
            </p>
          </div>

          <div className="edu-card-chunky" style={{ background: 'var(--paper-cool)', padding: '1.5rem' }}>
            <img src="/wadiz-assets/wadiz_35.png" alt="문해력 고수의 일급 비밀 워크북" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '16px', border: '1px solid var(--line)', marginBottom: '1.25rem' }} />
            <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>2. Practical Mnemonic Workbook</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              Active workbook sheets featuring drawing grids to test stroke orders and matching blank cards to paste cartoon labels on.
            </p>
          </div>

          <div className="edu-card-chunky" style={{ background: 'var(--paper-cool)', padding: '1.5rem' }}>
            <img src="/wadiz-assets/wadiz_38.png" alt="사은품 책갈피 겸 학습 가리개" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '16px', border: '1px solid var(--line)', marginBottom: '1.25rem' }} />
            <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>3. Bookmark & Study Mask Shield</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              A dual-purpose visual shield that masks English translations on text blocks, forcing active recall of Hangul definitions.
            </p>
          </div>
        </div>

        {/* 2. Syllabus components details: 37 subject hanja, 12 field hanja, picture pdf */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
          <div className="edu-card-chunky" style={{ padding: '1.5rem' }}>
            <img src="/wadiz-assets/wadiz_36.png" alt="37개 주제별 필수 한자" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '16px', border: '1px solid var(--line)', marginBottom: '1.25rem' }} />
            <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>4. 37 Core Subject Categories</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              Hanja roots classified into 37 daily life categories (nature, time, humanity) to promote intuitive cluster learning.
            </p>
          </div>

          <div className="edu-card-chunky" style={{ padding: '1.5rem' }}>
            <img src="/wadiz-assets/wadiz_37.png" alt="12개 분야별 실용 한자어" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '16px', border: '1px solid var(--line)', marginBottom: '1.25rem' }} />
            <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>5. 12 Professional Field Clusters</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              Academic vocabulary tailored to 12 professional fields (law, finance, science) to transition learners into news editorials.
            </p>
          </div>

          <div className="edu-card-chunky" style={{ padding: '1.5rem' }}>
            <img src="/wadiz-assets/wadiz_40.png" alt="한자어 그림 PDF 파일" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '16px', border: '1px solid var(--line)', marginBottom: '1.25rem' }} />
            <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>6. Visual Hanja Mnemonic PDF</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              A high-definition visual index detailing the etymology network map of Sino-Korean roots for fast reference.
            </p>
          </div>
        </div>

        {/* 3. Community activity & overall package structure */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1.25rem' }}>
              Motivate Yourself with the Learner Community
            </h3>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, fontSize: '0.98rem', marginBottom: '1.5rem' }}>
              Study groups and active discussions accelerate language acquisition. Submit your homework sheets, share score milestones, and rank high on the XP leaderboards.
            </p>
            <img src="/wadiz-assets/wadiz_39.png" alt="사이트의 커뮤니티 활동을 통한 지속적인 동기부여" style={{ width: '100%', height: 'auto', borderRadius: '16px', border: '1px solid var(--line)', display: 'block' }} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1.25rem' }}>
              Complete Course Package Layout
            </h3>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, fontSize: '0.98rem', marginBottom: '1.5rem' }}>
              Everything shipped safely in a single box directly from our logistics center in Seoul. Track your dispatched package in the admin desk.
            </p>
            <img src="/wadiz-assets/wadiz_41.png" alt="교재 구성 전체 패키지" style={{ width: '100%', height: 'auto', borderRadius: '16px', border: '1px solid var(--line)', display: 'block' }} />
          </div>
        </div>

      </div>

      {/* SECTION 2: THE SYLLABUS TASTE-TEST SAMPLES */}
      <div style={{ background: '#f8fafc', border: '1px solid var(--line)', borderRadius: '28px', padding: '3rem', marginBottom: '4rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          💡 Taste-Test: Malmoa\'s Visual Mnemonics
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--ink-soft)', maxWidth: '34rem', margin: '0 auto 2.5rem auto', fontSize: '0.95rem' }}>
          We bridge dry Korean vowels/consonants and Sino-Korean Hanja roots with vivid visual anchors. See how a single node expands your vocabulary network.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {/* Hangul sample */}
          <div style={{ background: 'white', border: '1px solid var(--line)', padding: '1.75rem', borderRadius: '20px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--teal)' }}>STAGE 1 SAMPLE</span>
            <div style={{ fontSize: '3rem', margin: '0.5rem 0', fontFamily: 'var(--font-display)' }}>ㄱ</div>
            <h4 style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>The "Gun" Consonant</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              The shape of "ㄱ" resembles a hand-gun pointing left. Tying the sound "g/k" to the visual trigger of a "Gun" locks it in your memory forever.
            </p>
          </div>

          {/* Hanja sample */}
          <div style={{ background: 'white', border: '1px solid var(--line)', padding: '1.75rem', borderRadius: '20px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--teal)' }}>STAGE 4 SAMPLE</span>
            <div style={{ fontSize: '3rem', margin: '0.5rem 0', fontFamily: 'var(--font-display)' }}>木</div>
            <h4 style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>The "Tree" Root</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              Unlocking the root symbol "木" (목) instantly branches out into a vocabulary family: 나무, 목재 (Timber), 수목 (Arboretum), 목판 (Woodblock).
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: LEARNING SCIENCE SHOWCASE */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '2.5rem', textAlign: 'center' }}>
          🧠 The Scientific Principles behind our Course
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div className="edu-card-chunky" style={{ padding: '2rem' }}>
            <span style={{ fontSize: '2rem' }}>🌀</span>
            <h4 style={{ fontWeight: 'bold', margin: '0.75rem 0 0.5rem 0', fontSize: '1.15rem' }}>Dual Coding Engine</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              Simultaneously stimulating both the visual memory center and the verbal phonetics center. This dual mapping creates strong neural hooks.
            </p>
          </div>

          <div className="edu-card-chunky" style={{ padding: '2rem' }}>
            <span style={{ fontSize: '2rem' }}>🎯</span>
            <h4 style={{ fontWeight: 'bold', margin: '0.75rem 0 0.5rem 0', fontSize: '1.15rem' }}>Active Recall Tracing</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              Our tracing board doesn\'t allow passive copying. Learners follow direction guidelines and trace strokes to reinforce physiological muscle memory.
            </p>
          </div>

          <div className="edu-card-chunky" style={{ padding: '2rem' }}>
            <span style={{ fontSize: '2rem' }}>📉</span>
            <h4 style={{ fontWeight: 'bold', margin: '0.75rem 0 0.5rem 0', fontSize: '1.15rem' }}>Spaced Repetition</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              Syllables are regularly tested through spelling exercises and raindrop typer games at scientific intervals before memory decay sets in.
            </p>
          </div>
        </div>
      </div>

      {/* FINAL CALL-TO-ACTION BAND */}
      <div className="cta-band" style={{ textAlign: 'center', padding: '5rem 3rem', margin: '4rem 0 0 0' }}>
        <h2 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginBottom: '1.25rem', fontWeight: 800 }}>
          Ready to attend your class?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '34rem', margin: '0 auto 2.5rem auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Classroom adapts to your licensed tier automatically. Non-members can try basic Hangul tracing exercises for free immediately.
        </p>
        <Link to="/demo-hub" className="edu-btn-secondary-3d" style={{ padding: '1rem 3rem', fontSize: '1.05rem' }}>
          Enter Classroom →
        </Link>
      </div>

    </div>
  )
}
