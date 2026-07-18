import { useState } from 'react'
import { Link } from 'react-router-dom'
import './InnerPages.css'
import './HomePage.css'

type QuizQuestion = {
  prompt: string
  choices: string[]
  answer: string
}

const PLACEMENT_QUIZ: QuizQuestion[] = [
  {
    prompt: 'Which Hangul consonant maps to the visual story of a "Gun"?',
    choices: ['ㄴ (Nose)', 'ㄷ (Door)', 'ㄱ (Gun)', 'ㄹ (Rattlesnake)'],
    answer: 'ㄱ (Gun)'
  },
  {
    prompt: 'What is the English meaning of the daily vocabulary "나무"?',
    choices: ['Water', 'Tree', 'Stone', 'Fire'],
    answer: 'Tree'
  },
  {
    prompt: 'Choose the correct translation for the daily dialogue: "안녕하세요"',
    choices: ['Thank you', 'Goodbye', 'Hello', 'Please'],
    answer: 'Hello'
  }
]

export function HomePage() {
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizIndex, setQuizIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [quizFinished, setQuizFinished] = useState(false)
  const [resultTier, setResultTier] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner')

  // Launch placement modal
  const handleStartPlacement = () => {
    setShowQuiz(true)
    setQuizIndex(0)
    setCorrectCount(0)
    setSelectedChoice(null)
    setQuizFinished(false)
  }

  // Handle choice select
  const handleSelectChoice = (choice: string) => {
    if (selectedChoice) return
    setSelectedChoice(choice)
    if (choice === PLACEMENT_QUIZ[quizIndex].answer) {
      setCorrectCount((c) => c + 1)
    }
  }

  // Proceed to next question or evaluate final result
  const handleNextQuestion = () => {
    if (quizIndex < PLACEMENT_QUIZ.length - 1) {
      setQuizIndex((idx) => idx + 1)
      setSelectedChoice(null)
    } else {
      let tier: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner'
      const score = correctCount + (selectedChoice === PLACEMENT_QUIZ[quizIndex].answer ? 1 : 0)
      
      if (score === 2) tier = 'Intermediate'
      else if (score >= 3) tier = 'Advanced'

      setResultTier(tier)
      setQuizFinished(true)

      // Sync and upgrade profile tier instantly in localStorage
      const savedProfile = localStorage.getItem('malmoa-user-profile')
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile)
          parsed.tier = tier
          parsed.xp = (parsed.xp || 100) + 50
          localStorage.setItem('malmoa-user-profile', JSON.stringify(parsed))
        } catch {
          // Ignore
        }
      } else {
        const defaultProfile = { name: 'Anonymous Student', xp: 150, tier: tier }
        localStorage.setItem('malmoa-user-profile', JSON.stringify(defaultProfile))
      }
    }
  }

  // TTMIK Style Direct Checkout from Results Board
  const handleDirectCheckout = (itemName: string, category: 'textbook' | 'coaching' | 'course') => {
    if (category === 'textbook') {
      const saved = localStorage.getItem('malmoa-orders')
      let orders = []
      if (saved) {
        try { orders = JSON.parse(saved) } catch { }
      }
      orders.push({
        id: `ord-${Date.now()}`,
        item: itemName,
        buyer: 'Placement Student',
        status: 'Processing',
        date: new Date().toISOString().split('T')[0]
      })
      localStorage.setItem('malmoa-orders', JSON.stringify(orders))
      alert(`🎉 Package Ordered! Our admin logistics desk has been notified. Track it in your Admin desk.`)
    } else if (category === 'coaching') {
      const saved = localStorage.getItem('malmoa-coaching-orders')
      let coachingOrders = []
      if (saved) {
        try { coachingOrders = JSON.parse(saved) } catch { }
      }
      coachingOrders.push({
        id: `coach-${Date.now()}`,
        student: 'Placement Student',
        teacherId: 'unassigned',
        status: 'Matching Teacher',
        date: new Date().toISOString().split('T')[0]
      })
      localStorage.setItem('malmoa-coaching-orders', JSON.stringify(coachingOrders))
      alert(`👩‍🏫 Tutor Coaching Booked! Admin matching has started.`)
    }
    setShowQuiz(false)
  }

  return (
    <>
      {/* SECTION 1: HERO LANDING (Duolingo Style Hook) */}
      <section className="hero" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', background: 'radial-gradient(circle at 80% 20%, rgba(13,115,119,0.08) 0%, transparent 60%)', borderBottom: '1px solid var(--line)' }}>
        <div className="shell hero-grid-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', width: '100%', alignItems: 'center' }}>
          
          <div className="hero-copy reveal" style={{ textAlign: 'left' }}>
            <div className="wadiz-badge" style={{ display: 'inline-flex', background: 'color-mix(in srgb, var(--teal) 10%, white)', color: 'var(--teal-deep)', fontWeight: 'bold', padding: '0.4rem 0.8rem', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              ★ 2,300%+ Crowdfunded Mnemonic Method
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3.2rem', lineHeight: 1.1, fontWeight: 'bold', marginBottom: '1.25rem', color: 'var(--ink)' }}>
              Learn Korean via <br/>
              <span style={{ color: 'var(--teal-deep)' }}>Visual Stories & Games</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '2.25rem', maxWidth: '34rem' }}>
              Ditch the rote writing. Our patented picture-story association system maps abstract Korean letters and Hanja roots to vivid, memorable narratives. Fast-track your path to native fluency now.
            </p>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn btn-primary btn-pulse" 
                style={{ padding: '1rem 2.5rem', fontSize: '1.05rem', fontWeight: 'bold' }}
                onClick={handleStartPlacement}
              >
                Get Started (Diagnostic Test)
              </button>
              <Link 
                className="btn btn-secondary" 
                to="/play-hub" 
                style={{ padding: '1rem 2.5rem', fontSize: '1.05rem', fontWeight: 'bold' }}
              >
                Go to Play Zone
              </Link>
            </div>
            <p style={{ marginTop: '1.25rem', fontSize: '0.88rem', color: 'var(--ink-soft)' }}>
              Have an account already? Click <strong>🔑 Login</strong> at the top right.
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ background: '#f5f7fa', border: '1px solid var(--line)', borderRadius: '32px', padding: '1.5rem', boxShadow: '0 12px 30px rgba(0,0,0,0.03)' }}>
              <img 
                src="/wadiz-assets/asset1.jpg" 
                alt="Malmoa Mnemonic Kit Package" 
                style={{ width: '100%', height: 'auto', borderRadius: '24px', border: '1px solid var(--line)', display: 'block' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', padding: '0 0.5rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 'bold' }}>📚 Mnemonic Workbooks</span>
                <span style={{ fontSize: '0.88rem', color: 'var(--teal-deep)', fontWeight: 'bold' }}>2x Crowdfunding Winner</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: THE COGNITIVE PEDAGOGY (뇌과학적 원리) */}
      <section className="section shell" style={{ padding: '5rem 0', borderBottom: '1px solid var(--line)' }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Scientific Foundation</p>
        <h2 style={{ textAlign: 'center', marginBottom: '1.25rem', fontFamily: 'var(--font-display)', fontSize: '2.2rem' }}>
          Why Visual Association Solves Rote Memory Burnout
        </h2>
        <p style={{ textAlign: 'center', maxWidth: '38rem', margin: '0 auto 3.5rem auto', color: 'var(--ink-soft)', fontSize: '0.98rem', lineHeight: 1.6 }}>
          Learning a language requires building new neural networks. Traditional rote memorization (writing one character 100 times) fades from short-term memory within 48 hours. Here is how Malmoa overrides this limitation.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
          <div style={{ background: 'white', border: '1px solid var(--line)', padding: '2.5rem', borderRadius: '24px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🧠</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>Dual-Coding Theory</h3>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6, fontSize: '0.92rem' }}>
              Allan Paivio’s cognitive science shows that the brain processes verbal and visual information through separate channels. By tying Hangul characters to vivid cartoon imagery (like "ㄱ" representing a "Gun"), we store the letter in both channels, doubling retention rate.
            </p>
          </div>

          <div style={{ background: 'white', border: '1px solid var(--line)', padding: '2.5rem', borderRadius: '24px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📈</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>Active Recall Tracing</h3>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6, fontSize: '0.92rem' }}>
              Unlike passive reading, our interactive drawing canvas prompts you with a starting anchor point and vectors. Tracing stimulates tactile memory cells, enforcing active retrieval of the stroke order combined with visual cues.
            </p>
          </div>

          <div style={{ background: 'white', border: '1px solid var(--line)', padding: '2.5rem', borderRadius: '24px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🕸️</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>Vocabulary Root Networks</h3>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6, fontSize: '0.92rem' }}>
              Over 70% of intermediate Korean vocabulary originates from Sino-Korean roots (Hanja). Unsealing a single root symbol (e.g. "木" for tree) branches instantly into family networks like 나무, 목재, 수목. This systematic clustering prevents forgetting.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: 12-WEEK FULL SYLLABUS ROADMAP (주차별 세부 강의계획) */}
      <section className="section shell" style={{ padding: '5rem 0', borderBottom: '1px solid var(--line)' }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Syllabus Blueprint</p>
        <h2 style={{ textAlign: 'center', marginBottom: '1.25rem', fontFamily: 'var(--font-display)', fontSize: '2.2rem' }}>
          Your 12-Week Journey from Fundamentals to News Literacy
        </h2>
        <p style={{ textAlign: 'center', maxWidth: '38rem', margin: '0 auto 3.5rem auto', color: 'var(--ink-soft)', fontSize: '0.98rem', lineHeight: 1.6 }}>
          Designed systematically for native English speakers, progressing from absolute beginner phonetics to deciphering daily newspapers.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {/* Week 1-3 */}
          <div style={{ background: '#f8fafc', border: '1px solid var(--line)', padding: '1.75rem', borderRadius: '20px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--teal-deep)', background: '#e2f1f1', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>WEEKS 1-3</span>
            <h4 style={{ margin: '0.75rem 0 0.5rem 0', fontWeight: 'bold', fontSize: '1.1rem' }}>Stage 1: Basic Hangul</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              Master the 14 basic consonants and 10 vowels. Draw stroke vectors in our tracing canvas and connect shapes to visual stories (Gun, Nose, Door).
            </p>
            <ul style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', paddingLeft: '1.2rem', marginTop: '0.75rem' }}>
              <li>Consonant & vowel phonetics</li>
              <li>Anchored stroke tracing</li>
              <li>Sound association mapping</li>
            </ul>
          </div>

          {/* Week 4-6 */}
          <div style={{ background: '#f8fafc', border: '1px solid var(--line)', padding: '1.75rem', borderRadius: '20px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--teal-deep)', background: '#e2f1f1', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>WEEKS 4-6</span>
            <h4 style={{ margin: '0.75rem 0 0.5rem 0', fontWeight: 'bold', fontSize: '1.1rem' }}>Stage 2: Word Building</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              Begin stacking characters into syllable blocks. Learn word endings, particles, and basic sentence construction using vocabulary cards.
            </p>
            <ul style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', paddingLeft: '1.2rem', marginTop: '0.75rem' }}>
              <li>Syllabic block structure</li>
              <li>Level-2 interactive spelling</li>
              <li>Noun-verb modifiers</li>
            </ul>
          </div>

          {/* Week 7-9 */}
          <div style={{ background: '#f8fafc', border: '1px solid var(--line)', padding: '1.75rem', borderRadius: '20px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--teal-deep)', background: '#e2f1f1', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>WEEKS 7-9</span>
            <h4 style={{ margin: '0.75rem 0 0.5rem 0', fontWeight: 'bold', fontSize: '1.1rem' }}>Stage 3: Dialogues</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              Unseal real situational dialogues. Practice pronunciation, greetings, shopping scripts, and restaurant conversations via cartoon chat bubbles.
            </p>
            <ul style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', paddingLeft: '1.2rem', marginTop: '0.75rem' }}>
              <li>Daily conversation dialogue</li>
              <li>English translations switch</li>
              <li>1:1 Native chat simulation</li>
            </ul>
          </div>

          {/* Week 10-12 */}
          <div style={{ background: '#f8fafc', border: '1px solid var(--line)', padding: '1.75rem', borderRadius: '20px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--teal-deep)', background: '#e2f1f1', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>WEEKS 10-12</span>
            <h4 style={{ margin: '0.75rem 0 0.5rem 0', fontWeight: 'bold', fontSize: '1.1rem' }}>Stage 4: News & Hanja</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              Bridge to advanced text. Study news articles, unwrap Sino-Korean Hanja roots, and read complex sentences in the Advanced Raindrop Typer.
            </p>
            <ul style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', paddingLeft: '1.2rem', marginTop: '0.75rem' }}>
              <li>Real-world news analysis</li>
              <li>Hanja 어원 etymology networks</li>
              <li>Certificate of completion</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 4: THE PHYSICAL KIT UNBOXING (실물 워크북 & 스티커 패키지 상세) */}
      <section className="section shell" style={{ padding: '5rem 0', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          <div>
            <p className="section-label">Tactile Learning</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginBottom: '1.25rem' }}>
              What is Inside the Malmoa Physical Kit?
            </h2>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6, fontSize: '0.98rem', marginBottom: '1.5rem' }}>
              Our 2x successful Wadiz campaign study kit provides offline physical items that synchronize directly with this digital classroom portal. Engage your hands while studying.
            </p>
            
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: 0, listStyle: 'none' }}>
              <li style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{ color: 'var(--teal-deep)', fontWeight: 'bold' }}>✓</span>
                <div>
                  <strong>4 Core Association Workbooks</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', margin: '0.15rem 0 0 0' }}>Step-by-step paper workbooks outlining daily writing tasks, reading scripts, and visual prompts.</p>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{ color: 'var(--teal-deep)', fontWeight: 'bold' }}>✓</span>
                <div>
                  <strong>170+ Visual Mnemonic Stickers</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', margin: '0.15rem 0 0 0' }}>Engagement stickers featuring cartoon cues (Gun, Nose, Door) to paste directly onto target pages.</p>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{ color: 'var(--teal-deep)', fontWeight: 'bold' }}>✓</span>
                <div>
                  <strong>Etymology Hanja Mapping Charts</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', margin: '0.15rem 0 0 0' }}>Wall poster maps showing Sino-Korean roots spreading out into derived vocabulary networks.</p>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <img 
              src="/wadiz-assets/asset2.jpg" 
              alt="Workbook and Sticker layout" 
              style={{ width: '100%', height: 'auto', borderRadius: '24px', border: '1px solid var(--line)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}
            />
          </div>
        </div>
      </section>

      {/* SECTION 5: NATIVE KOREAN TUTORS CATALOG (전담 원어민 강사진 쇼케이스) */}
      <section className="section shell" style={{ padding: '5rem 0', borderBottom: '1px solid var(--line)' }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Professional Coaching</p>
        <h2 style={{ textAlign: 'center', marginBottom: '1.25rem', fontFamily: 'var(--font-display)', fontSize: '2.2rem' }}>
          Meet Our Certified Native Korean Tutors
        </h2>
        <p style={{ textAlign: 'center', maxWidth: '38rem', margin: '0 auto 3.5rem auto', color: 'var(--ink-soft)', fontSize: '0.98rem', lineHeight: 1.6 }}>
          All tutors are certified Korean language educators from top universities in Seoul. Assign them to your coaching requests for daily homework feedback.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {/* Tutor 1 */}
          <div style={{ background: 'white', border: '1px solid var(--line)', padding: '2rem', borderRadius: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem' }}>👩‍🏫</span>
            <h4 style={{ margin: '0.75rem 0 0.25rem 0', fontWeight: 'bold', fontSize: '1.2rem' }}>Ji-yeon Kim</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--teal-deep)', fontWeight: 'bold', marginBottom: '1rem' }}>Seoul National Univ. • Korean Lit</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
              Specializes in beginner phonetics correction and interactive stroke order tutoring. Direct, positive feedback style.
            </p>
          </div>
          {/* Tutor 2 */}
          <div style={{ background: 'white', border: '1px solid var(--line)', padding: '2rem', borderRadius: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem' }}>👨‍🏫</span>
            <h4 style={{ margin: '0.75rem 0 0.25rem 0', fontWeight: 'bold', fontSize: '1.2rem' }}>Min-ho Park</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--teal-deep)', fontWeight: 'bold', marginBottom: '1rem' }}>Yonsei Univ. • Linguistics</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
              Focused on conversational dialogue coaching and daily dialect particles. Excellent at clarifying situational nuances.
            </p>
          </div>
          {/* Tutor 3 */}
          <div style={{ background: 'white', border: '1px solid var(--line)', padding: '2rem', borderRadius: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem' }}>👩‍🏫</span>
            <h4 style={{ margin: '0.75rem 0 0.25rem 0', fontWeight: 'bold', fontSize: '1.2rem' }}>Soo-min Lee</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--teal-deep)', fontWeight: 'bold', marginBottom: '1rem' }}>Korea Univ. • Education</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
              Expert in advanced Hanja etymology mapping and news reading comprehension. Perfect for high-level literacy preparation.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: THE WADIZ CROWDFUNDING SAGA (와디즈 펀딩 신화) */}
      <section className="section shell" style={{ padding: '5rem 0', borderBottom: '1px solid var(--line)' }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Campaign Records</p>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontFamily: 'var(--font-display)', fontSize: '2.2rem' }}>
          Backed by Thousands of Backers on Wadiz
        </h2>
        <p style={{ textAlign: 'center', maxWidth: '38rem', margin: '0 auto 3.5rem auto', color: 'var(--ink-soft)', fontSize: '0.95rem' }}>
          Malmoa was built hand-in-hand with our crowdfunding backer community. We successfully funded over 2,300%+ of our targets with perfect satisfaction scores.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div style={{ background: '#f8fafc', borderRadius: '20px', border: '1px solid var(--line)', padding: '1.25rem' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--teal-deep)' }}>✨ Workbook Tracing Practice</h4>
            <img src="/wadiz-assets/wadiz_8.gif" alt="Workbook stickers" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px' }} />
          </div>
          <div style={{ background: '#f8fafc', borderRadius: '20px', border: '1px solid var(--line)', padding: '1.25rem' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--teal-deep)' }}>🎥 Real Classroom Interaction</h4>
            <video src="/wadiz-assets/wadiz_6.mp4" controls loop muted autoPlay style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px' }} />
          </div>
          <div style={{ background: '#f8fafc', borderRadius: '20px', border: '1px solid var(--line)', padding: '1.25rem' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--teal-deep)' }}>⭐️ Satisfaction Score 5.0</h4>
            <img src="/wadiz-assets/wadiz_1.png" alt="5.0 Score" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px' }} />
          </div>
        </div>
      </section>

      {/* SECTION 7: ADAPTIVE TYPING GAME SPECIFICATION (타자게임 기획 및 스펙) */}
      <section className="section shell" style={{ padding: '5rem 0', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          <div>
            <img 
              src="/wadiz-assets/wadiz_4.png" 
              alt="Hanja root network mockup" 
              style={{ width: '100%', height: 'auto', borderRadius: '24px', border: '1px solid var(--line)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}
            />
          </div>
          <div>
            <p className="section-label">Interactive Gaming</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginBottom: '1.25rem' }}>
              Unleash Typing Speeds in the Play Zone
            </h2>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6, fontSize: '0.98rem', marginBottom: '1.5rem' }}>
              Test your recall speeds under pressure with our Raindrop Typer. The engine shifts vocabulary dynamically according to your licensed level tier.
            </p>
            <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--teal-deep)', fontWeight: 'bold' }}>✓</span>
                <div>
                  <strong>Adaptive Speeds</strong>: Beginner tier drops consonants; Advanced drops full news phrases.
                </div>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--teal-deep)', fontWeight: 'bold' }}>✓</span>
                <div>
                  <strong>Instant Match Explosion</strong>: Single characters shatter on typing immediately without hitting enter.
                </div>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--teal-deep)', fontWeight: 'bold' }}>✓</span>
                <div>
                  <strong>Sideways Sinusoidal Movement</strong>: Words curve like waves to challenge high-level typing speeds.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 8: PATENTS & WHITE-PAPERS (특허 기술 및 학술 백서 요약) */}
      <section className="section shell" style={{ padding: '5rem 0', borderBottom: '1px solid var(--line)' }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Patented Methods</p>
        <h2 style={{ textAlign: 'center', marginBottom: '1.25rem', fontFamily: 'var(--font-display)', fontSize: '2.2rem' }}>
          Scientifically Validated Language Bridge
        </h2>
        <p style={{ textAlign: 'center', maxWidth: '38rem', margin: '0 auto 3.5rem auto', color: 'var(--ink-soft)', fontSize: '0.98rem', lineHeight: 1.6 }}>
          Malmoa\'s visual radical mapping technology is officially patented in South Korea and backed by educational research verifying a 3.8x memory speedup.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
          <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '24px', border: '1px solid var(--line)' }}>
            <h4 style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Patent No. 10-2022-XXXX</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--teal-deep)', fontWeight: 'bold', background: '#e2f1f1', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>OFFICIAL PATENT</span>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginTop: '0.75rem' }}>
              Method and system for teaching foreign syllabic block structures using visual mnemonic anchor networks. Guaranteed intellectual property protection.
            </p>
          </div>
          <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '24px', border: '1px solid var(--line)' }}>
            <h4 style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>3.8x Retention Index</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--teal-deep)', fontWeight: 'bold', background: '#e2f1f1', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>RESEARCH DATA</span>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginTop: '0.75rem' }}>
              Comparative student groups using Malmoa visual memory networks retained Sino-Korean root associations 3.8x longer than groups utilizing traditional list-copying.
            </p>
          </div>
          <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '24px', border: '1px solid var(--line)' }}>
            <h4 style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>2,300% Backer Support</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--teal-deep)', fontWeight: 'bold', background: '#e2f1f1', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>CROWDFUND METRICS</span>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginTop: '0.75rem' }}>
              We ranked as one of the highest-funded educational campaigns in Wadiz history due to the active support of independent global language learners.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 9: VERIFIED LEARNER TESTIMONIALS (서포터 실물 만족도 후기) */}
      <section className="section shell" style={{ padding: '5rem 0', borderBottom: '1px solid var(--line)' }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Testimonials</p>
        <h2 style={{ textAlign: 'center', marginBottom: '3.5rem', fontFamily: 'var(--font-display)', fontSize: '2.2rem' }}>
          What Verified Malmoa Backers Say
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {/* Review 1 */}
          <div style={{ background: 'white', border: '1px solid var(--line)', padding: '2rem', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
            <span style={{ color: 'var(--teal-deep)', fontSize: '1.5rem' }}>“</span>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 1rem 0' }}>
              The visual sticker mnemonic for "ㄱ" looking like a Gun is brilliant! Helped me memorize basic stroke shapes in minutes without getting bored.
            </p>
            <strong>Sarah Connor</strong> • <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>Beginner Student</span>
          </div>
          {/* Review 2 */}
          <div style={{ background: 'white', border: '1px solid var(--line)', padding: '2rem', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
            <span style={{ color: 'var(--teal-deep)', fontSize: '1.5rem' }}>“</span>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 1rem 0' }}>
              I just unlocked the Intermediate Daily Conversation dialogues course. Practice dialogues are extremely realistic and the 1:1 tutor mapped it perfectly.
            </p>
            <strong>Kenji Sato</strong> • <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>Intermediate Student</span>
          </div>
          {/* Review 3 */}
          <div style={{ background: 'white', border: '1px solid var(--line)', padding: '2rem', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
            <span style={{ color: 'var(--teal-deep)', fontSize: '1.5rem' }}>“</span>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 1rem 0' }}>
              Deconstructing Sino-Korean roots using the Hanja mapping cards allowed me to comprehend real news articles. Highly recommend advanced packages!
            </p>
            <strong>Alexander Vance</strong> • <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>Advanced Learner</span>
          </div>
        </div>
      </section>

      {/* SECTION 10: COMPREHENSIVE FAQ 8선 (자주 묻는 질문) */}
      <section className="section shell" style={{ padding: '5rem 0', borderBottom: '1px solid var(--line)' }}>
        <p className="section-label" style={{ textAlign: 'center' }}>FAQ</p>
        <h2 style={{ textAlign: 'center', marginBottom: '3.5rem', fontFamily: 'var(--font-display)', fontSize: '2.2rem' }}>
          Frequently Asked Questions
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
          <div>
            <h4 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.5rem' }}>Q1. How is the physical workbook kit delivered?</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Textbook orders are processed within 24 hours. The kit (containing workbooks, stickers, and posters) is shipped worldwide, and you can track the status (Processing - Dispatched - Shipped) in the Admin panel.
            </p>

            <h4 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.5rem' }}>Q2. How does the 1:1 teacher coaching work?</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Upon booking, our matching algorithms allocate a certified tutor to you. You can connect with them directly inside the 1:1 Live Lesson Chat Simulator at the bottom of the Admin panel.
            </p>

            <h4 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.5rem' }}>Q3. Can I practice writing stroke order on mobile?</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Yes! Our HTML5 Canvas tracing module supports touchscreen inputs. Tracing basic consonants/vowels works perfectly on iPhones, iPads, and Android devices.
            </p>

            <h4 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.5rem' }}>Q4. Is the placement test compulsory?</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              No, but we highly recommend it! The test automatically adjusts the vocabulary pool in the Play Zone, matching your current skill level perfectly.
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.5rem' }}>Q5. What are Hanja Roots, and why study them?</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Hanja represents Chinese character roots used in Korean. Just like Latin roots in English, mastering Hanja roots (like 木, 水, 調) unlocks the capability to guess the meaning of new academic words instantly.
            </p>

            <h6 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.5rem' }}>Q6. How do I get my certificate of completion?</h6>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Complete the Advanced News Literacy course and finish the final test. The system will generate a printable PDF certificate on your profile board.
            </p>

            <h6 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.5rem' }}>Q7. Can I change my licensed course tier?</h6>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Yes. Administrators can change user levels manually in the Student Database. Users can also unlock tiers instantly in the Bookstore.
            </p>

            <h6 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.5rem' }}>Q8. What happens to my XP points?</h6>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Your XP points represent your typing speed and writing accuracy achievements. Accumulating XP ranks you higher on the global leaderboard.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 11: FINAL CONVERSION BANNER (하단 최종 CTA 밴드) */}
      <section className="cta-band" style={{ padding: '6rem 0' }}>
        <div className="shell cta-inner" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'white', marginBottom: '1.25rem' }}>
            Ready to Fast-Track Your Korean Literacy?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '36rem', margin: '0 auto 2.5rem auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Unlock visual sticker packages, trace basic strokes, compete on the rankings leaderboard, and matching with professional native tutors.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              className="btn btn-ember btn-pulse" 
              style={{ padding: '0.9rem 2.25rem', fontSize: '1.05rem', fontWeight: 'bold' }}
              onClick={handleStartPlacement}
            >
              Take Free Diagnostic Test
            </button>
            <Link 
              className="btn btn-secondary" 
              style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white', padding: '0.9rem 2.25rem', fontSize: '1.05rem', fontWeight: 'bold' }} 
              to="/waitlist"
            >
              Book a Free Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* 듀오링고식 모의 칠판 레벨 테스트 팝업 모달 */}
      {showQuiz && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(26, 35, 50, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          backdropFilter: 'blur(4px)',
          animation: 'rise 0.2s ease both'
        }}>
          <div style={{
            background: 'var(--ink-dark)',
            color: 'white',
            borderRadius: '32px',
            padding: '2.5rem',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            border: '2px solid var(--teal)',
            position: 'relative'
          }}>
            <button
              type="button"
              onClick={() => setShowQuiz(false)}
              style={{ position: 'absolute', top: '15px', right: '20px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--line)' }}
            >
              ×
            </button>

            {!quizFinished ? (
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--teal)' }}>
                  Placement diagnostic • Question {quizIndex + 1} of {PLACEMENT_QUIZ.length}
                </span>
                
                <h3 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '1.35rem', margin: '0.75rem 0 2rem 0', lineHeight: 1.3 }}>
                  {PLACEMENT_QUIZ[quizIndex].prompt}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {PLACEMENT_QUIZ[quizIndex].choices.map((choice) => {
                    const isSelected = selectedChoice === choice
                    const isAnswer = choice === PLACEMENT_QUIZ[quizIndex].answer
                    let borderCol = '#233143'
                    let bgCol = '#0e1621'

                    if (selectedChoice) {
                      if (isAnswer) {
                        borderCol = '#10b981'
                        bgCol = 'rgba(16, 185, 129, 0.15)'
                      } else if (isSelected) {
                        borderCol = 'var(--ember)'
                        bgCol = 'rgba(196, 92, 38, 0.15)'
                      }
                    }

                    return (
                      <button
                        key={choice}
                        type="button"
                        onClick={() => handleSelectChoice(choice)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '1rem',
                          borderRadius: '16px',
                          border: `2px solid ${borderCol}`,
                          background: bgCol,
                          color: 'white',
                          fontWeight: 'bold',
                          cursor: selectedChoice ? 'default' : 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {choice}
                      </button>
                    )
                  })}
                </div>

                {selectedChoice && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNextQuestion}
                    style={{ width: '100%', marginTop: '2rem', padding: '1rem' }}
                  >
                    {quizIndex < PLACEMENT_QUIZ.length - 1 ? 'Next Question' : 'View Placement Tier'}
                  </button>
                )}
              </div>
            ) : (
              <div style={{ animation: 'rise 0.4s ease both', textAlign: 'center' }}>
                <span style={{ fontSize: '3rem' }}>🏆</span>
                <h3 style={{ color: 'white', margin: '0.75rem 0 0.5rem 0', fontSize: '1.65rem' }}>
                  Diagnostic Complete!
                </h3>
                <p style={{ color: '#a0aab8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Your results indicate you belong in:
                </p>

                <div style={{ display: 'inline-block', background: 'var(--teal-deep)', color: 'white', padding: '0.6rem 1.75rem', borderRadius: '12px', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', border: '1px solid var(--teal)' }}>
                  {resultTier} Tier
                </div>

                <p style={{ color: '#10b981', fontSize: '0.88rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                  🎉 +50 XP Welcome Placement Bonus has been credited to your profile!
                </p>

                <hr style={{ borderColor: '#233143', marginBottom: '1.5rem' }} />

                <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '1rem', textAlign: 'left' }}>
                  📚 Recommended Study Package for your level:
                </h4>

                {resultTier === 'Beginner' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ background: '#0e1621', border: '1px solid #233143', borderRadius: '16px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--teal)' }}>TEXTBOOK KIT</span>
                        <h5 style={{ margin: 0, color: 'white', fontSize: '0.92rem' }}>Mnemonic Sticker Kit ($39)</h5>
                      </div>
                      <button type="button" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleDirectCheckout('Malmoa Visual Textbook & Sticker Package', 'textbook')}>
                        Order Kit
                      </button>
                    </div>

                    <div style={{ background: '#0e1621', border: '1px solid #233143', borderRadius: '16px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--teal)' }}>DIGITAL COURSE</span>
                        <h5 style={{ margin: 0, color: 'white', fontSize: '0.92rem' }}>Beginner Course Lock ($19)</h5>
                      </div>
                      <Link to="/play-hub" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: 'white', borderColor: '#233143' }}>
                        Unlock Tier
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ background: '#0e1621', border: '1px solid #233143', borderRadius: '16px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--teal)' }}>NATIVE TUTOR</span>
                        <h5 style={{ margin: 0, color: 'white', fontSize: '0.92rem' }}>1-on-1 Coaching (1 Month) ($89)</h5>
                      </div>
                      <button type="button" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleDirectCheckout('1-on-1 Native Literacy Coaching (1 Month)', 'coaching')}>
                        Book Tutor
                      </button>
                    </div>

                    <div style={{ background: '#0e1621', border: '1px solid #233143', borderRadius: '16px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--teal)' }}>DIGITAL COURSE</span>
                        <h5 style={{ margin: 0, color: 'white', fontSize: '0.92rem' }}>Advanced News Course ($39)</h5>
                      </div>
                      <Link to="/play-hub" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: 'white', borderColor: '#233143' }}>
                        Unlock Tier
                      </Link>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowQuiz(false)}
                  style={{ width: '100%', marginTop: '1.5rem', color: 'var(--line)', borderColor: '#233143' }}
                >
                  Go to dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
