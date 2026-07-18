import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
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

      // Sync profile tier instantly in localStorage
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

  // TTMIK Style Direct Checkout from Results Board -> Redirects to unified pricing waitlist page
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
      alert(`🎉 Package Inquiry registered! Redirecting to pricing table to select your best plan options.`)
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
      alert(`👩‍🏫 Tutor Coaching matching initialized! Redirecting to select your consultation slot.`)
    }
    setShowQuiz(false)
    navigate('/waitlist')
  }

  return (
    <>
      {/* SECTION 1: HERO LANDING (Epic Vercel/Stripe style layout) */}
      <section style={{ padding: '8rem 0 6rem 0', background: 'radial-gradient(circle at 80% 20%, rgba(13,115,119,0.06) 0%, transparent 60%)', borderBottom: '1px solid var(--line)' }}>
        <div className="shell" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          
          <div className="hero-copy reveal" style={{ textAlign: 'left' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem', background: 'var(--paper-cool)', padding: '0.4rem 1rem', borderRadius: '30px', border: '1px solid var(--line)' }}>
              {/* 귀여운 환영 호랑이 마스코트 배치 */}
              <img src="/tiger_welcome.png" alt="Cute tiger welcome mascot" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
              <span style={{ fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--teal-deep)' }}>
                ★ 2,300%+ Funded Mnemonic System
              </span>
            </div>
            
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3.6rem', lineHeight: 1.1, fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
              Master Korean via <br/>
              <span style={{ color: 'var(--teal-deep)' }}>Visual Mnemonics</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '34rem' }}>
              Ditch dry memorization. Learn Hangul using King Sejong\'s phonological vocal organ mimicry combined with visual cues. Unlock K-pop lyrics and K-drama subtexts in record time.
            </p>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="edu-btn-3d" 
                style={{ fontSize: '1.05rem', padding: '1rem 2.2rem' }}
                onClick={handleStartPlacement}
              >
                Take Level Placement Test
              </button>
              <Link 
                className="edu-btn-secondary-3d" 
                style={{ fontSize: '1.05rem', padding: '1rem 2.2rem' }}
                to="/demo-hub"
              >
                Enter Classroom
              </Link>
            </div>
            <p style={{ marginTop: '1.75rem', fontSize: '0.92rem', color: 'var(--ink-soft)' }}>
              Already registered? Click <strong>🔑 Login</strong> at the top right to load your tier.
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <div className="edu-card-chunky" style={{ padding: '1.75rem', background: 'white', transform: 'rotate(2deg)', boxShadow: '0 30px 60px rgba(0,0,0,0.04)' }}>
              <img 
                src="/wadiz-assets/asset1.jpg" 
                alt="Malmoa Mnemonic Kit Package" 
                style={{ width: '100%', height: 'auto', borderRadius: '18px', border: '1px solid var(--line)', display: 'block' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem', padding: '0 0.25rem' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>📚 Physical Study Kit Pack</span>
                <span style={{ fontSize: '0.95rem', color: 'var(--teal-deep)', fontWeight: 'bold' }}>Double Funding Champ</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: HALLYU WAVE & K-POP SYNERGY (시각적 반전 구성) */}
      <section style={{ padding: '6rem 0', borderBottom: '1px solid var(--line)', background: 'var(--paper-cool)' }}>
        <div className="shell">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p className="section-label">Cultural Connection</p>
            <h2 style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800 }}>
              Decode K-Pop Lyrics & K-Drama Nuance
            </h2>
            <p style={{ maxWidth: '38rem', margin: '0 auto', color: 'var(--ink-soft)', fontSize: '1.1rem', lineHeight: 1.7 }}>
              Subtitles translate words but lose cultural contexts, honorific levels, and wordplays. Connecting to the visual root unlocks direct access.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
            <div>
              <div className="edu-card-chunky" style={{ padding: '1.25rem', background: 'white' }}>
                <img 
                  src="/kpop_hangul_decoder.png" 
                  alt="K-pop Hangul lyrics decoder interface" 
                  style={{ width: '100%', height: 'auto', borderRadius: '14px', display: 'block' }}
                />
              </div>
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1.25rem', fontWeight: 700 }}>
                The K-Pop Mnemonic Decoder
              </h3>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, fontSize: '1.05rem', marginBottom: '2rem' }}>
                Our digital lyrics analyzer visualizes words in Korean pop tracks. Break down syllables, trace grammatical nodes, and understand slang terminology dynamically.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                  <span style={{ fontSize: '1.5rem' }}>🎤</span>
                  <div>
                    <strong>Sing Native Tempo</strong>
                    <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', margin: '0.15rem 0 0 0' }}>Stop relying on romanization. Read native Hangul blocks instantly.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                  <span style={{ fontSize: '1.5rem' }}>🎬</span>
                  <div>
                    <strong>Honorific Social Layers</strong>
                    <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', margin: '0.15rem 0 0 0' }}>Grasp the subtext of politeness (Banmal vs. Jondetmal) in hit shows.</p>
                  </div>
                </div>
              </div>
              <Link to="/demo-hub" className="edu-btn-3d">Try Classroom Decoder</Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: IMPORTANCE OF KOREAN LITERACY (SaaS Style feature Grid) */}
      <section style={{ padding: '6rem 0', borderBottom: '1px solid var(--line)', background: 'white' }}>
        <div className="shell">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <p className="section-label">Global Significance</p>
            <h2 style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800 }}>
              Why Korean Literacy is Your Next Career Superpower
            </h2>
            <p style={{ maxWidth: '38rem', margin: '0 auto', color: 'var(--ink-soft)', fontSize: '1.1rem', lineHeight: 1.7 }}>
              Unlock career tracks in global commerce, diplomacy, and academia in East Asia.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            <div className="edu-card-chunky" style={{ padding: '2.5rem 2rem', background: 'var(--paper-cool)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>💼</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 'bold', marginBottom: '0.85rem' }}>Global Business Hub</h3>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                Unlock relationships with multinational tech giants (Samsung, Hyundai). Written Korean competency provides immediate leverage in technology, trade, and entertainment sectors.
              </p>
            </div>

            <div className="edu-card-chunky" style={{ padding: '2.5rem 2rem', background: 'var(--paper-cool)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>🎓</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 'bold', marginBottom: '0.85rem' }}>Academic Scholarship</h3>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                Korean universities offer fully-funded academic programs (GKS). Researching and studying in Seoul is highly dependent on reading primary Korean archives and essays.
              </p>
            </div>

            <div className="edu-card-chunky" style={{ padding: '2.5rem 2rem', background: 'var(--paper-cool)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>🤝</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 'bold', marginBottom: '0.85rem' }}>Diplomatic Bridges</h3>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                As East Asian logistics and geopolitical dynamics shift, certified Korean proficiency is heavily sought after in translation, security, and international diplomacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: PHONOLOGICAL SCIENCE OF KING SEJONG */}
      <section style={{ padding: '6rem 0', borderBottom: '1px solid var(--line)', background: 'var(--paper-cool)' }}>
        <div className="shell">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <p className="section-label">Linguistic Masterpiece</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '1.25rem', fontWeight: 800 }}>
                Designed by a King. Praised by Linguists.
              </h2>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, fontSize: '1.1rem', marginBottom: '2rem' }}>
                Hangul was created by King Sejong the Great in 1443 with a clean, phonetic logic. It is the only writing system in the world where letters mimic the vocal organs producing them.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1.25rem' }}>
                  <span style={{ fontSize: '2rem' }}>👅</span>
                  <div>
                    <strong style={{ fontSize: '1.1rem' }}>Consonant Vocal Organ Mimicry</strong>
                    <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', margin: '0.25rem 0 0 0', lineHeight: 1.6 }}>Letter shapes map to physiological sounds. "ㄱ" copies the tongue blocking the throat during the "g/k" sound. "ㄴ" copies the tongue touching the roof mouth.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1.25rem' }}>
                  <span style={{ fontSize: '2rem' }}>🌌</span>
                  <div>
                    <strong style={{ fontSize: '1.1rem' }}>Celestial Vowel Geometry</strong>
                    <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', margin: '0.25rem 0 0 0', lineHeight: 1.6 }}>Built systematically from three elements: ㆍ (Sun/Heaven), ㅡ (flat Earth), and ㅣ (standing Man). This logic allows perfect mathematical block combinations.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="edu-chalkboard" style={{ marginBottom: '2rem', position: 'relative', background: '#0d2219', border: '6px solid #4a3728', borderRadius: '24px', padding: '2rem' }}>
                {/* 공부하는 호랑이 캐릭터 배치 */}
                <img src="/tiger_study.png" alt="Cute tiger studying mascot" style={{ position: 'absolute', bottom: '15px', right: '20px', width: '56px', height: '56px', objectFit: 'contain' }} />
                
                <h4 style={{ color: '#fcd34d', fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '1rem', fontWeight: 'bold' }}>"A wise man can learn it in one morning."</h4>
                <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                  Historical logs in the Hunminjeongeum Haerye record: <br/>
                  <em>"A wise man can acquaint himself with them before the morning is over; even a stupid man can learn them in the space of ten days."</em> <br/><br/>
                  Because Hangul is a <strong>featural alphabet</strong>, letters represent specific physical features of sound. Learning the core logic removes boring rote memorization.
                </p>
              </div>
              
              <div className="edu-card-chunky" style={{ padding: '1rem', background: 'white' }}>
                <img 
                  src="/hangul_stroke_tracing.png" 
                  alt="Hangul stroke order tracing simulator interface" 
                  style={{ width: '100%', height: 'auto', borderRadius: '14px', display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: COGNITIVE SCIENCE PEDAGOGY */}
      <section style={{ padding: '6rem 0', borderBottom: '1px solid var(--line)', background: 'white' }}>
        <div className="shell">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <p className="section-label">Scientific Foundation</p>
            <h2 style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800 }}>
              Why Visual Association Solves Rote Memory Burnout
            </h2>
            <p style={{ maxWidth: '38rem', margin: '0 auto', color: 'var(--ink-soft)', fontSize: '1.1rem', lineHeight: 1.7 }}>
              Traditional rote repetition fades from memory within 48 hours. Here is how Malmoa overrides this limitation.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            <div className="edu-card-chunky" style={{ padding: '2.5rem 2rem', background: 'var(--paper-cool)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>🧠</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 'bold', marginBottom: '0.85rem' }}>Dual-Coding Theory</h3>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                We store verbal sounds and visual illustrations in separate channels, doubling the retention score. Tying "ㄱ" to "Gun" establishes permanent memory hooks.
              </p>
            </div>

            <div className="edu-card-chunky" style={{ padding: '2.5rem 2rem', background: 'var(--paper-cool)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>📈</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 'bold', marginBottom: '0.85rem' }}>Active Recall Tracing</h3>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                Our tracing canvas enforces muscle memory. Guided tracing stimulates tactile recall neurons, helping you remember the direction vectors.
              </p>
            </div>

            <div className="edu-card-chunky" style={{ padding: '2.5rem 2rem', background: 'var(--paper-cool)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>🕸️</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 'bold', marginBottom: '0.85rem' }}>Vocabulary Root Networks</h3>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                Over 70% of advanced Korean vocabulary is Sino-Korean (Hanja). Learning one root character (e.g. 木) branches out to multiple compound words.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: 12-WEEK FULL SYLLABUS ROADMAP (Step Timeline Layout) */}
      <section style={{ padding: '6rem 0', borderBottom: '1px solid var(--line)', background: 'var(--paper-cool)' }}>
        <div className="shell">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <p className="section-label">Syllabus Blueprint</p>
            <h2 style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800 }}>
              Your 12-Week Journey to Native Literacy
            </h2>
            <p style={{ maxWidth: '38rem', margin: '0 auto', color: 'var(--ink-soft)', fontSize: '1.1rem', lineHeight: 1.7 }}>
              A step-by-step roadmap progressing from absolute basics to reading Korean newspapers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            <div className="edu-card-chunky" style={{ padding: '2.25rem 2rem', background: 'white' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--teal-deep)', background: '#e2f1f1', padding: '0.3rem 0.75rem', borderRadius: '20px' }}>WEEKS 1-3</span>
              <h4 style={{ margin: '1.25rem 0 0.5rem 0', fontWeight: 'bold', fontSize: '1.2rem' }}>Stage 1: Basic Hangul</h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                Master 14 basic consonants and 10 vowels. Draw stroke vectors in our tracing canvas and map sounds to visual stories (Gun, Nose, Door).
              </p>
            </div>

            <div className="edu-card-chunky" style={{ padding: '2.25rem 2rem', background: 'white' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--teal-deep)', background: '#e2f1f1', padding: '0.3rem 0.75rem', borderRadius: '20px' }}>WEEKS 4-6</span>
              <h4 style={{ margin: '1.25rem 0 0.5rem 0', fontWeight: 'bold', fontSize: '1.2rem' }}>Stage 2: Word Stacking</h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                Assemble characters into syllabic blocks. Study particles, sentence structure rules, and core vocabulary combinations.
              </p>
            </div>

            <div className="edu-card-chunky" style={{ padding: '2.25rem 2rem', background: 'white' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--teal-deep)', background: '#e2f1f1', padding: '0.3rem 0.75rem', borderRadius: '20px' }}>WEEKS 7-9</span>
              <h4 style={{ margin: '1.25rem 0 0.5rem 0', fontWeight: 'bold', fontSize: '1.2rem' }}>Stage 3: Dialogues</h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                Engage in situational dialogues. Practice pronunciation, shopping, dining, and daily social scripts with Korean TTS readouts.
              </p>
            </div>

            <div className="edu-card-chunky" style={{ padding: '2.25rem 2rem', background: 'white' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--teal-deep)', background: '#e2f1f1', padding: '0.3rem 0.75rem', borderRadius: '20px' }}>WEEKS 10-12</span>
              <h4 style={{ margin: '1.25rem 0 0.5rem 0', fontWeight: 'bold', fontSize: '1.2rem' }}>Stage 4: News & Hanja</h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                Unseal newspaper clauses. Deconstruct compound words using Sino-Korean Hanja root maps and test typing speeds in the Raindrop Typer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: THE PHYSICAL KIT UNBOXING */}
      <section style={{ padding: '6rem 0', borderBottom: '1px solid var(--line)', background: 'white' }}>
        <div className="shell">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <p className="section-label">Tactile Learning</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '1.25rem', fontWeight: 800 }}>
                Offline Physical Mnemonic Kit
              </h2>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, fontSize: '1.1rem', marginBottom: '2rem' }}>
                Our 2x successful Wadiz campaign kit provides offline physical items that synchronize directly with this digital classroom. Engage your hands while studying.
              </p>
              
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: 0, listStyle: 'none' }}>
                <li style={{ display: 'flex', gap: '0.85rem' }}>
                  <span style={{ color: 'var(--teal-deep)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>4 Association Workbooks</strong>
                    <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', margin: '0.2rem 0 0 0', lineHeight: 1.6 }}>Step-by-step writing exercises, readouts, and cartoon cues.</p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.85rem' }}>
                  <span style={{ color: 'var(--teal-deep)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>170+ Visual Mnemonic Stickers</strong>
                    <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', margin: '0.2rem 0 0 0', lineHeight: 1.6 }}>Paste sticker triggers (Gun, Nose, Door) on corresponding pages.</p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.85rem' }}>
                  <span style={{ color: 'var(--teal-deep)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Etymology Hanja Mapping Chart</strong>
                    <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', margin: '0.2rem 0 0 0', lineHeight: 1.6 }}>Wall posters detailing Sino-Korean vocabulary connections.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <div className="edu-card-chunky" style={{ padding: '1.5rem', background: 'white' }}>
                <img 
                  src="/wadiz-assets/asset2.jpg" 
                  alt="Workbook and Sticker layout" 
                  style={{ width: '100%', height: 'auto', borderRadius: '18px', border: '1px solid var(--line)', display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: NATIVE KOREAN TUTORS CATALOG */}
      <section style={{ padding: '6rem 0', borderBottom: '1px solid var(--line)', background: 'var(--paper-cool)' }}>
        <div className="shell">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <p className="section-label">Professional Coaching</p>
            <h2 style={{ marginBottom: '1.25rem', fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800 }}>
              Meet Our Certified Native Korean Tutors
            </h2>
            <p style={{ maxWidth: '38rem', margin: '0 auto', color: 'var(--ink-soft)', fontSize: '1.1rem', lineHeight: 1.7 }}>
              Assign certified language educators from top universities in Seoul to your coaching requests for daily homework feedback.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
            <div className="edu-card-chunky" style={{ textAlign: 'center', background: 'white', padding: '2.5rem 2rem' }}>
              <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>👩‍🏫</span>
              <h4 style={{ margin: '0.5rem 0 0.25rem 0', fontWeight: 'bold', fontSize: '1.25rem' }}>Ji-yeon Kim</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--teal-deep)', fontWeight: 'bold', marginBottom: '1.25rem' }}>Seoul National Univ. • Korean Lit</p>
              <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
                Specializes in beginner phonetics correction and interactive stroke order tutoring. Direct, positive feedback style.
              </p>
            </div>
            <div className="edu-card-chunky" style={{ textAlign: 'center', background: 'white', padding: '2.5rem 2rem' }}>
              <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>👨‍🏫</span>
              <h4 style={{ margin: '0.5rem 0 0.25rem 0', fontWeight: 'bold', fontSize: '1.25rem' }}>Min-ho Park</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--teal-deep)', fontWeight: 'bold', marginBottom: '1.25rem' }}>Yonsei Univ. • Linguistics</p>
              <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
                Focused on conversational dialogue coaching and daily dialect particles. Excellent at clarifying situational nuances.
              </p>
            </div>
            <div className="edu-card-chunky" style={{ textAlign: 'center', background: 'white', padding: '2.5rem 2rem' }}>
              <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>👩‍🏫</span>
              <h4 style={{ margin: '0.5rem 0 0.25rem 0', fontWeight: 'bold', fontSize: '1.25rem' }}>Soo-min Lee</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--teal-deep)', fontWeight: 'bold', marginBottom: '1.25rem' }}>Korea Univ. • Education</p>
              <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
                Expert in advanced Hanja etymology mapping and news reading comprehension. Perfect for high-level literacy preparation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: STATS & CAMPAIGN RECORD (Large Stats Layout) */}
      <section style={{ padding: '6rem 0', borderBottom: '1px solid var(--line)', background: 'white' }}>
        <div className="shell">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <p className="section-label">Campaign Records</p>
            <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800 }}>
              Validated by Thousands of Global Backers
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', textAlign: 'center', marginBottom: '4rem' }} className="stats-strip">
            <div style={{ padding: '1rem' }}>
              <span style={{ fontSize: '3.2rem', fontWeight: 900, color: 'var(--teal-deep)', display: 'block', lineHeight: 1 }}>2,300%+</span>
              <span style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', fontWeight: 'bold', marginTop: '0.5rem', display: 'block' }}>Wadiz Funding Target</span>
            </div>
            <div style={{ padding: '1rem', borderInline: '1px solid var(--line)' }}>
              <span style={{ fontSize: '3.2rem', fontWeight: 900, color: 'var(--teal-deep)', display: 'block', lineHeight: 1 }}>3.8x</span>
              <span style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', fontWeight: 'bold', marginTop: '0.5rem', display: 'block' }}>Faster Retention Index</span>
            </div>
            <div style={{ padding: '1rem' }}>
              <span style={{ fontSize: '3.2rem', fontWeight: 900, color: 'var(--teal-deep)', display: 'block', lineHeight: 1 }}>5.0 / 5.0</span>
              <span style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', fontWeight: 'bold', marginTop: '0.5rem', display: 'block' }}>Satisfaction Score</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="edu-card-chunky" style={{ padding: '1.5rem', background: 'var(--paper-cool)' }}>
              <h4 style={{ margin: '0 0 0.85rem 0', fontSize: '1rem', fontWeight: 'bold', color: 'var(--teal-deep)' }}>✨ Workbook Tracing Practice</h4>
              <img src="/wadiz-assets/wadiz_8.gif" alt="Workbook stickers" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--line)' }} />
            </div>
            <div className="edu-card-chunky" style={{ padding: '1.5rem', background: 'var(--paper-cool)' }}>
              <h4 style={{ margin: '0 0 0.85rem 0', fontSize: '1rem', fontWeight: 'bold', color: 'var(--teal-deep)' }}>🎥 Real Classroom Interaction</h4>
              <video src="/wadiz-assets/wadiz_6.mp4" controls loop muted autoPlay style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--line)' }} />
            </div>
            <div className="edu-card-chunky" style={{ padding: '1.5rem', background: 'var(--paper-cool)' }}>
              <h4 style={{ margin: '0 0 0.85rem 0', fontSize: '1rem', fontWeight: 'bold', color: 'var(--teal-deep)' }}>⭐️ Satisfaction Score 5.0</h4>
              <img src="/wadiz-assets/wadiz_1.png" alt="5.0 Score" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--line)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: PLAY ZONE TYPING GAME */}
      <section style={{ padding: '6rem 0', borderBottom: '1px solid var(--line)', background: 'var(--paper-cool)' }}>
        <div className="shell">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div className="edu-card-chunky" style={{ padding: '1rem', background: 'white', position: 'relative' }}>
                {/* 타자 치는 호랑이 캐릭터 배치 */}
                <img src="/tiger_typer.png" alt="Cute tiger typing mascot" style={{ position: 'absolute', top: '-15px', left: '-15px', width: '64px', height: '64px', objectFit: 'contain', zIndex: 10 }} />
                
                <img 
                  src="/hanja_root_network.png" 
                  alt="Hanja root etymology network mapping" 
                  style={{ width: '100%', height: 'auto', borderRadius: '16px', display: 'block' }}
                />
              </div>
            </div>
            <div>
              <p className="section-label">Interactive Gaming</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '1.25rem', fontWeight: 800 }}>
                Unleash Typing Speeds in the Play Zone
              </h2>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, fontSize: '1.1rem', marginBottom: '2rem' }}>
                Test your recall speeds under pressure with our Raindrop Typer. The engine shifts vocabulary dynamically according to your licensed level tier.
              </p>
              <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1rem' }}>
                <li style={{ display: 'flex', gap: '0.75rem' }}>
                  <span style={{ color: 'var(--teal-deep)', fontWeight: 'bold' }}>✓</span>
                  <div>
                    <strong>Adaptive Speeds</strong>: Beginner tier drops consonants; Advanced drops full news phrases.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem' }}>
                  <span style={{ color: 'var(--teal-deep)', fontWeight: 'bold' }}>✓</span>
                  <div>
                    <strong>Instant Match Explosion</strong>: Single characters shatter on typing immediately without hitting enter.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem' }}>
                  <span style={{ color: 'var(--teal-deep)', fontWeight: 'bold' }}>✓</span>
                  <div>
                    <strong>Sinusoidal Word Swell</strong>: Words slide like waves to test high-level coordination.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 12: LEARNER TESTIMONIALS */}
      <section style={{ padding: '6rem 0', borderBottom: '1px solid var(--line)', background: 'white' }}>
        <div className="shell">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <p className="section-label">Testimonials</p>
            <h2 style={{ marginBottom: '1.25rem', fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800 }}>
              What Verified Learners Say
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
            <div className="edu-card-chunky" style={{ padding: '2.5rem 2rem', background: 'var(--paper-cool)' }}>
              <span style={{ color: 'var(--teal-deep)', fontSize: '2rem', display: 'block', lineHeight: 1 }}>“</span>
              <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                The visual sticker mnemonic for "ㄱ" looking like a Gun is brilliant! Helped me memorize basic stroke shapes in minutes without getting bored.
              </p>
              <strong>Sarah Connor</strong> • <span style={{ fontSize: '0.88rem', color: 'var(--ink-soft)' }}>Beginner Student</span>
            </div>
            <div className="edu-card-chunky" style={{ padding: '2.5rem 2rem', background: 'var(--paper-cool)' }}>
              <span style={{ color: 'var(--teal-deep)', fontSize: '2rem', display: 'block', lineHeight: 1 }}>“</span>
              <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                I just unlocked the Intermediate Daily Conversation dialogues course. Practice dialogues are extremely realistic and the 1:1 tutor mapped it perfectly.
              </p>
              <strong>Kenji Sato</strong> • <span style={{ fontSize: '0.88rem', color: 'var(--ink-soft)' }}>Intermediate Student</span>
            </div>
            <div className="edu-card-chunky" style={{ padding: '2.5rem 2rem', background: 'var(--paper-cool)' }}>
              <span style={{ color: 'var(--teal-deep)', fontSize: '2rem', display: 'block', lineHeight: 1 }}>“</span>
              <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                Deconstructing Sino-Korean roots using the Hanja mapping cards allowed me to comprehend real news articles. Highly recommend advanced packages!
              </p>
              <strong>Alexander Vance</strong> • <span style={{ fontSize: '0.88rem', color: 'var(--ink-soft)' }}>Advanced Learner</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 13: COMPREHENSIVE FAQ 12선 */}
      <section style={{ padding: '6rem 0', borderBottom: '1px solid var(--line)', background: 'var(--paper-cool)' }}>
        <div className="shell">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <p className="section-label">FAQ</p>
            <h2 style={{ marginBottom: '3.5rem', fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800 }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div>
              <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.65rem' }}>Q1. How is the physical workbook kit delivered?</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Textbook orders are processed within 24 hours. The kit is shipped worldwide, and you can track the status (Processing - Dispatched - Shipped) in the Admin panel.
              </p>

              <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.65rem' }}>Q2. How does the 1:1 teacher coaching work?</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Upon booking standard or premium consultation plans, our algorithms allocate a certified tutor. Match profiles show up on your live matching sheet.
              </p>

              <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.65rem' }}>Q3. Can I practice writing stroke order on mobile?</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Yes! Our HTML5 Canvas tracing module supports touch inputs. Tracing basic consonants/vowels works perfectly on iOS and Android devices.
              </p>

              <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.65rem' }}>Q4. Is the placement test compulsory?</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                No, but we highly recommend it! The test automatically adjusts the vocabulary pool in the Play Zone to match your skill level.
              </p>

              <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.65rem' }}>Q5. Can this help me understand K-pop lyrics?</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Absolutely. Level 2 and 3 curriculum features real-world lyrics syntax parsing. By studying actual Hangul blocks rather than romanization, you will be able to read and sing K-pop lyrics in real-time.
              </p>

              <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.65rem' }}>Q6. What makes Hangul a "scientific" alphabet?</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Hangul is a featural writing system where letter shapes reflect the physiological organs used to pronounce them. Because of this logical correlation, it has been widely recognized by world linguists as the most structured writing system on earth.
              </p>
            </div>

            <div>
              <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.65rem' }}>Q7. What are Hanja Roots, and why study them?</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Hanja represents Chinese character roots used in Korean. Just like Latin roots in English, mastering Hanja roots (like 木, 水, 調) unlocks the capability to guess the meaning of new academic words instantly.
              </p>

              <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.65rem' }}>Q8. How do I get my certificate of completion?</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Complete the Advanced News Literacy course and finish the final test. The system will generate a printable PDF certificate on your profile board.
              </p>

              <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.65rem' }}>Q9. Can I change my licensed course tier?</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Yes. Administrators can change user levels manually in the Student Database. Users can also unlock tiers instantly in the Bookstore.
              </p>

              <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.65rem' }}>Q10. What happens to my XP points?</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Your XP points represent your typing speed and writing accuracy achievements. Accumulating XP ranks you higher on the global leaderboard.
              </p>

              <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.65rem' }}>Q11. Will I learn formal and informal Korean?</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Yes. Level 2 conversations are explicitly structured to contrast formal polite speech (Jondetmal) used in workplaces and informal speech (Banmal) used between friends.
              </p>

              <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.65rem' }}>Q12. Is the textbook kit necessary for the course?</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                While the digital course stands alone, the visual sticker sheets and recall poster map in the physical kit provide a tactile reinforcement that speed up word recall by an additional 40%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 14: FINAL CONVERSION BANNER */}
      <section className="cta-band" style={{ padding: '8rem 0', position: 'relative' }}>
        {/* 응원하는 호랑이 캐릭터 배치 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <img src="/tiger_cheer.png" alt="Cute tiger cheering mascot" style={{ width: '88px', height: '88px', objectFit: 'contain' }} />
        </div>
        
        <div className="shell cta-inner" style={{ textAlign: 'center', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: 'white', marginBottom: '1.5rem', fontWeight: 800 }}>
            Ready to Fast-Track Your Korean Literacy?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '38rem', margin: '0 auto 3rem auto', fontSize: '1.15rem', lineHeight: 1.7 }}>
            Unlock visual sticker packages, trace basic strokes, compete on the rankings leaderboard, and matching with professional native tutors.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              className="edu-btn-ember-3d" 
              style={{ fontSize: '1.05rem', padding: '1rem 2.2rem' }}
              onClick={handleStartPlacement}
            >
              Take Free Diagnostic Test
            </button>
            <Link 
              className="edu-btn-secondary-3d" 
              style={{ background: 'transparent', borderColor: 'rgba(255,255,255,0.4)', color: 'white !important', borderBottomColor: 'rgba(255,255,255,0.3)', fontSize: '1.05rem', padding: '1rem 2.2rem' }} 
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
          background: 'rgba(15, 23, 42, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          backdropFilter: 'blur(4px)',
          animation: 'rise 0.2s ease both'
        }}>
          <div className="edu-chalkboard" style={{
            width: '100%',
            maxWidth: '540px',
            position: 'relative',
            background: '#0d2219',
            border: '6px solid #4a3728',
            borderRadius: '24px',
            padding: '2.5rem'
          }}>
            <button
              type="button"
              onClick={() => setShowQuiz(false)}
              style={{ position: 'absolute', top: '15px', right: '20px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.75rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.5)' }}
            >
              ×
            </button>

            {!quizFinished ? (
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#34d399', fontWeight: 'bold' }}>
                  Placement diagnostic • Question {quizIndex + 1} of {PLACEMENT_QUIZ.length}
                </span>
                
                <h3 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '1.45rem', margin: '0.75rem 0 2rem 0', lineHeight: 1.35, fontWeight: 'bold' }}>
                  {PLACEMENT_QUIZ[quizIndex].prompt}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {PLACEMENT_QUIZ[quizIndex].choices.map((choice) => {
                    const isSelected = selectedChoice === choice
                    const isAnswer = choice === PLACEMENT_QUIZ[quizIndex].answer
                    let borderCol = '#1e3f35'
                    let bgCol = '#0a1d15'

                    if (selectedChoice) {
                      if (isAnswer) {
                        borderCol = '#10b981'
                        bgCol = 'rgba(16, 185, 129, 0.2)'
                      } else if (isSelected) {
                        borderCol = 'var(--ember)'
                        bgCol = 'rgba(196, 92, 38, 0.2)'
                      }
                    }

                    return (
                      <button
                        key={choice}
                        type="button"
                        className="edu-chalkboard-option"
                        onClick={() => handleSelectChoice(choice)}
                        style={{
                          borderColor: borderCol,
                          borderBottomColor: borderCol,
                          background: bgCol,
                          cursor: selectedChoice ? 'default' : 'pointer',
                          padding: '0.85rem 1.25rem',
                          fontSize: '0.95rem'
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
                    className="edu-btn-3d"
                    onClick={handleNextQuestion}
                    style={{ width: '100%', marginTop: '2rem', padding: '0.85rem' }}
                  >
                    {quizIndex < PLACEMENT_QUIZ.length - 1 ? 'Next Question' : 'View Placement Tier'}
                  </button>
                )}
              </div>
            ) : (
              <div style={{ animation: 'rise 0.4s ease both', textAlign: 'center' }}>
                {/* 100점 시험지 자랑하는 성공 호랑이 마스코트 배치 */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <img src="/tiger_success.png" alt="Cute tiger success mascot" style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
                </div>
                
                <h3 style={{ color: 'white', margin: '0.75rem 0 0.5rem 0', fontSize: '1.8rem', fontWeight: 'bold' }}>
                  Diagnostic Complete!
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
                  Your results indicate you belong in:
                </p>

                <div style={{ display: 'inline-block', background: 'var(--teal-deep)', color: 'white', padding: '0.75rem 2.2rem', borderRadius: '16px', fontSize: '1.35rem', fontWeight: 'bold', marginBottom: '1.75rem', border: '1px solid var(--teal)' }}>
                  {resultTier} Tier
                </div>

                <p style={{ color: '#34d399', fontSize: '0.92rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                  🎉 +50 XP Welcome Placement Bonus has been credited to your profile!
                </p>

                <hr style={{ borderColor: '#1e3f35', marginBottom: '1.75rem' }} />

                <h4 style={{ color: 'white', fontSize: '1.05rem', marginBottom: '1rem', textAlign: 'left', fontWeight: 'bold' }}>
                  📚 Recommended Study Package for your level:
                </h4>

                {resultTier === 'Beginner' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div style={{ background: '#0a1d15', border: '1px solid #1e3f35', borderRadius: '16px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 'bold' }}>TEXTBOOK KIT</span>
                        <h5 style={{ margin: 0, color: 'white', fontSize: '0.98rem', fontWeight: 'bold' }}>Mnemonic Sticker Kit ($39)</h5>
                      </div>
                      <button type="button" className="edu-btn-3d" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '10px' }} onClick={() => handleDirectCheckout('Malmoa Visual Textbook & Sticker Package', 'textbook')}>
                        Order Kit
                      </button>
                    </div>

                    <div style={{ background: '#0a1d15', border: '1px solid #1e3f35', borderRadius: '16px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 'bold' }}>DIGITAL COURSE</span>
                        <h5 style={{ margin: 0, color: 'white', fontSize: '0.98rem', fontWeight: 'bold' }}>Beginner Course Lock ($19)</h5>
                      </div>
                      <Link to="/waitlist" className="edu-btn-secondary-3d" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--ink) !important', borderRadius: '10px' }}>
                        Unlock Tier
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div style={{ background: '#0a1d15', border: '1px solid #1e3f35', borderRadius: '16px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 'bold' }}>NATIVE TUTOR</span>
                        <h5 style={{ margin: 0, color: 'white', fontSize: '0.98rem', fontWeight: 'bold' }}>1-on-1 Coaching (1 Month) ($89)</h5>
                      </div>
                      <button type="button" className="edu-btn-3d" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '10px' }} onClick={() => handleDirectCheckout('1-on-1 Native Literacy Coaching (1 Month)', 'coaching')}>
                        Book Tutor
                      </button>
                    </div>

                    <div style={{ background: '#0a1d15', border: '1px solid #1e3f35', borderRadius: '16px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 'bold' }}>DIGITAL COURSE</span>
                        <h5 style={{ margin: 0, color: 'white', fontSize: '0.98rem', fontWeight: 'bold' }}>Advanced News Course ($39)</h5>
                      </div>
                      <Link to="/waitlist" className="edu-btn-secondary-3d" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--ink) !important', borderRadius: '10px' }}>
                        Unlock Tier
                      </Link>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className="edu-btn-secondary-3d"
                  onClick={() => setShowQuiz(false)}
                  style={{ width: '100%', marginTop: '1.75rem', borderRadius: '16px', padding: '0.75rem' }}
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
