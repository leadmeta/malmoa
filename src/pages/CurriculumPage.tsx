import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jamoList, conversations, type JamoDetail, type ConversationTopic } from '../data/content'
import './InnerPages.css'

type Tab = 'method' | 'beginner' | 'intermediate' | 'advanced'

export function CurriculumPage() {
  const [activeTab, setActiveTab] = useState<Tab>('method')
  
  // Beginner Drawing Canvas states
  const [selectedJamo, setSelectedJamo] = useState<JamoDetail>(jamoList[0])
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  // Intermediate Conversation states
  const [selectedConv, setSelectedConv] = useState<ConversationTopic>(conversations[0])

  // Canvas drawing loop
  useEffect(() => {
    if (activeTab !== 'beginner' || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background guide grid
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    
    // Horizontal center line
    ctx.beginPath()
    ctx.moveTo(0, canvas.height / 2)
    ctx.lineTo(canvas.width, canvas.height / 2)
    ctx.stroke()
    
    // Vertical center line
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2, 0)
    ctx.lineTo(canvas.width / 2, canvas.height)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw Tracing Guides (Semi-transparent background font guide)
    ctx.fillStyle = 'rgba(13,115,119,0.06)'
    ctx.font = 'bold 160px Inter, system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(selectedJamo.char, canvas.width / 2, canvas.height / 2)

    // Draw Guide Path Arrows
    ctx.strokeStyle = 'rgba(196,92,38,0.4)'
    ctx.lineWidth = 6
    ctx.lineCap = 'round'

    selectedJamo.paths.forEach((path) => {
      if (path.length < 2) return
      ctx.beginPath()
      
      // Convert percentage coordinates to canvas pixels
      const startX = (path[0].x / 100) * canvas.width
      const startY = (path[0].y / 100) * canvas.height
      ctx.moveTo(startX, startY)

      for (let i = 1; i < path.length; i++) {
        const nextX = (path[i].x / 100) * canvas.width
        const nextY = (path[i].y / 100) * canvas.height
        ctx.lineTo(nextX, nextY)
      }
      ctx.stroke()

      // Draw start dot indicator
      ctx.fillStyle = '#c45c26'
      ctx.beginPath()
      ctx.arc(startX, startY, 7, 0, Math.PI * 2)
      ctx.fill()
    })

  }, [selectedJamo, activeTab])

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
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Re-trigger layout render
    setSelectedJamo({ ...selectedJamo })
  }

  return (
    <div className="shell reveal" style={{ paddingBottom: '4rem', marginTop: '1.5rem' }}>
      {/* Tabs Selector: Positioned immediately below header navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--line)', paddingBottom: '1px', marginBottom: '2.5rem', overflowX: 'auto' }}>
        {(['method', 'beginner', 'intermediate', 'advanced'] as const).map((tab) => (
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
            {tab === 'method' && '💡 Methodology'}
            {tab === 'beginner' && '👶 Level 1: Beginner'}
            {tab === 'intermediate' && '💬 Level 2: Intermediate'}
            {tab === 'advanced' && '📚 Level 3: Advanced'}
          </button>
        ))}
      </div>

      {/* 1. Methodology Tab */}
      {activeTab === 'method' && (
        <div style={{ animation: 'rise 0.4s ease both' }} className="methodology-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div style={{ background: 'white', padding: '2rem', border: '1px solid var(--line)', borderRadius: '24px' }}>
              <span style={{ fontSize: '2.5rem' }}>🧠</span>
              <h3 style={{ fontFamily: 'var(--font-display)', margin: '1rem 0 0.5rem 0', fontWeight: 'bold' }}>Visual Mnemonics</h3>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                We translate hard-to-remember shapes into familiar icons. For example, "ㄱ" looks like a "Gun" and "ㄴ" looks like a "Nose". Your brain maps abstract symbols instantly.
              </p>
            </div>
            <div style={{ background: 'white', padding: '2rem', border: '1px solid var(--line)', borderRadius: '24px' }}>
              <span style={{ fontSize: '2.5rem' }}>🔗</span>
              <h3 style={{ fontFamily: 'var(--font-display)', margin: '1rem 0 0.5rem 0', fontWeight: 'bold' }}>Active Recall Tracing</h3>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                Instead of mindless repetitive copying, our interactive tracing canvas highlights drawing anchors, reinforcing muscle memory along with pronunciation.
              </p>
            </div>
            <div style={{ background: 'white', padding: '2rem', border: '1px solid var(--line)', borderRadius: '24px' }}>
              <span style={{ fontSize: '2.5rem' }}>📈</span>
              <h3 style={{ fontFamily: 'var(--font-display)', margin: '1rem 0 0.5rem 0', fontWeight: 'bold' }}>Vocabulary Networks</h3>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                Learn words by breaking them down into root components (Hanja). A single root unlocks hundreds of derived words naturally, preventing quick forgetfulness.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Beginner Tab: Hangul Writing Board */}
      {activeTab === 'beginner' && (
        <div style={{ animation: 'rise 0.4s ease both' }}>
          <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>
            ✏️ Hangul stroke Order Tracing Board
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 0.4fr) 1fr', gap: '2rem' }}>
            {/* Left selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {jamoList.map((jamo) => (
                <button
                  key={jamo.char}
                  type="button"
                  onClick={() => setSelectedJamo(jamo)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 1.25rem',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--radius)',
                    background: selectedJamo.char === jamo.char ? 'color-mix(in srgb, var(--teal) 8%, white)' : 'white',
                    borderColor: selectedJamo.char === jamo.char ? 'var(--teal)' : 'var(--line)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  className="board-post-card"
                >
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{jamo.char}</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold' }}>{jamo.name}</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--ink-soft)' }}>Sound: /{jamo.sound}/</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Right Tracing Canvas Box */}
            <div className="stroke-canvas-container">
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontWeight: 'bold' }}>Character: {selectedJamo.char} ({selectedJamo.name})</h4>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: 'var(--ink-soft)' }}>
                    {selectedJamo.writeGuide}
                  </p>
                </div>
                <button type="button" className="btn btn-secondary" style={{ padding: '0.4rem 1.2rem', fontSize: '0.85rem' }} onClick={clearCanvas}>
                  🧹 Clear Board
                </button>
              </div>

              <canvas
                ref={canvasRef}
                width={260}
                height={260}
                className="stroke-canvas"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
                💡 Tip: Start drawing from the orange circle indicators following the paths.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Intermediate Tab: Dialogue cards */}
      {activeTab === 'intermediate' && (
        <div style={{ animation: 'rise 0.4s ease both' }}>
          <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>
            💬 Situational Dialogues
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 0.35fr) 1fr', gap: '2rem' }}>
            {/* Left list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedConv(c)}
                  style={{
                    padding: '1.25rem',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                    background: selectedConv.id === c.id ? 'white' : 'transparent',
                    borderColor: selectedConv.id === c.id ? 'var(--teal)' : 'var(--line)',
                    transition: 'all 0.2s ease',
                  }}
                  className="board-post-card"
                >
                  <span style={{ fontSize: '0.75rem', background: 'var(--paper-cool)', color: 'var(--ink-soft)', padding: '0.15rem 0.5rem', borderRadius: '4px', display: 'inline-block', marginBottom: '0.5rem' }}>
                    {c.category}
                  </span>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>{c.title}</strong>
                </div>
              ))}
            </div>

            {/* Right Chat Viewer */}
            <div style={{ background: 'white', border: '1px solid var(--line)', padding: '2rem', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
              <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>{selectedConv.title}</h4>
              <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>{selectedConv.description}</p>

              {/* Chat Thread */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {selectedConv.dialogue.map((line, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', padding: '0.85rem 1.25rem', background: idx % 2 === 0 ? 'var(--paper-cool)' : 'color-mix(in srgb, var(--teal) 5%, white)', borderRadius: '16px', border: '1px solid var(--line)' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--teal-deep)', marginBottom: '0.25rem' }}>
                      {line.speaker}
                    </span>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--ink)' }}>{line.korean}</strong>
                    <span style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', fontStyle: 'italic', marginTop: '0.15rem' }}>{line.english}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Advanced Tab: Hanja Bridge */}
      {activeTab === 'advanced' && (
        <div style={{ animation: 'rise 0.4s ease both', maxWidth: '44rem', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem' }}>🎓</span>
          <h2 style={{ fontFamily: 'var(--font-display)', margin: '1rem 0 0.75rem 0' }}>Advanced Mnemonic & Hanja Fusion</h2>
          <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            At the advanced level, we merge word semantics with pictorial Chinese roots. Learners study authentic Korean news articles and resolve complex root networks.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', textAlign: 'left' }}>
            <div style={{ background: 'white', padding: '1.5rem', border: '1px solid var(--line)', borderRadius: '20px' }} className="board-post-card">
              <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: 'var(--teal-deep)' }}>📰 Interactive News Reader</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', margin: '0 0 1rem 0' }}>
                Read cultural and public articles, tap complex root words to read mnemonics, and solve quizzes.
              </p>
              <Link to="/news" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', display: 'inline-block' }}>
                Open News Bridge ➔
              </Link>
            </div>
            <div style={{ background: 'white', padding: '1.5rem', border: '1px solid var(--line)', borderRadius: '20px' }} className="board-post-card">
              <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: 'var(--teal-deep)' }}>✨ Hanja Core Demo</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', margin: '0 0 1rem 0' }}>
                Watch root characters like "木" and "調" expand into networks of 어조, 보조, 색조.
              </p>
              <Link to="/lesson/hanja-demo" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', display: 'inline-block' }}>
                Open Hanja Demo ➔
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
