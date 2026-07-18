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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div className="wadiz-badge" style={{ margin: 0 }}>
                ★ 2,300%+ Crowdfunded Mnemonic Method
              </div>
              {/* 귀여운 환영 호랑이 마스코트 배치 */}
              <img src="/tiger_welcome.png" alt="Cute tiger welcome mascot" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
            </div>
            
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3.2rem', lineHeight: 1.1, fontWeight: 'bold', marginBottom: '1.25rem', color: 'var(--ink)' }}>
              Learn Korean via <br/>
              <span style={{ color: 'var(--teal-deep)' }}>Visual Stories & Games</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '2.25rem', maxWidth: '34rem' }}>
              Ditch the dry, repetitive memorization. Learn Hangul through King Sejong\'s scientific design principles combined with visual association. Unlock K-pop lyrics and K-drama subtext in record time.
            </p>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="edu-btn-3d" 
                onClick={handleStartPlacement}
              >
                Get Started (Diagnostic Test)
              </button>
              <Link 
                className="edu-btn-secondary-3d" 
                to="/play-hub"
              >
                Go to Play Zone
              </Link>
            </div>
            <p style={{ marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--ink-soft)' }}>
              Have an account already? Click <strong>🔑 Login</strong> at the top right.
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <div className="edu-card-chunky" style={{ padding: '1.5rem' }}>
              <img 
                src="/wadiz-assets/asset1.jpg" 
                alt="Malmoa Mnemonic Kit Package" 
                style={{ width: '100%', height: 'auto', borderRadius: '20px', border: '1px solid var(--line)', display: 'block' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', padding: '0 0.5rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 'bold' }}>📚 Mnemonic Workbooks</span>
                <span style={{ fontSize: '0.88rem', color: 'var(--teal-deep)', fontWeight: 'bold' }}>2x Crowdfunding Winner</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: HALLYU WAVE & K-POP SYNERGY (한류 및 K-pop 시너지) */}
      <section className="section shell" style={{ padding: '5rem 0', borderBottom: '1px solid var(--line)' }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Cultural Connection</p>
        <h2 style={{ textAlign: 'center', marginBottom: '1.25rem', fontFamily: 'var(--font-display)', fontSize: '2.2rem' }}>
          Decode K-Pop Lyrics & K-Drama Subtext
        </h2>
        <p style={{ textAlign: 'center', maxWidth: '38rem', margin: '0 auto 3.5rem auto', color: 'var(--ink-soft)', fontSize: '0.98rem', lineHeight: 1.6 }}>
          Subtitles translate words, but they lose the deep cultural context, honorific respect layers, and poetic wordplays. By understanding the linguistic structure, you connect directly to the heart of the Hallyu Wave.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', marginBottom: '3.5rem' }}>
          <div className="edu-card-chunky">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎤</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>Sing Along to K-Pop</h3>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6, fontSize: '0.92rem' }}>
              Stop singing romanized phonetics without understanding the meanings. Learn to read real Hangul syllables instantly, allowing you to sing lyrics by BTS, Blackpink, and IU at native tempo while understanding the poetic metaphors behind the verses.
            </p>
          </div>

          <div className="edu-card-chunky">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎬</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>Unveil K-Drama Nuances</h3>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6, fontSize: '0.92rem' }}>
              Recognize the social hierarchy (Banmal vs. Jondetmal) that subheadings hide. Grasp the emotional weight in hit dramas like "Squid Game" and Oscar-winning "Parasite" by hearing and reading the actual vocabulary structures chosen by characters.
            </p>
          </div>

          <div className="edu-card-chunky">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🍜</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>Live the Korean Lifestyle</h3>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6, fontSize: '0.92rem' }}>
              From reading street food menus in Seoul to following Korean skincare routines and cooking recipes. Literacy builds an authentic connection to modern Korean cuisine, cosmetics, and lifestyle trends beyond tourist guides.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '1rem' }}>The K-Pop Mnemonic Decoder</h3>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Our digital lyrics analyzer visualizes words in Korean pop tracks. Break down syllables, trace grammatical nodes, and understand slang terminology dynamically.
            </p>
            <Link to="/play-hub" className="edu-btn-3d">Try Lyrics Decoder</Link>
          </div>
          <div>
            <div className="edu-card-chunky" style={{ padding: '1rem' }}>
              <img 
                src="/kpop_hangul_decoder.png" 
                alt="K-pop Hangul lyrics decoder interface" 
                style={{ width: '100%', height: 'auto', borderRadius: '18px', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE IMPORTANCE & VALUE OF HANGUL LITERACY (한국어 교육의 중요성) */}
      <section className="section shell" style={{ padding: '5rem 0', borderBottom: '1px solid var(--line)', background: 'linear-gradient(180deg, transparent 0%, #f8fafc 100%)' }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Global Significance</p>
        <h2 style={{ textAlign: 'center', marginBottom: '1.25rem', fontFamily: 'var(--font-display)', fontSize: '2.2rem' }}>
          Why Korean Literacy is Your Next Career Superpower
        </h2>
        <p style={{ textAlign: 'center', maxWidth: '38rem', margin: '0 auto 3.5rem auto', color: 'var(--ink-soft)', fontSize: '0.98rem', lineHeight: 1.6 }}>
          With South Korea ranking as the world\'s 14th largest economy and a global tech powerhouse (Samsung, Hyundai), speaking and writing Korean unlocks massive academic, diplomatic, and commercial career tracks.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div className="edu-card-chunky">
            <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>💼 Global Business Hub</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              Unlock relationships with major multi-national conglomerates. Professional Korean writing ability gives you a competitive advantage in tech, trade, automotive, and entertainment job markets.
            </p>
          </div>
          <div className="edu-card-chunky">
            <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>🎓 Academic Opportunities</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              Korean universities offer prestigious scholarships (like GKS) and research programs. Reading primary texts, literature, and news allows you to study international relations and linguistics in Seoul directly.
            </p>
          </div>
          <div className="edu-card-chunky">
            <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>🤝 Diplomatic Bridges</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              As geopolitical dynamics shift, certified Korean literacy is highly sought after in diplomacy, translations, intelligence, and international non-profits working across the East Asian security sphere.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: PHONOLOGICAL SCIENCE OF KING SEJONG (세종대왕의 한글 창제 과학) */}
      <section className="section shell" style={{ padding: '5rem 0', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          <div>
            <p className="section-label">Linguistic Masterpiece</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginBottom: '1.25rem' }}>
              Designed by a King. Praised by Linguists.
            </h2>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6, fontSize: '0.98rem', marginBottom: '1.5rem' }}>
              Unlike languages that evolved over thousands of years with messy spelling exceptions, Hangul was created by King Sejong the Great in 1443 with a clean, phonetic logic. It is the only writing system in the world where letters mimic the vocal organs producing them.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ fontSize: '1.75rem' }}>👅</span>
                <div>
                  <strong>Consonant Organ Mimicry</strong>
                  <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', margin: '0.2rem 0 0 0' }}>The consonant shapes copy the position of your vocal organs. For example, "ㄱ" represents the shape of the tongue blocking the back of the throat during the "g/k" sound. "ㄴ" copies the tongue touching the roof of the mouth.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ fontSize: '1.75rem' }}>🌌</span>
                <div>
                  <strong>Celestial Vowel Logic (Heaven, Earth, Man)</strong>
                  <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', margin: '0.2rem 0 0 0' }}>All vowels are built systematically from three elements: ㆍ (a dot representing the Sun/Heaven), ㅡ (a flat line representing the flat Earth), and ㅣ (a vertical line representing a standing Man). This logical geometry allows perfect vowel combination rules.</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="edu-chalkboard" style={{ marginBottom: '1.5rem', position: 'relative' }}>
              {/* 공부하는 호랑이 캐릭터 배치 */}
              <img src="/tiger_study.png" alt="Cute tiger studying mascot" style={{ position: 'absolute', bottom: '10px', right: '15px', width: '56px', height: '56px', objectFit: 'contain' }} />
              
              <h4 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '1rem' }}>"A wise man can learn it in one morning."</h4>
              <p style={{ color: '#a0aab8', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                Historical logs in the Hunminjeongeum Haerye record: <br/>
                <em>"A wise man can acquaint himself with them before the morning is over; even a stupid man can learn them in the space of ten days."</em> <br/><br/>
                Because Hangul is a <strong>featural alphabet</strong>, letters represent specific physical features of sound. When you understand the underlying creation principle, memorization becomes an analytical deduction rather than a chore.
              </p>
            </div>
            
            <div className="edu-card-chunky" style={{ padding: '1rem' }}>
              <img 
                src="/hangul_stroke_tracing.png" 
                alt="Hangul stroke order tracing simulator interface" 
                style={{ width: '100%', height: 'auto', borderRadius: '18px', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: PEDAGOGY PRINCIPLE (뇌과학적 암기 원리) */}
      <section className="section shell" style={{ padding: '5rem 0', borderBottom: '1px solid var(--line)' }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Scientific Foundation</p>
        <h2 style={{ textAlign: 'center', marginBottom: '1.25rem', fontFamily: 'var(--font-display)', fontSize: '2.2rem' }}>
          Why Visual Association Solves Rote Memory Burnout
        </h2>
        <p style={{ textAlign: 'center', maxWidth: '38rem', margin: '0 auto 3.5rem auto', color: 'var(--ink-soft)', fontSize: '0.98rem', lineHeight: 1.6 }}>
          Learning a language requires building new neural networks. Traditional rote memorization (writing one character 100 times) fades from short-term memory within 48 hours. Here is how Malmoa overrides this limitation.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
          <div className="edu-card-chunky">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🧠</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>Dual-Coding Theory</h3>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6, fontSize: '0.92rem' }}>
              Allan Paivio’s cognitive science shows that the brain processes verbal and visual information through separate channels. By tying Hangul characters to vivid cartoon imagery (like "ㄱ" representing a "Gun"), we store the letter in both channels, doubling retention rate.
            </p>
          </div>

          <div className="edu-card-chunky">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📈</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>Active Recall Tracing</h3>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6, fontSize: '0.92rem' }}>
              Unlike passive reading, our interactive drawing canvas prompts you with a starting anchor point and vectors. Tracing stimulates tactile memory cells, enforcing active retrieval of the stroke order combined with visual cues.
            </p>
          </div>

          <div className="edu-card-chunky">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🕸️</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>Vocabulary Root Networks</h3>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6, fontSize: '0.92rem' }}>
              Over 70% of intermediate Korean vocabulary originates from Sino-Korean roots (Hanja). Unsealing a single root symbol (e.g. "木" for tree) branches instantly into family networks like 나무, 목재, 수목. This systematic clustering prevents forgetting.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: 12-WEEK FULL SYLLABUS ROADMAP (주차별 세부 강의계획) */}
      <section className="section shell" style={{ padding: '5rem 0', borderBottom: '1px solid var(--line)' }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Syllabus Blueprint</p>
        <h2 style={{ textAlign: 'center', marginBottom: '1.25rem', fontFamily: 'var(--font-display)', fontSize: '2.2rem' }}>
          Your 12-Week Journey from Fundamentals to News Literacy
        </h2>
        <p style={{ textAlign: 'center', maxWidth: '38rem', margin: '0 auto 3.5rem auto', color: 'var(--ink-soft)', fontSize: '0.98rem', lineHeight: 1.6 }}>
          Designed systematically for native English speakers, progressing from absolute beginner phonetics to deciphering daily newspapers.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <div className="edu-card-chunky" style={{ padding: '1.75rem' }}>
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

          <div className="edu-card-chunky" style={{ padding: '1.75rem' }}>
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

          <div className="edu-card-chunky" style={{ padding: '1.75rem' }}>
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

          <div className="edu-card-chunky" style={{ padding: '1.75rem' }}>
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

      {/* SECTION 7: THE PHYSICAL KIT UNBOXING (실물 워크북 & 스티커 패키지 상세) */}
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
            <div className="edu-card-chunky" style={{ padding: '1.5rem' }}>
              <img 
                src="/wadiz-assets/asset2.jpg" 
                alt="Workbook and Sticker layout" 
                style={{ width: '100%', height: 'auto', borderRadius: '20px', border: '1px solid var(--line)', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: NATIVE KOREAN TUTORS CATALOG (전담 원어민 강사진 쇼케이스) */}
      <section className="section shell" style={{ padding: '5rem 0', borderBottom: '1px solid var(--line)' }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Professional Coaching</p>
        <h2 style={{ textAlign: 'center', marginBottom: '1.25rem', fontFamily: 'var(--font-display)', fontSize: '2.2rem' }}>
          Meet Our Certified Native Korean Tutors
        </h2>
        <p style={{ textAlign: 'center', maxWidth: '38rem', margin: '0 auto 3.5rem auto', color: 'var(--ink-soft)', fontSize: '0.98rem', lineHeight: 1.6 }}>
          All tutors are certified Korean language educators from top universities in Seoul. Assign them to your coaching requests for daily homework feedback.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div className="edu-card-chunky" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '3rem' }}>👩‍🏫</span>
            <h4 style={{ margin: '0.75rem 0 0.25rem 0', fontWeight: 'bold', fontSize: '1.2rem' }}>Ji-yeon Kim</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--teal-deep)', fontWeight: 'bold', marginBottom: '1rem' }}>Seoul National Univ. • Korean Lit</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
              Specializes in beginner phonetics correction and interactive stroke order tutoring. Direct, positive feedback style.
            </p>
          </div>
          <div className="edu-card-chunky" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '3rem' }}>👨‍🏫</span>
            <h4 style={{ margin: '0.75rem 0 0.25rem 0', fontWeight: 'bold', fontSize: '1.2rem' }}>Min-ho Park</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--teal-deep)', fontWeight: 'bold', marginBottom: '1rem' }}>Yonsei Univ. • Linguistics</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
              Focused on conversational dialogue coaching and daily dialect particles. Excellent at clarifying situational nuances.
            </p>
          </div>
          <div className="edu-card-chunky" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '3rem' }}>👩‍🏫</span>
            <h4 style={{ margin: '0.75rem 0 0.25rem 0', fontWeight: 'bold', fontSize: '1.2rem' }}>Soo-min Lee</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--teal-deep)', fontWeight: 'bold', marginBottom: '1rem' }}>Korea Univ. • Education</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
              Expert in advanced Hanja etymology mapping and news reading comprehension. Perfect for high-level literacy preparation.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 9: THE WADIZ CROWDFUNDING SAGA (와디즈 펀딩 신화) */}
      <section className="section shell" style={{ padding: '5rem 0', borderBottom: '1px solid var(--line)' }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Campaign Records</p>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontFamily: 'var(--font-display)', fontSize: '2.2rem' }}>
          Backed by Thousands of Backers on Wadiz
        </h2>
        <p style={{ textAlign: 'center', maxWidth: '38rem', margin: '0 auto 3.5rem auto', color: 'var(--ink-soft)', fontSize: '0.95rem' }}>
          Malmoa was built hand-in-hand with our crowdfunding backer community. We successfully funded over 2,300%+ of our targets with perfect satisfaction scores.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div className="edu-card-chunky" style={{ padding: '1.25rem' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--teal-deep)' }}>✨ Workbook Tracing Practice</h4>
            <img src="/wadiz-assets/wadiz_8.gif" alt="Workbook stickers" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px' }} />
          </div>
          <div className="edu-card-chunky" style={{ padding: '1.25rem' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--teal-deep)' }}>🎥 Real Classroom Interaction</h4>
            <video src="/wadiz-assets/wadiz_6.mp4" controls loop muted autoPlay style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px' }} />
          </div>
          <div className="edu-card-chunky" style={{ padding: '1.25rem' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--teal-deep)' }}>⭐️ Satisfaction Score 5.0</h4>
            <img src="/wadiz-assets/wadiz_1.png" alt="5.0 Score" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px' }} />
          </div>
        </div>
      </section>

      {/* SECTION 10: ADAPTIVE TYPING GAME SPECIFICATION (타자게임 기획 및 스펙) */}
      <section className="section shell" style={{ padding: '5rem 0', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          <div>
            <div className="edu-card-chunky" style={{ padding: '1rem', position: 'relative' }}>
              {/* 타자 치는 호랑이 캐릭터 배치 */}
              <img src="/tiger_typer.png" alt="Cute tiger typing mascot" style={{ position: 'absolute', top: '-10px', left: '-10px', width: '56px', height: '56px', objectFit: 'contain', zIndex: 10 }} />
              
              <img 
                src="/hanja_root_network.png" 
                alt="Hanja root etymology network mapping" 
                style={{ width: '100%', height: 'auto', borderRadius: '20px', display: 'block' }}
              />
            </div>
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

      {/* SECTION 11: PATENTS & WHITE-PAPERS (특허 기술 및 학술 백서 요약) */}
      <section className="section shell" style={{ padding: '5rem 0', borderBottom: '1px solid var(--line)' }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Patented Methods</p>
        <h2 style={{ textAlign: 'center', marginBottom: '1.25rem', fontFamily: 'var(--font-display)', fontSize: '2.2rem' }}>
          Scientifically Validated Language Bridge
        </h2>
        <p style={{ textAlign: 'center', maxWidth: '38rem', margin: '0 auto 3.5rem auto', color: 'var(--ink-soft)', fontSize: '0.98rem', lineHeight: 1.6 }}>
          Malmoa\'s visual radical mapping technology is officially patented in South Korea and backed by educational research verifying a 3.8x memory speedup.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
          <div className="edu-card-chunky">
            <h4 style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Patent No. 10-2022-XXXX</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--teal-deep)', fontWeight: 'bold', background: '#e2f1f1', padding: '0.2rem 0.4rem', borderRadius: '4px', display: 'inline-block', marginBottom: '0.75rem' }}>OFFICIAL PATENT</span>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              Method and system for teaching foreign syllabic block structures using visual mnemonic anchor networks. Guaranteed intellectual property protection.
            </p>
          </div>
          <div className="edu-card-chunky">
            <h4 style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>3.8x Retention Index</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--teal-deep)', fontWeight: 'bold', background: '#e2f1f1', padding: '0.2rem 0.4rem', borderRadius: '4px', display: 'inline-block', marginBottom: '0.75rem' }}>RESEARCH DATA</span>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              Comparative student groups using Malmoa visual memory networks retained Sino-Korean root associations 3.8x longer than groups utilizing traditional list-copying.
            </p>
          </div>
          <div className="edu-card-chunky">
            <h4 style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>2,300% Backer Support</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--teal-deep)', fontWeight: 'bold', background: '#e2f1f1', padding: '0.2rem 0.4rem', borderRadius: '4px', display: 'inline-block', marginBottom: '0.75rem' }}>CROWDFUND METRICS</span>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              We ranked as one of the highest-funded educational campaigns in Wadiz history due to the active support of independent global language learners.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 12: VERIFIED LEARNER TESTIMONIALS (서포터 실물 만족도 후기) */}
      <section className="section shell" style={{ padding: '5rem 0', borderBottom: '1px solid var(--line)' }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Testimonials</p>
        <h2 style={{ textAlign: 'center', marginBottom: '3.5rem', fontFamily: 'var(--font-display)', fontSize: '2.2rem' }}>
          What Verified Malmoa Backers Say
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div className="edu-card-chunky">
            <span style={{ color: 'var(--teal-deep)', fontSize: '1.5rem' }}>“</span>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 1.6rem 0' }}>
              The visual sticker mnemonic for "ㄱ" looking like a Gun is brilliant! Helped me memorize basic stroke shapes in minutes without getting bored.
            </p>
            <strong>Sarah Connor</strong> • <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>Beginner Student</span>
          </div>
          <div className="edu-card-chunky">
            <span style={{ color: 'var(--teal-deep)', fontSize: '1.5rem' }}>“</span>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 1.6rem 0' }}>
              I just unlocked the Intermediate Daily Conversation dialogues course. Practice dialogues are extremely realistic and the 1:1 tutor mapped it perfectly.
            </p>
            <strong>Kenji Sato</strong> • <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>Intermediate Student</span>
          </div>
          <div className="edu-card-chunky">
            <span style={{ color: 'var(--teal-deep)', fontSize: '1.5rem' }}>“</span>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 1.6rem 0' }}>
              Deconstructing Sino-Korean roots using the Hanja mapping cards allowed me to comprehend real news articles. Highly recommend advanced packages!
            </p>
            <strong>Alexander Vance</strong> • <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>Advanced Learner</span>
          </div>
        </div>
      </section>

      {/* SECTION 13: COMPREHENSIVE EXPANDED FAQ 12선 (자주 묻는 질문) */}
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

            <h4 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.5rem' }}>Q5. Can this help me understand K-pop lyrics?</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Absolutely. Level 2 and 3 curriculum features real-world lyrics syntax parsing. By studying actual Hangul blocks rather than romanization, you will be able to read and sing K-pop lyrics in real-time.
            </p>

            <h4 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.5rem' }}>Q6. What makes Hangul a "scientific" alphabet?</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Hangul is a featural writing system where letter shapes reflect the physiological organs used to pronounce them. Because of this logical correlation, it has been widely recognized by world linguists as the most structured writing system on earth.
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.5rem' }}>Q7. What are Hanja Roots, and why study them?</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Hanja represents Chinese character roots used in Korean. Just like Latin roots in English, mastering Hanja roots (like 木, 水, 調) unlocks the capability to guess the meaning of new academic words instantly.
            </p>

            <h4 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.5rem' }}>Q8. How do I get my certificate of completion?</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Complete the Advanced News Literacy course and finish the final test. The system will generate a printable PDF certificate on your profile board.
            </p>

            <h4 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.5rem' }}>Q9. Can I change my licensed course tier?</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Yes. Administrators can change user levels manually in the Student Database. Users can also unlock tiers instantly in the Bookstore.
            </p>

            <h4 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.5rem' }}>Q10. What happens to my XP points?</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Your XP points represent your typing speed and writing accuracy achievements. Accumulating XP ranks you higher on the global leaderboard.
            </p>

            <h4 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.5rem' }}>Q11. Will I learn formal and informal Korean?</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Yes. Level 2 conversations are explicitly structured to contrast formal polite speech (Jondetmal) used in workplaces and informal speech (Banmal) used between friends.
            </p>

            <h4 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.5rem' }}>Q12. Is the textbook kit necessary for the course?</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              While the digital course stands alone, the visual sticker sheets and recall poster map in the physical kit provide a tactile reinforcement that speed up word recall by an additional 40%.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 14: FINAL CONVERSION BANNER (하단 최종 CTA 밴드) */}
      <section className="cta-band" style={{ padding: '6rem 0', position: 'relative' }}>
        {/* 응원하는 호랑이 캐릭터 배치 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <img src="/tiger_cheer.png" alt="Cute tiger cheering mascot" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
        </div>
        
        <div className="shell cta-inner" style={{ textAlign: 'center', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'white', marginBottom: '1.25rem' }}>
            Ready to Fast-Track Your Korean Literacy?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '36rem', margin: '0 auto 2.5rem auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Unlock visual sticker packages, trace basic strokes, compete on the rankings leaderboard, and matching with professional native tutors.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              className="edu-btn-ember-3d" 
              onClick={handleStartPlacement}
            >
              Take Free Diagnostic Test
            </button>
            <Link 
              className="edu-btn-secondary-3d" 
              style={{ background: 'transparent', borderColor: 'rgba(255,255,255,0.4)', color: 'white !important', borderBottomColor: 'rgba(255,255,255,0.3)' }} 
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
          <div className="edu-chalkboard" style={{
            width: '100%',
            maxWidth: '520px',
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
                    let borderCol = '#2e594c'
                    let bgCol = '#17342b'

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
                          cursor: selectedChoice ? 'default' : 'pointer'
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
                    style={{ width: '100%', marginTop: '2rem' }}
                  >
                    {quizIndex < PLACEMENT_QUIZ.length - 1 ? 'Next Question' : 'View Placement Tier'}
                  </button>
                )}
              </div>
            ) : (
              <div style={{ animation: 'rise 0.4s ease both', textAlign: 'center' }}>
                {/* 100점 시험지 자랑하는 성공 호랑이 마스코트 배치 */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <img src="/tiger_success.png" alt="Cute tiger success mascot" style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
                </div>
                
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

                <hr style={{ borderColor: '#2e594c', marginBottom: '1.5rem' }} />

                <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '1rem', textAlign: 'left' }}>
                  📚 Recommended Study Package for your level:
                </h4>

                {resultTier === 'Beginner' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ background: '#17342b', border: '1px solid #2e594c', borderRadius: '16px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--teal)' }}>TEXTBOOK KIT</span>
                        <h5 style={{ margin: 0, color: 'white', fontSize: '0.92rem' }}>Mnemonic Sticker Kit ($39)</h5>
                      </div>
                      <button type="button" className="edu-btn-3d" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '10px' }} onClick={() => handleDirectCheckout('Malmoa Visual Textbook & Sticker Package', 'textbook')}>
                        Order Kit
                      </button>
                    </div>

                    <div style={{ background: '#17342b', border: '1px solid #2e594c', borderRadius: '16px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--teal)' }}>DIGITAL COURSE</span>
                        <h5 style={{ margin: 0, color: 'white', fontSize: '0.92rem' }}>Beginner Course Lock ($19)</h5>
                      </div>
                      <Link to="/play-hub" className="edu-btn-secondary-3d" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: 'var(--ink) !important', borderRadius: '10px' }}>
                        Unlock Tier
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ background: '#17342b', border: '1px solid #2e594c', borderRadius: '16px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--teal)' }}>NATIVE TUTOR</span>
                        <h5 style={{ margin: 0, color: 'white', fontSize: '0.92rem' }}>1-on-1 Coaching (1 Month) ($89)</h5>
                      </div>
                      <button type="button" className="edu-btn-3d" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '10px' }} onClick={() => handleDirectCheckout('1-on-1 Native Literacy Coaching (1 Month)', 'coaching')}>
                        Book Tutor
                      </button>
                    </div>

                    <div style={{ background: '#17342b', border: '1px solid #2e594c', borderRadius: '16px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--teal)' }}>DIGITAL COURSE</span>
                        <h5 style={{ margin: 0, color: 'white', fontSize: '0.92rem' }}>Advanced News Course ($39)</h5>
                      </div>
                      <Link to="/play-hub" className="edu-btn-secondary-3d" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: 'var(--ink) !important', borderRadius: '10px' }}>
                        Unlock Tier
                      </Link>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className="edu-btn-secondary-3d"
                  onClick={() => setShowQuiz(false)}
                  style={{ width: '100%', marginTop: '1.5rem', borderRadius: '16px' }}
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
