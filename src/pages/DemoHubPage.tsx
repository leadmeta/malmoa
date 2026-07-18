import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
    name: '디귿 (Digeut)',
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

// 4 Groups of Consonants
const CONSONANT_GROUPS = [
  { id: 'group-a', name: 'Group 1: ㄱ, ㄴ, ㄷ, ㄹ', list: FULL_CONSONANTS.slice(0, 4) },
  { id: 'group-b', name: 'Group 2: ㅁ, ㅂ, ㅅ, ㅇ', list: FULL_CONSONANTS.slice(4, 8) },
  { id: 'group-c', name: 'Group 3: ㅈ, ㅊ, ㅋ, ㅌ', list: FULL_CONSONANTS.slice(8, 12) },
  { id: 'group-d', name: 'Group 4: ㅍ, ㅎ', list: FULL_CONSONANTS.slice(12, 14) }
]

type ClassTab = 'level1' | 'level2' | 'level3'
type WizardStep = 'read' | 'listen' | 'trace' | 'review'

export function DemoHubPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<ClassTab>('level1')
  
  // User auth profile licensing
  const [userTier, setUserTier] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Guest'>('Guest')
  
  // Group state
  const [activeGroupIndex, setActiveGroupIndex] = useState<number>(0)
  const currentGroup = CONSONANT_GROUPS[activeGroupIndex]

  // Tracing selected consonant
  const [selectedJamo, setSelectedJamo] = useState<JamoDetail>(currentGroup.list[0])

  // Wizard flow states
  const [wizardStep, setWizardStep] = useState<WizardStep>('read')
  const [hasListened, setHasListened] = useState(false)
  const [tracingScore, setTracingScore] = useState<'None' | 'Bad' | 'Good' | 'Excellent'>('None')
  const [quizAnswered, setQuizAnswered] = useState(false)
  const [isQuizCorrect, setIsQuizCorrect] = useState(false)

  // Canvas drawing properties
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawPointCount, setDrawPointCount] = useState(0)

  // Level 2 dialogue state
  const [selectedConv, setSelectedConv] = useState<ConversationTopic>(conversations[0])

  // Synchronize tier and consonant default index
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

  // Auto update selected jamo when switching consonant groups
  const handleSelectGroup = (idx: number) => {
    setActiveGroupIndex(idx)
    setSelectedJamo(CONSONANT_GROUPS[idx].list[0])
    setWizardStep('read')
    setHasListened(false)
    setTracingScore('None')
    setQuizAnswered(false)
  }

  // Web Speech API Pronunciation voice synthesizer
  const speakVoice = (textToSpeak: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.')
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.lang = 'ko-KR'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
    setHasListened(true)
  }

  // Guide canvas reload
  useEffect(() => {
    if (activeTab !== 'level1' || wizardStep !== 'trace' || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setDrawPointCount(0)
    setTracingScore('None')

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
  }, [selectedJamo, activeTab, wizardStep])

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
    setDrawPointCount((c) => c + 1)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    
    // Evaluate Drawing Quality Score based on pixel counts
    if (drawPointCount > 0) {
      if (drawPointCount < 10) {
        setTracingScore('Bad')
      } else if (drawPointCount >= 10 && drawPointCount < 80) {
        setTracingScore('Good')
      } else {
        setTracingScore('Excellent')
      }
    }
  }

  const clearCanvas = () => {
    setDrawPointCount(0)
    setTracingScore('None')
    // Reset guide outline
    setSelectedJamo({ ...selectedJamo })
  }

  // Answer Quiz
  const handleQuizAnswer = (isCorrect: boolean) => {
    setIsQuizCorrect(isCorrect)
    setQuizAnswered(true)
  }

  // Navigation to Consultation and pricing
  const navigateToPricing = () => {
    navigate('/waitlist')
  }

  return (
    <div className="shell reveal" style={{ paddingBottom: '4rem', marginTop: '1.5rem' }}>
      
      {/* 1. Classroom level tabs selector */}
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

      {/* ==================== TAB 1: LEVEL 1 (GRADUAL 4-STEP WIZARD) ==================== */}
      {activeTab === 'level1' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          
          {/* A. Grouping Selector (몇개씩 묶어서 보여주기) */}
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {CONSONANT_GROUPS.map((grp, idx) => (
              <button
                key={grp.id}
                type="button"
                onClick={() => handleSelectGroup(idx)}
                style={{
                  padding: '0.6rem 1.25rem',
                  fontSize: '0.88rem',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  border: activeGroupIndex === idx ? '2px solid var(--teal)' : '2px solid var(--line)',
                  background: activeGroupIndex === idx ? 'var(--teal-deep)' : 'white',
                  color: activeGroupIndex === idx ? 'white' : 'var(--ink)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {grp.name}
              </button>
            ))}
          </div>

          {/* B. Specific Consonant Sub-Selector within Group */}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', margin: '0.5rem 0' }}>
            {currentGroup.list.map((jamo) => (
              <button
                key={jamo.char}
                type="button"
                onClick={() => {
                  setSelectedJamo(jamo)
                  setWizardStep('read')
                  setHasListened(false)
                  setTracingScore('None')
                  setQuizAnswered(false)
                }}
                style={{
                  width: '48px',
                  height: '48px',
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                  border: selectedJamo.char === jamo.char ? '2px solid var(--teal)' : '1px solid var(--line)',
                  background: selectedJamo.char === jamo.char ? 'color-mix(in srgb, var(--teal) 15%, white)' : 'white',
                  color: selectedJamo.char === jamo.char ? 'var(--teal-deep)' : 'var(--ink-soft)',
                  cursor: 'pointer'
                }}
              >
                {jamo.char}
              </button>
            ))}
          </div>

          {/* C. 4-Step Progress Indicator Gauge */}
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px solid var(--line)', maxWidth: '640px', margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 'bold', color: 'var(--ink-soft)', marginBottom: '0.5rem' }}>
              <span>WIZARD FLOW: {selectedJamo.char} ({selectedJamo.name})</span>
              <span>
                {wizardStep === 'read' && 'Step 1 of 4: READ'}
                {wizardStep === 'listen' && 'Step 2 of 4: LISTEN'}
                {wizardStep === 'trace' && 'Step 3 of 4: WRITE'}
                {wizardStep === 'review' && 'Step 4 of 4: REVIEW'}
              </span>
            </div>
            <div style={{ height: '6px', background: 'var(--line)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                background: 'var(--teal)',
                width: wizardStep === 'read' ? '25%' : wizardStep === 'listen' ? '50%' : wizardStep === 'trace' ? '75%' : '100%',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {/* D. Step-by-step Interactive Panels */}
          <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>

            {/* STEP 1: READ (보고) */}
            {wizardStep === 'read' && (
              <div className="edu-card-chunky" style={{ padding: '2.5rem', textAlign: 'center', animation: 'rise 0.3s ease both' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--teal-deep)', fontWeight: 'bold', textTransform: 'uppercase' }}>STEP 1: SEE & ASSOCIATE</span>
                <div style={{ fontSize: '5rem', margin: '1rem 0', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>{selectedJamo.char}</div>
                <h3 style={{ fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '0.75rem' }}>{selectedJamo.name}</h3>
                
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.25rem', borderRadius: '16px', margin: '1.5rem 0', textAlign: 'left' }}>
                  <strong>Mnemonic Association Story:</strong>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.92rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                    {selectedJamo.story}
                  </p>
                </div>

                <button
                  type="button"
                  className="edu-btn-3d"
                  style={{ width: '100%', padding: '0.8rem' }}
                  onClick={() => setWizardStep('listen')}
                >
                  Continue to Listen →
                </button>
              </div>
            )}

            {/* STEP 2: LISTEN (듣고) */}
            {wizardStep === 'listen' && (
              <div className="edu-card-chunky" style={{ padding: '2.5rem', textAlign: 'center', animation: 'rise 0.3s ease both' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--teal-deep)', fontWeight: 'bold', textTransform: 'uppercase' }}>STEP 2: LISTEN & REPEAT</span>
                <div style={{ fontSize: '4rem', margin: '1rem 0' }}>🔊</div>
                <h3 style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Listen to the Native Sound</h3>
                <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                  Click the button below to trigger the Speech Synthesizer. Listen carefully and repeat out loud!
                </p>

                <button
                  type="button"
                  className="edu-btn-secondary-3d"
                  style={{ width: '100%', padding: '0.9rem', marginBottom: '1.5rem', fontSize: '1rem' }}
                  onClick={() => speakVoice(selectedJamo.char)}
                >
                  🔊 Play Korean Pronunciation
                </button>

                <button
                  type="button"
                  className="edu-btn-3d"
                  style={{ width: '100%', padding: '0.8rem' }}
                  disabled={!hasListened}
                  onClick={() => setWizardStep('trace')}
                >
                  {hasListened ? 'Continue to Tracing →' : 'Please play sound first'}
                </button>
              </div>
            )}

            {/* STEP 3: TRACE (쓰고 & 채점 판정 피드백) */}
            {wizardStep === 'trace' && (
              <div className="edu-card-chunky" style={{ padding: '2rem', textAlign: 'center', animation: 'rise 0.3s ease both' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--teal-deep)', fontWeight: 'bold', textTransform: 'uppercase' }}>STEP 3: TRACE ON BOARD</span>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.75rem 0 1rem 0' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>Follow the guideline vector paths.</span>
                  <button type="button" className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.78rem' }} onClick={clearCanvas}>
                    Reset Guide
                  </button>
                </div>

                <canvas
                  ref={canvasRef}
                  width={280}
                  height={280}
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

                {/* 실시간 Tracing 채점 피드백 출력 */}
                {tracingScore !== 'None' && (
                  <div style={{
                    marginTop: '1.25rem',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '0.92rem',
                    background: tracingScore === 'Excellent' ? '#ecfdf5' : tracingScore === 'Good' ? '#eff6ff' : '#fff5f5',
                    border: tracingScore === 'Excellent' ? '1px solid #10b981' : tracingScore === 'Good' ? '1px solid #3b82f6' : '1px solid var(--ember)',
                    color: tracingScore === 'Excellent' ? '#10b981' : tracingScore === 'Good' ? '#2563eb' : 'var(--ember)'
                  }}>
                    {tracingScore === 'Excellent' && '🏆 Excellent! Stroke coverage is perfect. Mastered.'}
                    {tracingScore === 'Good' && '👍 Good! Nicely written. Keep practicing.'}
                    {tracingScore === 'Bad' && '😢 Bad - Stroke is too short. Reset the guide and write it again!'}
                  </div>
                )}

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                  {tracingScore === 'Bad' && (
                    <button type="button" className="edu-btn-secondary-3d" style={{ flex: 1, padding: '0.75rem' }} onClick={clearCanvas}>
                      🔄 Try Again
                    </button>
                  )}
                  <button
                    type="button"
                    className="edu-btn-3d"
                    style={{ flex: 2, padding: '0.75rem' }}
                    disabled={tracingScore === 'None' || tracingScore === 'Bad'}
                    onClick={() => setWizardStep('review')}
                  >
                    {tracingScore === 'None' ? 'Trace letter first' : tracingScore === 'Bad' ? 'Score must be Good to continue' : 'Continue to Review →'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW (복습/칠판 퀴즈) */}
            {wizardStep === 'review' && (
              <div className="edu-chalkboard" style={{ animation: 'rise 0.3s ease both' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--teal)', textTransform: 'uppercase' }}>STEP 4: MEMORY RETENTION</span>
                <h3 style={{ color: 'white', margin: '0.5rem 0 1.5rem 0', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
                  Review Mnemonic: Which visual cue represents "{selectedJamo.char}"?
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                  <button 
                    type="button" 
                    className="edu-chalkboard-option"
                    onClick={() => handleQuizAnswer(true)}
                  >
                    {selectedJamo.char === 'ㄱ' ? '🔫 Hand Gun pointing left' : selectedJamo.char === 'ㄴ' ? '👃 Profile Nose template' : selectedJamo.char === 'ㄷ' ? 'Door frame structural lines' : selectedJamo.story.split('.')[0]}
                  </button>
                  <button 
                    type="button" 
                    className="edu-chalkboard-option"
                    onClick={() => handleQuizAnswer(false)}
                  >
                    🐍 Crawling snake layout
                  </button>
                </div>

                {quizAnswered && (
                  <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    borderRadius: '12px',
                    background: isQuizCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(196,92,38,0.15)',
                    color: isQuizCorrect ? '#10b981' : 'var(--ember)',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    {isQuizCorrect ? '🏆 Correct Mnemonic! Step completed.' : '❌ Incorrect. Read the mnemonic details and try again.'}
                  </div>
                )}

                {quizAnswered && isQuizCorrect && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <button
                      type="button"
                      className="edu-btn-3d"
                      style={{ width: '100%', padding: '0.8rem' }}
                      onClick={() => {
                        // Advance to next letter if exists in group
                        const currentIdx = currentGroup.list.findIndex(j => j.char === selectedJamo.char)
                        if (currentIdx < currentGroup.list.length - 1) {
                          setSelectedJamo(currentGroup.list[currentIdx + 1])
                          setWizardStep('read')
                          setHasListened(false)
                          setTracingScore('None')
                          setQuizAnswered(false)
                        } else {
                          alert('🎉 Group completed! Select another consonant group above to study.')
                        }
                      }}
                    >
                      Next Consonant →
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Upgrade gate redirects to pricing consultation */}
          <div className="edu-card-chunky" style={{ textAlign: 'center', background: '#fffbeb', border: '2px solid #fcd34d', borderBottom: '6px solid #fcd34d', padding: '2.5rem', marginTop: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>🔒</span>
            <h4 style={{ fontWeight: 'bold', margin: '0.5rem 0', fontSize: '1.3rem' }}>Wants to unlock Vowels, spelling structures & dialogue classes?</h4>
            <p style={{ color: 'var(--ink-soft)', maxWidth: '32rem', margin: '0 auto 1.5rem auto', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Check our Standard and Premium consultation plans. Physical study kits will be shipped straight to your doorstep.
            </p>
            <button 
              type="button" 
              className="edu-btn-ember-3d"
              onClick={navigateToPricing}
            >
              See Pricing Options & Book Consultation
            </button>
          </div>

        </div>
      )}

      {/* ==================== TAB 2: LEVEL 2 (LOCK PAYWALL GATES REDIRECT) ==================== */}
      {activeTab === 'level2' && (
        userTier === 'Guest' || userTier === 'Beginner' ? (
          <div style={{ animation: 'rise 0.4s ease both', textAlign: 'center', padding: '4rem 1rem' }} className="edu-card-chunky">
            <span style={{ fontSize: '3.5rem' }}>🔒</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', margin: '1rem 0 0.5rem 0' }}>Classroom Locked: Level 2</h2>
            <p style={{ color: 'var(--ink-soft)', maxWidth: '34rem', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
              Level 2 Dialogue classroom requires standard/premium membership access. Check out the available plans and book a custom consultation zoom call now.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button type="button" className="edu-btn-3d" onClick={navigateToPricing}>
                View standard pricing table
              </button>
              <button type="button" className="edu-btn-secondary-3d" onClick={navigateToPricing}>
                Book a Free Consultation
              </button>
            </div>
          </div>
        ) : (
          /* Dialogues Classroom */
          <div style={{ animation: 'rise 0.4s ease both', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            
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

      {/* ==================== TAB 3: LEVEL 3 (LOCK PAYWALL GATES REDIRECT) ==================== */}
      {activeTab === 'level3' && (
        userTier !== 'Advanced' ? (
          <div style={{ animation: 'rise 0.4s ease both', textAlign: 'center', padding: '4rem 1rem' }} className="edu-card-chunky">
            <span style={{ fontSize: '3.5rem' }}>🔒</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', margin: '1rem 0 0.5rem 0' }}>Classroom Locked: Level 3</h2>
            <p style={{ color: 'var(--ink-soft)', maxWidth: '34rem', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
              Level 3 Advanced Hanja root etymology and Korean News editorial read room is exclusive for Advanced tier members. Select our Coaching Plan for instant unlock.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button type="button" className="edu-btn-3d" onClick={navigateToPricing}>
                View pricing options
              </button>
              <button type="button" className="edu-btn-secondary-3d" onClick={navigateToPricing}>
                Book a Free Consultation
              </button>
            </div>
          </div>
        ) : (
          /* Advanced Hanja Bridge Classroom */
          <div style={{ animation: 'rise 0.4s ease both', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            
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

            <div className="edu-card-chunky" style={{ padding: '2rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--teal-deep)', fontWeight: 'bold' }}>NEWS DECOMPOSITION</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 'bold', margin: '0.25rem 0 1.25rem 0' }}>
                Today\'s Editorial Clause
              </h3>
              
              <div style={{ background: '#fafbfd', border: '1px solid var(--line)', padding: '1.5rem', borderRadius: '20px', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', lineHeight: 1.6, color: 'var(--ink)' }}>
                  "정부는 국유림의 <strong>수목</strong> 보호를 위해 <strong>벌목</strong> 허가 기준을 강화하기로 결정했다."
                </p>
                
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
