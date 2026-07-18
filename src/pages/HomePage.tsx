import { useState } from 'react'
import { Link } from 'react-router-dom'
import './InnerPages.css'
import './HomePage.css'

type QuizQuestion = {
  prompt: string
  choices: string[]
  answer: string
  translation?: string
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
      // Evaluate final tier
      let tier: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner'
      const score = correctCount + (selectedChoice === PLACEMENT_QUIZ[quizIndex].answer ? 1 : 0)
      
      if (score === 2) tier = 'Intermediate'
      else if (score >= 3) tier = 'Advanced'

      setResultTier(tier)
      setQuizFinished(true)

      // Sync and upgrade profile tier instantly in localStorage (Duolingo style auto-unlock)
      const savedProfile = localStorage.getItem('malmoa-user-profile')
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile)
          parsed.tier = tier
          parsed.xp = (parsed.xp || 100) + 50 // Placement test completion bonus
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
    // 1. Add order to localStorage textbook orders
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
      alert(`🎉 Package Ordered! our admin logistics desk has been notified. Track it in your Admin desk.`)
    } 
    // 2. Add request to coaching orders
    else if (category === 'coaching') {
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
      {/* 듀오링고 & TTMIK 스타일 히어로 랜딩 섹션 */}
      <section className="hero" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', background: 'radial-gradient(circle at 80% 20%, rgba(13,115,119,0.08) 0%, transparent 60%)' }}>
        <div className="shell hero-grid-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', width: '100%', alignItems: 'center' }}>
          
          {/* Left Column: Visual copy & CTA triggers */}
          <div className="hero-copy reveal" style={{ textAlign: 'left' }}>
            <div className="wadiz-badge" style={{ display: 'inline-flex', background: 'color-mix(in srgb, var(--teal) 10%, white)', color: 'var(--teal-deep)', fontWeight: 'bold', padding: '0.4rem 0.8rem', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              ★ 2,300%+ Crowdfunded Mnemonic Method
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', lineHeight: 1.1, fontWeight: 'bold', marginBottom: '1.25rem', color: 'var(--ink)' }}>
              Learn Korean via <br/>
              <span style={{ color: 'var(--teal-deep)' }}>Visual Stories & Games</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '2.25rem', maxWidth: '34rem' }}>
              Our patented system maps abstract letters directly onto mnemonic cues. Discover your level in 30 seconds and unlock interactive games.
            </p>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn btn-primary btn-pulse" 
                style={{ padding: '0.9rem 2.25rem', fontSize: '1.05rem', fontWeight: 'bold' }}
                onClick={handleStartPlacement}
              >
                Get Started (Level Test)
              </button>
              <Link 
                className="btn btn-secondary" 
                to="/play-hub" 
                style={{ padding: '0.9rem 2.25rem', fontSize: '1.05rem', fontWeight: 'bold' }}
              >
                Go to Play Zone
              </Link>
            </div>
            <p style={{ marginTop: '1.25rem', fontSize: '0.88rem', color: 'var(--ink-soft)' }}>
              Have an account already? Use the <strong>🔑 Login</strong> menu above.
            </p>
          </div>

          {/* Right Column: Physical Kit Showcase */}
          <div style={{ position: 'relative' }}>
            <div style={{ background: '#f5f7fa', border: '1px solid var(--line)', borderRadius: '32px', padding: '1.5rem', boxShadow: '0 12px 30px rgba(0,0,0,0.03)' }}>
              <img 
                src="/wadiz-assets/asset1.jpg" 
                alt="Malmoa Mnemonic Kit Package" 
                style={{ width: '100%', height: 'auto', borderRadius: '24px', border: '1px solid var(--line)', display: 'block' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', padding: '0 0.5rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 'bold' }}>📚 Mnemonic Workbooks</span>
                <span style={{ fontSize: '0.88rem', color: 'var(--teal-deep)', fontWeight: 'bold' }}>Funded successfully on Wadiz</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3대 핵심 학습방법 홍보 섹션 */}
      <section className="section shell home-method" style={{ padding: '4rem 0' }}>
        <p className="section-label" style={{ textAlign: 'center' }}>How It Works</p>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontFamily: 'var(--font-display)' }}>Stories you remember. Literacy that lasts.</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div style={{ background: 'white', padding: '2rem', border: '1px solid var(--line)', borderRadius: '24px' }}>
            <span style={{ fontSize: '2.5rem' }}>🧠</span>
            <h3 style={{ fontFamily: 'var(--font-display)', margin: '1rem 0 0.5rem 0', fontWeight: 'bold' }}>1. Visual Mnemonics</h3>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6, fontSize: '0.92rem' }}>
              We translate difficult abstract character shapes into familiar icons. For example, "ㄱ" looks like a "Gun" and "ㄴ" looks like a "Nose". Your brain maps symbols instantly.
            </p>
          </div>
          <div style={{ background: 'white', padding: '2rem', border: '1px solid var(--line)', borderRadius: '24px' }}>
            <span style={{ fontSize: '2.5rem' }}>✍️</span>
            <h3 style={{ fontFamily: 'var(--font-display)', margin: '1rem 0 0.5rem 0', fontWeight: 'bold' }}>2. Active Recall Tracing</h3>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6, fontSize: '0.92rem' }}>
              Instead of boring repetitive copying, our interactive drawing canvas highlights stroke order direction guides, reinforcing muscle memory dynamically.
            </p>
          </div>
          <div style={{ background: 'white', padding: '2rem', border: '1px solid var(--line)', borderRadius: '24px' }}>
            <span style={{ fontSize: '2.5rem' }}>⛓️</span>
            <h3 style={{ fontFamily: 'var(--font-display)', margin: '1rem 0 0.5rem 0', fontWeight: 'bold' }}>3. Root Networks</h3>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6, fontSize: '0.92rem' }}>
              Learn vocabulary by deconstructing and analyzing underlying Hanja root symbols. Unlock dozens of advanced words from a single root naturally.
            </p>
          </div>
        </div>
      </section>

      {/* Wadiz Crowdfunding Media Archive Grid */}
      <section className="section shell" style={{ padding: '4rem 0' }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Wadiz Media Archive</p>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>Proven Crowdfunding Materials</h2>
        <p style={{ textAlign: 'center', color: 'var(--ink-soft)', maxWidth: '36rem', margin: '0 auto 3rem auto', fontSize: '0.95rem' }}>
          Check out the actual study materials, interactive GIFs, and short clips that drove our 2,300%+ funding success on Wadiz.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {/* Media 1 */}
          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid var(--line)', padding: '1.25rem' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: 'bold', color: 'var(--teal-deep)' }}>✨ Interactive Mnemonic Workbooks (GIF)</h4>
            <img src="/wadiz-assets/wadiz_8.gif" alt="Workbook stickers" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px' }} />
          </div>
          {/* Media 2 */}
          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid var(--line)', padding: '1.25rem' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: 'bold', color: 'var(--teal-deep)' }}>🎥 Real Study Demonstration</h4>
            <video src="/wadiz-assets/wadiz_6.mp4" controls loop muted autoPlay style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px' }} />
          </div>
          {/* Media 3 */}
          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid var(--line)', padding: '1.25rem' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: 'bold', color: 'var(--teal-deep)' }}>⭐️ Satisfaction Score</h4>
            <img src="/wadiz-assets/wadiz_1.png" alt="5.0 Score" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px' }} />
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
                
                {/* Chalkboard Quiz Prompt */}
                <h3 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '1.35rem', margin: '0.75rem 0 2rem 0', lineHeight: 1.3 }}>
                  {PLACEMENT_QUIZ[quizIndex].prompt}
                </h3>

                {/* Multiple choice options */}
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

                {/* Action button */}
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
              // 테스트 완료 화면: 등급 판정 및 TTMIK 스타일 추천 교재/강좌 판매 결합
              <div style={{ animation: 'rise 0.4s ease both', textAlign: 'center' }}>
                <span style={{ fontSize: '3rem' }}>🏆</span>
                <h3 style={{ color: 'white', margin: '0.75rem 0 0.5rem 0', fontSize: '1.65rem' }}>
                  Diagnostic Complete!
                </h3>
                <p style={{ color: '#a0aab8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Your results indicate you belong in:
                </p>

                {/* Placement result badge */}
                <div style={{ display: 'inline-block', background: 'var(--teal-deep)', color: 'white', padding: '0.6rem 1.75rem', borderRadius: '12px', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', border: '1px solid var(--teal)' }}>
                  {resultTier} Tier
                </div>

                <p style={{ color: '#10b981', fontSize: '0.88rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                  🎉 +50 XP Welcome Placement Bonus has been credited to your profile!
                </p>

                <hr style={{ borderColor: '#233143', marginBottom: '1.5rem' }} />

                {/* TTMIK style customized recommended package cards */}
                <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '1rem', textAlign: 'left' }}>
                  📚 Recommended Study Package for your level:
                </h4>

                {resultTier === 'Beginner' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {/* Textbook Suggestion */}
                    <div style={{ background: '#0e1621', border: '1px solid #233143', borderRadius: '16px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--teal)' }}>TEXTBOOK KIT</span>
                        <h5 style={{ margin: 0, color: 'white', fontSize: '0.92rem' }}>Mnemonic Sticker Kit ($39)</h5>
                      </div>
                      <button type="button" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleDirectCheckout('Malmoa Visual Textbook & Sticker Package', 'textbook')}>
                        Order Kit
                      </button>
                    </div>

                    {/* Course Suggestion */}
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
                    {/* Coaching Suggestion */}
                    <div style={{ background: '#0e1621', border: '1px solid #233143', borderRadius: '16px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--teal)' }}>NATIVE TUTOR</span>
                        <h5 style={{ margin: 0, color: 'white', fontSize: '0.92rem' }}>1-on-1 Coaching (1 Month) ($89)</h5>
                      </div>
                      <button type="button" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleDirectCheckout('1-on-1 Native Literacy Coaching (1 Month)', 'coaching')}>
                        Book Tutor
                      </button>
                    </div>

                    {/* Course Suggestion */}
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
