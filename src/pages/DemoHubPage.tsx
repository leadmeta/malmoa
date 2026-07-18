import { useState, useRef, useEffect } from 'react'
import { conversations, type ConversationTopic } from '../data/content'
import './InnerPages.css'

type JamoDetail = {
  char: string
  name: string
  sound: string
  story: string
  paths: { x: number; y: number }[][]
}

const FULL_CONSONANTS: JamoDetail[] = [
  {
    char: 'ㄱ',
    name: '기역 (Giyeok)',
    sound: 'g/k',
    story: 'Resembles a hand-gun pointing left. Sound makes "g" as in Gun.',
    paths: [[{ x: 25, y: 25 }, { x: 75, y: 25 }, { x: 75, y: 75 }]]
  },
  {
    char: 'ㄴ',
    name: '니은 (Nieun)',
    sound: 'n',
    story: 'Resembles a profile Nose. Sound makes "n" as in Nose.',
    paths: [[{ x: 25, y: 25 }, { x: 25, y: 75 }, { x: 75, y: 75 }]]
  },
  {
    char: 'ㄷ',
    name: '디은 (Digeut)',
    sound: 'd',
    story: 'Resembles a Door frame. Sound makes "d" as in Door.',
    paths: [
      [{ x: 25, y: 25 }, { x: 75, y: 25 }],
      [{ x: 25, y: 25 }, { x: 25, y: 75 }, { x: 75, y: 75 }]
    ]
  },
  {
    char: 'ㄹ',
    name: '리을 (Rieul)',
    sound: 'r/l',
    story: 'Resembles a Rattlesnake crawling. Sound makes "r/l" as in Rattlesnake.',
    paths: [
      [{ x: 25, y: 25 }, { x: 75, y: 25 }, { x: 75, y: 50 }, { x: 25, y: 50 }, { x: 25, y: 75 }, { x: 75, y: 75 }]
    ]
  },
  {
    char: 'ㅁ',
    name: '미음 (Mieum)',
    sound: 'm',
    story: 'Resembles a closed Mouth box. Sound makes "m" as in Mouth.',
    paths: [
      [{ x: 25, y: 25 }, { x: 25, y: 75 }],
      [{ x: 25, y: 25 }, { x: 75, y: 25 }, { x: 75, y: 75 }],
      [{ x: 25, y: 75 }, { x: 75, y: 75 }]
    ]
  },
  {
    char: 'ㅂ',
    name: '비읍 (Bieup)',
    sound: 'b/p',
    story: 'Resembles a Bucket filled with water. Sound makes "b" as in Bucket.',
    paths: [
      [{ x: 25, y: 25 }, { x: 25, y: 75 }],
      [{ x: 75, y: 25 }, { x: 75, y: 75 }],
      [{ x: 25, y: 50 }, { x: 75, y: 50 }],
      [{ x: 25, y: 75 }, { x: 75, y: 75 }]
    ]
  },
  {
    char: 'ㅅ',
    name: '시옷 (Siot)',
    sound: 's',
    story: 'Resembles a person Standing. Sound makes "s" as in Stand.',
    paths: [
      [{ x: 50, y: 25 }, { x: 25, y: 75 }],
      [{ x: 50, y: 50 }, { x: 75, y: 75 }]
    ]
  },
  {
    char: 'ㅇ',
    name: '이응 (Ieung)',
    sound: 'ng / silent',
    story: 'Resembles a round mouth making an "O" shape.',
    paths: [[{ x: 50, y: 25 }, { x: 25, y: 50 }, { x: 50, y: 75 }, { x: 75, y: 50 }, { x: 50, y: 25 }]]
  },
  {
    char: 'ㅈ',
    name: '지읒 (Jieut)',
    sound: 'j',
    story: 'Resembles a person jumping over a fence.',
    paths: [
      [{ x: 25, y: 25 }, { x: 75, y: 25 }],
      [{ x: 50, y: 25 }, { x: 25, y: 75 }],
      [{ x: 50, y: 50 }, { x: 75, y: 75 }]
    ]
  },
  {
    char: 'ㅊ',
    name: '치읓 (Chieut)',
    sound: 'ch',
    story: 'Resembles a person wearing a Chef hat.',
    paths: [
      [{ x: 45, y: 15 }, { x: 55, y: 15 }],
      [{ x: 25, y: 30 }, { x: 75, y: 30 }],
      [{ x: 50, y: 30 }, { x: 25, y: 75 }],
      [{ x: 50, y: 55 }, { x: 75, y: 75 }]
    ]
  },
  {
    char: 'ㅋ',
    name: '키읔 (Kieuk)',
    sound: 'k',
    story: 'Resembles a Gun with an extra key trigger.',
    paths: [
      [{ x: 25, y: 25 }, { x: 75, y: 25 }, { x: 75, y: 75 }],
      [{ x: 25, y: 50 }, { x: 75, y: 50 }]
    ]
  },
  {
    char: 'ㅌ',
    name: '티읕 (Tieuet)',
    sound: 't',
    story: 'Resembles a teeth comb. Sound makes "t" as in Teeth.',
    paths: [
      [{ x: 25, y: 25 }, { x: 75, y: 25 }],
      [{ x: 25, y: 50 }, { x: 65, y: 50 }],
      [{ x: 25, y: 25 }, { x: 25, y: 75 }, { x: 75, y: 75 }]
    ]
  },
  {
    char: 'ㅍ',
    name: '피읍 (Pieup)',
    sound: 'p',
    story: 'Resembles a tall Pillared gate. Sound makes "p" as in Pillar.',
    paths: [
      [{ x: 25, y: 25 }, { x: 75, y: 25 }],
      [{ x: 40, y: 25 }, { x: 40, y: 75 }],
      [{ x: 60, y: 25 }, { x: 60, y: 75 }],
      [{ x: 25, y: 75 }, { x: 75, y: 75 }]
    ]
  },
  {
    char: 'ㅎ',
    name: '히읗 (Hieut)',
    sound: 'h',
    story: 'Resembles a person wearing a Hat.',
    paths: [
      [{ x: 45, y: 15 }, { x: 55, y: 15 }],
      [{ x: 30, y: 30 }, { x: 70, y: 30 }],
      [{ x: 50, y: 40 }, { x: 25, y: 60 }, { x: 50, y: 80 }, { x: 75, y: 60 }, { x: 50, y: 40 }]
    ]
  }
]

type ClassTab = 'level1' | 'level2' | 'level3'

export function DemoHubPage() {
  const [activeTab, setActiveTab] = useState<ClassTab>('level1')
  
  // User auth profile licensing
  const [userTier, setUserTier] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Guest'>('Guest')
  
  // Tracing state
  const [selectedJamo, setSelectedJamo] = useState<JamoDetail>(FULL_CONSONANTS[0])
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  // Level 2 dialogue state
  const [selectedConv, setSelectedConv] = useState<ConversationTopic>(conversations[0])

  // Mini quiz state
  const [quizAnswered, setQuizAnswered] = useState(false)
  const [isQuizCorrect, setIsQuizCorrect] = useState(false)

  // Synchronize tier on mount
  useEffect(() => {
    const saved = localStorage.getItem('malmoa-user-profile')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setUserTier(parsed.tier || 'Guest')
      } catch {
        setUserTier('Guest')
      }
    }
  }, [])

  // Web Speech API Pronunciation voice synthesizer
  const speakVoice = (textToSpeak: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.')
      return
    }
    window.speechSynthesis.cancel() // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.lang = 'ko-KR'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  // Tracing Canvas drawing guide loop
  useEffect(() => {
    if (activeTab !== 'level1' || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Center cross lines
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    
    ctx.beginPath()
    ctx.moveTo(0, canvas.height / 2)
    ctx.lineTo(canvas.width, canvas.height / 2)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2, 0)
    ctx.lineTo(canvas.width / 2, canvas.height)
    ctx.stroke()
    ctx.setLineDash([])

    // Guide Font Background
    ctx.fillStyle = 'rgba(13,115,119,0.06)'
    ctx.font = 'bold 160px Inter, system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(selectedJamo.char, canvas.width / 2, canvas.height / 2)

    // Guide paths arrows
    ctx.strokeStyle = 'rgba(196,92,38,0.4)'
    ctx.lineWidth = 6
    ctx.lineCap = 'round'

    selectedJamo.paths.forEach((path) => {
      if (path.length < 2) return
      ctx.beginPath()
      const startX = (path[0].x / 100) * canvas.width
      const startY = (path[0].y / 100) * canvas.height
      ctx.moveTo(startX, startY)

      for (let i = 1; i < path.length; i++) {
        const nextX = (path[i].x / 100) * canvas.width
        const nextY = (path[i].y / 100) * canvas.height
        ctx.lineTo(nextX, nextY)
      }
      ctx.stroke()

      // Start dot
      ctx.fillStyle = '#c45c26'
      ctx.beginPath()
      ctx.arc(startX, startY, 7, 0, Math.PI * 2)
      ctx.fill()
    })
    
    setQuizAnswered(false)
  }, [selectedJamo, activeTab])

  // Tracing coordinates
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.strokeStyle = 'var(--teal-deep)'
    ctx.lineWidth = 8
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const rect = canvas.getBoundingClientRect()
    let clientX = 0
    let clientY = 0

    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    ctx.beginPath()
    ctx.moveTo(clientX - rect.left, clientY - rect.top)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    let clientX = 0
    let clientY = 0

    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    setSelectedJamo({ ...selectedJamo })
  }

  // Answer Quiz
  const handleQuizAnswer = (isCorrect: boolean) => {
    setIsQuizCorrect(isCorrect)
    setQuizAnswered(true)
  }

  // TTMIK Paywall purchase triggers
  const handleUnlockPurchase = (itemName: string) => {
    const saved = localStorage.getItem('malmoa-orders')
    let orders = []
    if (saved) {
      try { orders = JSON.parse(saved) } catch { }
    }
    orders.push({
      id: `ord-${Date.now()}`,
      item: itemName,
      buyer: 'Classroom Student',
      status: 'Processing',
      date: new Date().toISOString().split('T')[0]
    })
    localStorage.setItem('malmoa-orders', JSON.stringify(orders))

    // Upgrade tier instantly
    const savedProfile = localStorage.getItem('malmoa-user-profile')
    let newTier: 'Intermediate' | 'Advanced' = 'Intermediate'
    if (itemName.includes('Advanced')) newTier = 'Advanced'

    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile)
        parsed.tier = newTier
        localStorage.setItem('malmoa-user-profile', JSON.stringify(parsed))
      } catch { }
    } else {
      localStorage.setItem('malmoa-user-profile', JSON.stringify({ name: 'Premium Student', xp: 200, tier: newTier }))
    }

    setUserTier(newTier)
    alert(`🎉 Purchase Completed! Your access to ${newTier} classroom has been immediately unlocked.`)
  }

  return (
    <div className="shell reveal" style={{ paddingBottom: '4rem', marginTop: '1.5rem' }}>
      
      {/* 1. Classroom tabs selector */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--line)', paddingBottom: '1px', marginBottom: '2.5rem', overflowX: 'auto' }}>
        {(['level1', 'level2', 'level3'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              background: 'transparent',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              color: activeTab === tab ? 'var(--teal-deep)' : 'var(--ink-soft)',
              borderBottom: activeTab === tab ? '3px solid var(--teal)' : '3px solid transparent',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap'
            }}
          >
            {tab === 'level1' && '👶 Level 1: Basic Consonants'}
            {tab === 'level2' && '💬 Level 2: Conversations'}
            {tab === 'level3' && '📚 Level 3: News & Hanja'}
          </button>
        ))}
      </div>

      {/* RENDER CHANNELS */}

      {/* ==================== TAB 1: LEVEL 1 (GUEST OPEN) ==================== */}
      {activeTab === 'level1' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
            
            {/* Left Box: 14 Consonants Selector Grid */}
            <div className="edu-card-chunky" style={{ padding: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 'bold', marginBottom: '1.25rem' }}>
                Select a Consonant (14 Basic Sounds)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.65rem' }}>
                {FULL_CONSONANTS.map((jamo) => (
                  <button
                    key={jamo.char}
                    type="button"
                    onClick={() => setSelectedJamo(jamo)}
                    style={{
                      height: '52px',
                      fontSize: '1.4rem',
                      fontWeight: 'bold',
                      borderRadius: '12px',
                      border: selectedJamo.char === jamo.char ? '2px solid var(--teal)' : '2px solid var(--line)',
                      borderBottomWidth: selectedJamo.char === jamo.char ? '5px' : '5px',
                      background: selectedJamo.char === jamo.char ? 'color-mix(in srgb, var(--teal) 10%, white)' : 'white',
                      color: selectedJamo.char === jamo.char ? 'var(--teal-deep)' : 'var(--ink)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.1s ease'
                    }}
                  >
                    {jamo.char}
                  </button>
                ))}
              </div>

              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', marginTop: '1.5rem', border: '1px solid var(--line)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--teal-deep)', fontWeight: 'bold', textTransform: 'uppercase' }}>Consonant Info</span>
                <h4 style={{ margin: '0.25rem 0 0.5rem 0', fontWeight: 'bold' }}>{selectedJamo.name}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', lineHeight: 1.4, margin: 0 }}>
                  <strong>Mnemonic Cue:</strong> {selectedJamo.story}
                </p>
                
                {/* TTS Voice play triggers */}
                <button
                  type="button"
                  className="edu-btn-3d"
                  style={{ width: '100%', marginTop: '1rem', padding: '0.6rem', fontSize: '0.88rem' }}
                  onClick={() => speakVoice(selectedJamo.char)}
                >
                  🔊 Listen & Repeat
                </button>
              </div>
            </div>

            {/* Middle Box: Tracing Canvas */}
            <div className="edu-card-chunky" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, fontWeight: 'bold' }}>Trace the Stroke Guide</h4>
                <button type="button" className="btn btn-secondary" style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }} onClick={clearCanvas}>
                  Clear
                </button>
              </div>

              <canvas
                ref={canvasRef}
                width={320}
                height={320}
                style={{
                  background: '#fafbfd',
                  border: '2px solid var(--line)',
                  borderRadius: '20px',
                  cursor: 'crosshair',
                  touchAction: 'none',
                  display: 'block',
                  margin: '0 auto'
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              <p style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', marginTop: '0.75rem' }}>
                Follow the red dot anchors and trace the path using your mouse or finger.
              </p>
            </div>

          </div>

          {/* Chalkboard mini-quiz matcher */}
          <div className="edu-chalkboard" style={{ maxWidth: '640px', margin: '0 auto w-100' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Consonant Practice Matcher</span>
            <h3 style={{ color: 'white', margin: '0.5rem 0 1.5rem 0', fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>
              Which visual cue belongs to: "{selectedJamo.char}"?
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              <button 
                type="button" 
                className="edu-chalkboard-option"
                onClick={() => handleQuizAnswer(true)}
              >
                {selectedJamo.char === 'ㄱ' ? '🔫 Hand Gun' : selectedJamo.char === 'ㄴ' ? '👃 Profile Nose' : '🚪 Door Frame'}
              </button>
              <button 
                type="button" 
                className="edu-chalkboard-option"
                onClick={() => handleQuizAnswer(false)}
              >
                🐍 Crawling Rattlesnake
              </button>
            </div>

            {quizAnswered && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '12px', background: isQuizCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(196,92,38,0.15)', color: isQuizCorrect ? '#10b981' : 'var(--ember)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                {isQuizCorrect ? '🎉 Correct Mnemonic match!' : '❌ Incorrect. Read the card clue details.'}
              </div>
            )}
          </div>

          {/* Premium bookstore lock paywall */}
          <div className="edu-card-chunky" style={{ textAlign: 'center', background: '#fffbeb', border: '2px solid #fcd34d', borderBottom: '6px solid #fcd34d', padding: '2.5rem' }}>
            <span style={{ fontSize: '2rem' }}>🔓</span>
            <h4 style={{ fontWeight: 'bold', margin: '0.5rem 0', fontSize: '1.3rem' }}>Ready to unlock Vowels & Complex Conversions?</h4>
            <p style={{ color: 'var(--ink-soft)', maxWidth: '32rem', margin: '0 auto 1.5rem auto', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Level 1 Consonant tracing is fully free. Unlock our premium workbook package featuring 170+ association sticker packs and 12-week licensed curriculum routes.
            </p>
            <button 
              type="button" 
              className="edu-btn-ember-3d"
              onClick={() => handleUnlockPurchase('Malmoa Premium Course Digital Access')}
            >
              Unlock Premium Access ($19)
            </button>
          </div>

        </div>
      )}

      {/* ==================== TAB 2: LEVEL 2 (LOCK PAYWALL GUARDS) ==================== */}
      {activeTab === 'level2' && (
        userTier === 'Guest' || userTier === 'Beginner' ? (
          /* Locked Paywall Gate screen */
          <div style={{ animation: 'rise 0.4s ease both', textAlign: 'center', padding: '4rem 1rem' }} className="edu-card-chunky">
            <span style={{ fontSize: '3.5rem' }}>🔒</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', margin: '1rem 0 0.5rem 0' }}>Classroom Locked: Level 2</h2>
            <p style={{ color: 'var(--ink-soft)', maxWidth: '34rem', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
              Level 2 Conversational classroom is reserved for Intermediate and Advanced students. Unlock to practice situational dialogues with Korean TTS speech playback and native tutor coaches.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button type="button" className="edu-btn-3d" onClick={() => handleUnlockPurchase('Intermediate License Course')}>
                Unlock level-2 ($39)
              </button>
              <button type="button" className="edu-btn-secondary-3d" onClick={() => handleUnlockPurchase('1-on-1 Native Coaching (1 Month)')}>
                1:1 Tutor Coaching ($89)
              </button>
            </div>
          </div>
        ) : (
          /* Intermediate Dialogues Classroom */
          <div style={{ animation: 'rise 0.4s ease both', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            
            {/* Left box: topics selection */}
            <div className="edu-card-chunky" style={{ padding: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.25rem' }}>
                Conversation Topics
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {conversations.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setSelectedConv(topic)}
                    style={{
                      textAlign: 'left',
                      padding: '1rem',
                      borderRadius: '16px',
                      border: selectedConv.id === topic.id ? '2px solid var(--teal)' : '2px solid var(--line)',
                      borderBottomWidth: selectedConv.id === topic.id ? '5px' : '5px',
                      background: selectedConv.id === topic.id ? 'color-mix(in srgb, var(--teal) 10%, white)' : 'white',
                      fontWeight: 'bold',
                      color: selectedConv.id === topic.id ? 'var(--teal-deep)' : 'var(--ink)',
                      cursor: 'pointer',
                      transition: 'all 0.1s ease'
                    }}
                  >
                    {topic.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Right box: Chat Bubbles logs */}
            <div className="edu-card-chunky" style={{ padding: '2rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--teal-deep)', fontWeight: 'bold' }}>DIALOGUE CLASS</span>
              <h4 style={{ margin: '0.25rem 0 1.5rem 0', fontWeight: 'bold', fontSize: '1.2rem' }}>{selectedConv.title}</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {selectedConv.dialogue.map((line, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--teal-deep)', background: '#e2f1f1', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                        {line.speaker}
                      </span>
                      <strong style={{ fontSize: '1rem', color: 'var(--ink)' }}>{line.korean}</strong>
                      
                      {/* TTS Voice play triggers for dialogue sentence */}
                      <button 
                        type="button" 
                        onClick={() => speakVoice(line.korean)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.9rem' }}
                        title="Listen Audio"
                      >
                        🔊
                      </button>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', paddingLeft: '0.25rem' }}>
                      {line.english}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )
      )}

      {/* ==================== TAB 3: LEVEL 3 (LOCK PAYWALL GUARDS) ==================== */}
      {activeTab === 'level3' && (
        userTier !== 'Advanced' ? (
          /* Locked Paywall Gate screen */
          <div style={{ animation: 'rise 0.4s ease both', textAlign: 'center', padding: '4rem 1rem' }} className="edu-card-chunky">
            <span style={{ fontSize: '3.5rem' }}>🔒</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', margin: '1rem 0 0.5rem 0' }}>Classroom Locked: Level 3</h2>
            <p style={{ color: 'var(--ink-soft)', maxWidth: '34rem', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
              Level 3 Advanced Hanja root etymology and Korean News editorial read room is exclusive for Advanced tier members. Unlock the complete license course package today.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button type="button" className="edu-btn-3d" onClick={() => handleUnlockPurchase('Advanced License Course')}>
                Unlock level-3 ($39)
              </button>
              <button type="button" className="edu-btn-secondary-3d" onClick={() => handleUnlockPurchase('1-on-1 Native Coaching (1 Month)')}>
                1:1 Tutor Coaching ($89)
              </button>
            </div>
          </div>
        ) : (
          /* Advanced Hanja Bridge Classroom */
          <div style={{ animation: 'rise 0.4s ease both', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            
            {/* Left box: Hanja tree mapping */}
            <div className="edu-card-chunky" style={{ padding: '2rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--teal-deep)', fontWeight: 'bold' }}>ADVANCED HANJA ROOTS</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 'bold', margin: '0.25rem 0 1.25rem 0' }}>
                Hanja Root: 木 (나무 목)
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                The Chinese radical symbol representing a "Tree". In Korean vocabulary, it produces the phonetic sound "목" (mok).
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px solid var(--line)' }}>
                  <strong>목재 (Mok-jae)</strong>
                  <p style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', margin: '0.25rem 0 0 0' }}>Timber / Wood materials</p>
                </div>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px solid var(--line)' }}>
                  <strong>수목 (Su-mok)</strong>
                  <p style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', margin: '0.25rem 0 0 0' }}>Plants and trees / Arboretum</p>
                </div>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px solid var(--line)' }}>
                  <strong>목판 (Mok-pan)</strong>
                  <p style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', margin: '0.25rem 0 0 0' }}>Woodblock print board</p>
                </div>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px solid var(--line)' }}>
                  <strong>벌목 (Beol-mok)</strong>
                  <p style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', margin: '0.25rem 0 0 0' }}>Lumberjacking / Tree felling</p>
                </div>
              </div>
            </div>

            {/* Right box: News Reading Room */}
            <div className="edu-card-chunky" style={{ padding: '2rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--teal-deep)', fontWeight: 'bold' }}>NEWS DECOMPOSITION</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 'bold', margin: '0.25rem 0 1.25rem 0' }}>
                Today\'s Editorial Clause
              </h3>
              
              <div style={{ background: '#fafbfd', border: '1px solid var(--line)', padding: '1.5rem', borderRadius: '20px', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', lineHeight: 1.6, color: 'var(--ink)' }}>
                  "정부는 국유림의 <strong>수목</strong> 보호를 위해 <strong>벌목</strong> 허가 기준을 강화하기로 결정했다."
                </p>
                
                {/* TTS Voice play triggers for News Editorial sentence */}
                <button
                  type="button"
                  className="edu-btn-3d"
                  style={{ marginTop: '1rem', padding: '0.5rem 1.25rem', fontSize: '0.8rem', borderRadius: '10px' }}
                  onClick={() => speakVoice('정부는 국유림의 수목 보호를 위해 벌목 허가 기준을 강화하기로 결정했다.')}
                >
                  🔊 Listen News
                </button>
              </div>

              <h4 style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Word Deconstructions:</h4>
              <ul style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li><strong>수목 (樹木)</strong>: 수 (Tree) + 목 (Tree) = Arboretum forestry</li>
                <li><strong>벌목 (伐木)</strong>: 벌 (Cut down) + 목 (Tree) = Tree felling / Deforestation</li>
              </ul>
            </div>

          </div>
        )
      )}

    </div>
  )
}
