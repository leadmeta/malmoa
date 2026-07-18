import { useState, useEffect, useRef } from 'react'
import { RANK_KEY, SEED_RANKERS, storeProducts, type Ranker, type ProductItem } from '../data/content'
import './InnerPages.css'

type SubTab = 'game' | 'rank' | 'board' | 'store'
type UserTier = 'Beginner' | 'Intermediate' | 'Advanced'

type FallingWord = {
  id: number
  text: string
  translation: string
  x: number
  y: number
}

// Typing words categorized by User Tiers
const TYPING_SETS: Record<UserTier, { text: string; translation: string }[]> = {
  Beginner: [
    { text: 'ㄱ', translation: 'Giyeok' },
    { text: 'ㄴ', translation: 'Nieun' },
    { text: 'ㄷ', translation: 'Digeut' },
    { text: 'ㄹ', translation: 'Rieul' },
    { text: 'ㅏ', translation: 'Ah' },
    { text: 'ㅓ', translation: 'Eo' },
    { text: 'ㅗ', translation: 'Oh' },
    { text: 'ㅜ', translation: 'Woo' }
  ],
  Intermediate: [
    { text: '나무', translation: 'Tree' },
    { text: '조화', translation: 'Harmony' },
    { text: '어조', translation: 'Voice Tone' },
    { text: '보조', translation: 'Pace' },
    { text: '색조', translation: 'Color Hue' },
    { text: '안녕하세요', translation: 'Hello' },
    { text: '고맙습니다', translation: 'Thank you' }
  ],
  Advanced: [
    { text: '한글날을 맞이하여', translation: 'On the occasion of Hangul Day' },
    { text: '친환경 숲 조성', translation: 'Eco-friendly forest creation' },
    { text: '어조 조절이 주목을 받다', translation: 'Tone control receives attention' },
    { text: '문해력 축제가 열렸습니다', translation: 'Literacy festivals were held' }
  ]
}

export function PlayHubPage() {
  const [activeTab, setActiveTab] = useState<SubTab>('game')
  
  // User profile
  const [userProfile, setUserProfile] = useState<{ name: string; xp: number; tier: UserTier }>({
    name: 'Anonymous Student',
    xp: 100,
    tier: 'Beginner'
  })

  // Load User profile & setup defaults
  const reloadUserProfile = () => {
    const saved = localStorage.getItem('malmoa-user-profile')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setUserProfile({
          name: parsed.name || 'Anonymous Student',
          xp: parsed.xp || 100,
          tier: parsed.tier || 'Beginner'
        })
      } catch {
        // Ignore
      }
    } else {
      const defaultProfile = { name: 'Anonymous Student', xp: 100, tier: 'Beginner' as UserTier }
      localStorage.setItem('malmoa-user-profile', JSON.stringify(defaultProfile))
      setUserProfile(defaultProfile)
    }
  }

  useEffect(() => {
    reloadUserProfile()
    // Seed ranking
    if (!localStorage.getItem(RANK_KEY)) {
      localStorage.setItem(RANK_KEY, JSON.stringify(SEED_RANKERS))
    }
  }, [activeTab])

  // --- Sub-Tab 1: Typing Game states & loops ---
  const [gamePlaying, setGamePlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [fallingWords, setFallingWords] = useState<FallingWord[]>([])
  const [typedInput, setTypedInput] = useState('')
  const [gameScore, setGameScore] = useState(0)
  const [gameLives, setGameLives] = useState(3)
  
  const gameLoopRef = useRef<number | null>(null)
  const spawnTimerRef = useRef<number | null>(null)
  const nextWordId = useRef(0)

  const startGame = () => {
    setGamePlaying(true)
    setGameOver(false)
    setFallingWords([])
    setGameScore(0)
    setGameLives(3)
    setTypedInput('')
    nextWordId.current = 0
  }

  // Spawn word loop
  useEffect(() => {
    if (!gamePlaying || gameOver) {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current)
      return
    }

    spawnTimerRef.current = window.setInterval(() => {
      const wordPool = TYPING_SETS[userProfile.tier]
      const chosen = wordPool[Math.floor(Math.random() * wordPool.length)]
      
      const newWord: FallingWord = {
        id: nextWordId.current++,
        text: chosen.text,
        translation: chosen.translation,
        x: 10 + Math.random() * 80,
        y: 0
      }
      setFallingWords((prev) => [...prev, newWord])
    }, 2500)

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current)
    }
  }, [gamePlaying, gameOver, userProfile.tier])

  // Tracing animation loop
  useEffect(() => {
    if (!gamePlaying || gameOver) {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
      return
    }

    const moveDown = () => {
      let lostLife = false

      setFallingWords((prev) => {
        const next = prev.map((w) => ({
          ...w,
          y: w.y + 1.2 // Falling speed
        })).filter((w) => {
          if (w.y >= 380) {
            lostLife = true
            return false
          }
          return true
        })

        if (lostLife) {
          setGameLives((l) => {
            if (l <= 1) {
              setGameOver(true)
              setGamePlaying(false)
              return 0
            }
            return l - 1
          })
        }

        return next
      })

      gameLoopRef.current = requestAnimationFrame(moveDown)
    }

    gameLoopRef.current = requestAnimationFrame(moveDown)

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [gamePlaying, gameOver])

  const submitTypingWord = (e: React.FormEvent) => {
    e.preventDefault()
    if (!gamePlaying || gameOver) return

    const trimmed = typedInput.trim()
    const targetIdx = fallingWords.findIndex((w) => w.text === trimmed)

    if (targetIdx !== -1) {
      setGameScore((s) => s + 10)
      setFallingWords((prev) => prev.filter((_, idx) => idx !== targetIdx))
      setTypedInput('')
    }
  }

  const submitScoreToLeaderboard = () => {
    const updatedProfile = { ...userProfile, xp: userProfile.xp + gameScore }
    localStorage.setItem('malmoa-user-profile', JSON.stringify(updatedProfile))
    setUserProfile(updatedProfile)

    const savedRankings = localStorage.getItem(RANK_KEY)
    let list: Ranker[] = []
    if (savedRankings) {
      try {
        list = JSON.parse(savedRankings)
      } catch {
        list = [...SEED_RANKERS]
      }
    }
    
    const idx = list.findIndex((r) => r.name.toLowerCase() === userProfile.name.toLowerCase())
    if (idx !== -1) {
      list[idx].xp = updatedProfile.xp
    } else {
      list.push({
        name: userProfile.name,
        xp: updatedProfile.xp,
        badge: `${userProfile.tier} Learner 🏆`
      })
    }
    list.sort((a, b) => b.xp - a.xp)
    localStorage.setItem(RANK_KEY, JSON.stringify(list))

    alert(`Successfully submitted +${gameScore} XP to the Leaderboard!`)
    setGameOver(false)
  }

  // Helper to highlight the next key mapping on virtual keyboard
  const getNextCharToType = () => {
    if (fallingWords.length === 0) return ''
    const lowestWord = fallingWords.reduce((lowest, current) => {
      return current.y > lowest.y ? current : lowest
    }, fallingWords[0])

    const typedLen = typedInput.length
    if (typedLen < lowestWord.text.length) {
      return lowestWord.text[typedLen]
    }
    return ''
  }
  const nextChar = getNextCharToType()

  // --- Sub-Tab 2: Rankings Board Logic ---
  const [leaderboard, setLeaderboard] = useState<Ranker[]>([])
  useEffect(() => {
    if (activeTab === 'rank') {
      const saved = localStorage.getItem(RANK_KEY)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setLeaderboard(parsed)
        } catch {
          setLeaderboard(SEED_RANKERS)
        }
      }
    }
  }, [activeTab])

  // --- Sub-Tab 3: Community Board Logic ---
  const [posts, setPosts] = useState<{ id: number; author: string; content: string; date: string }[]>([
    { id: 1, author: 'Sarah Connor', content: 'The visual sticker mnemonic for "ㄱ" looking like a Gun is brilliant! Helped me memorize basic stroke shapes in minutes.', date: '2026-07-16' },
    { id: 2, author: 'Kenji Sato', content: 'Just unlocked the Intermediate Daily Conversation dialogues course. Practice dialogues are extremely realistic!', date: '2026-07-17' }
  ])
  const [newPostText, setNewPostText] = useState('')

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPostText.trim()) return

    const newPost = {
      id: Date.now(),
      author: userProfile.name,
      content: newPostText.trim(),
      date: new Date().toISOString().split('T')[0]
    }
    setPosts([newPost, ...posts])
    setNewPostText('')
  }

  // --- Sub-Tab 4: Shop Purchase Handler ---
  const handleBuyProduct = (product: ProductItem) => {
    if (product.category === 'course') {
      // Direct Upgrade based on course purchased
      let nextTier: UserTier = 'Beginner'
      if (product.id === 'prod-course-intermediate') nextTier = 'Intermediate'
      if (product.id === 'prod-course-advanced') nextTier = 'Advanced'

      const updated = { ...userProfile, tier: nextTier }
      localStorage.setItem('malmoa-user-profile', JSON.stringify(updated))
      setUserProfile(updated)
      alert(`🎉 Course Unlocked! Your student profile is now upgraded to: ${nextTier}`)
    } else if (product.category === 'textbook') {
      // Logistics Order trigger
      const saved = localStorage.getItem('malmoa-orders')
      let orders = []
      if (saved) {
        try {
          orders = JSON.parse(saved)
        } catch {
          // Ignore
        }
      }
      orders.push({
        id: `ord-${Date.now()}`,
        item: product.name,
        buyer: userProfile.name,
        status: 'Processing',
        date: new Date().toISOString().split('T')[0]
      })
      localStorage.setItem('malmoa-orders', JSON.stringify(orders))
      alert(`📦 Textbook Order Placed! Our admin team has been notified. You can track shipping inside the Admin page.`)
    } else if (product.category === 'coaching') {
      // Teacher match queue trigger
      const saved = localStorage.getItem('malmoa-coaching-orders')
      let coachingOrders = []
      if (saved) {
        try {
          coachingOrders = JSON.parse(saved)
        } catch {
          // Ignore
        }
      }
      coachingOrders.push({
        id: `coach-${Date.now()}`,
        student: userProfile.name,
        teacherId: 'unassigned',
        status: 'Matching Teacher',
        date: new Date().toISOString().split('T')[0]
      })
      localStorage.setItem('malmoa-coaching-orders', JSON.stringify(coachingOrders))
      alert(`👩‍🏫 Coaching Session Requested! Admin is matching a certified native Korean tutor for you. Track matching on the Admin panel.`)
    }
  }

  return (
    <div className="shell page-hero reveal" style={{ paddingBottom: '4rem' }}>
      <p className="section-label">Hangul Play Portal</p>
      <h1>Gaming & Social Hub</h1>
      <p style={{ maxWidth: '40rem', color: 'var(--ink-soft)' }}>
        Learn, compete, chat, and shop. Test your typing speed in the Raindrop Game, track global ranks, talk with peers, and unlock textbooks.
      </p>

      {/* Profile summary bar */}
      <div style={{ background: 'white', border: '1px solid var(--line)', padding: '1rem 1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', margin: '2rem 0', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
        <div>
          Student Avatar: <strong>{userProfile.name}</strong>
        </div>
        <div>
          XP Level: <strong style={{ color: 'var(--teal)' }}>{userProfile.xp} XP</strong>
        </div>
        <div>
          Account License: <span style={{ background: 'color-mix(in srgb, var(--teal) 10%, white)', color: 'var(--teal-deep)', fontWeight: 'bold', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.85rem' }}>{userProfile.tier} Tier</span>
        </div>
      </div>

      {/* Sub tabs selector */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--line)', paddingBottom: '1px', overflowX: 'auto' }}>
        {(['game', 'rank', 'board', 'store'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.6rem 1.25rem',
              background: activeTab === tab ? 'white' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '3px solid var(--teal)' : '3px solid transparent',
              color: activeTab === tab ? 'var(--teal-deep)' : 'var(--ink-soft)',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontSize: '0.9rem'
            }}
          >
            {tab === 'game' && '🎮 Keyboard Game'}
            {tab === 'rank' && '🏆 Rankings'}
            {tab === 'board' && '💬 Student Forum'}
            {tab === 'store' && '🛒 Bookstore'}
          </button>
        ))}
      </div>

      {/* --- SUB-TAB 1: TYPING GAME --- */}
      {activeTab === 'game' && (
        <div style={{ animation: 'rise 0.4s ease both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.35rem' }}>
              Raindrop Typer (Level: <span style={{ color: 'var(--teal)' }}>{userProfile.tier}</span>)
            </h3>
            <div>
              Hearts: <span style={{ color: 'var(--ember)', fontSize: '1.15rem' }}>{'❤️'.repeat(gameLives) || '💀'}</span>
            </div>
            <strong style={{ fontSize: '1.15rem', color: 'var(--teal-deep)' }}>+{gameScore} XP</strong>
          </div>

          {/* Game Canvas Arena */}
          <div className="game-arena">
            {!gamePlaying && !gameOver && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(26, 35, 50, 0.96)', color: 'white', gap: '1rem', padding: '1.5rem', textAlign: 'center' }}>
                <span style={{ fontSize: '3rem' }}>🎮</span>
                <h3 style={{ color: 'white', margin: 0 }}>Play Level: {userProfile.tier}</h3>
                <p style={{ color: '#a0aab8', fontSize: '0.85rem', maxWidth: '300px', margin: 0 }}>
                  Words drop from the top. Correct typing destroys them. 
                  (Unlock higher Tiers at the Bookstore to play words/news!)
                </p>
                <button type="button" className="btn btn-ember btn-pulse" style={{ padding: '0.6rem 2rem', marginTop: '0.5rem' }} onClick={startGame}>
                  Start Typer Game
                </button>
              </div>
            )}

            {gamePlaying && fallingWords.map((w) => (
              <div
                key={w.id}
                className="falling-word"
                style={{
                  left: `${w.x}%`,
                  top: `${w.y}px`
                }}
              >
                {w.text}
                <span style={{ display: 'block', fontSize: '0.7rem', opacity: 0.8, fontWeight: 'normal', textAlign: 'center' }}>
                  {w.translation}
                </span>
              </div>
            ))}

            {gameOver && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(26, 35, 50, 0.98)', color: 'white', gap: '1rem', padding: '1.5rem', textAlign: 'center' }}>
                <span style={{ fontSize: '3rem' }}>☠️</span>
                <h3 style={{ color: 'white', margin: 0 }}>Game Over</h3>
                <p style={{ color: '#a0aab8', margin: 0 }}>You scored: +{gameScore} XP</p>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <button type="button" className="btn btn-primary" onClick={submitScoreToLeaderboard}>
                    Submit XP Score
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={startGame}>
                    Play Again
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Typing Form Controls */}
          {gamePlaying && (
            <form onSubmit={submitTypingWord} className="game-input-container">
              <input
                type="text"
                className="game-input"
                placeholder="Type spelling here..."
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                autoFocus
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>
                Submit
              </button>
            </form>
          )}

          {/* On-Screen Virtual Keyboard Guide */}
          <div className="virtual-keyboard">
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.78rem', color: 'var(--ink-soft)', textAlign: 'center', fontWeight: 'bold' }}>
              ⌨️ VIRTUAL KEYBOARD LAYOUT (NEXT KEY FLICKERS IN ORANGE)
            </p>
            <div className="keyboard-row">
              {['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'].map((k) => (
                <div key={k} className={`keyboard-key ${nextChar === k ? 'highlight-next' : ''}`}>{k}</div>
              ))}
            </div>
            <div className="keyboard-row">
              {['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'].map((k) => (
                <div key={k} className={`keyboard-key ${nextChar === k ? 'highlight-next' : ''}`}>{k}</div>
              ))}
            </div>
            <div className="keyboard-row">
              {['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ'].map((k) => (
                <div key={k} className={`keyboard-key ${nextChar === k ? 'highlight-next' : ''}`}>{k}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- SUB-TAB 2: RANKINGS --- */}
      {activeTab === 'rank' && (
        <div style={{ animation: 'rise 0.4s ease both' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '1.5rem' }}>🏆 Global XP Rankings</h3>
          <table className="rank-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Rank</th>
                <th>Learner</th>
                <th>Points (XP)</th>
                <th>Achievement Title</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((item, idx) => (
                <tr
                  key={item.name}
                  style={{
                    background: item.name.toLowerCase() === userProfile.name.toLowerCase() ? 'color-mix(in srgb, var(--teal) 8%, transparent)' : 'transparent',
                    fontWeight: item.name.toLowerCase() === userProfile.name.toLowerCase() ? 'bold' : 'normal'
                  }}
                >
                  <td><strong>{idx + 1}</strong></td>
                  <td>{item.name}</td>
                  <td style={{ color: 'var(--teal-deep)', fontWeight: 'bold' }}>{item.xp} XP</td>
                  <td>{item.badge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- SUB-TAB 3: STUDENT FORUM --- */}
      {activeTab === 'board' && (
        <div style={{ animation: 'rise 0.4s ease both' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '1.5rem' }}>💬 Peer Discussion Forum</h3>
          
          <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem', background: 'white', padding: '1.5rem', border: '1px solid var(--line)', borderRadius: '20px' }}>
            <h4 style={{ margin: 0, fontWeight: 'bold' }}>Post a thought:</h4>
            <textarea
              placeholder="What are your thoughts on Mnemonic stickers or 한글 stroke drawing sheets?"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              style={{ width: '100%', minHeight: '80px', padding: '0.75rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)', resize: 'vertical' }}
            />
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '0.5rem 1.5rem' }}>
              Publish Post
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {posts.map((post) => (
              <div key={post.id} style={{ background: 'white', border: '1px solid var(--line)', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong>{post.author}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>{post.date}</span>
                </div>
                <p style={{ margin: 0, color: 'var(--ink)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                  {post.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SUB-TAB 4: BOOKSTORE --- */}
      {activeTab === 'store' && (
        <div style={{ animation: 'rise 0.4s ease both' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '1.5rem' }}>🛒 Store Catalog (Books, Coaching & Course Unlocks)</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {storeProducts.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: 'white',
                  border: '1px solid var(--line)',
                  borderRadius: '24px',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.01)',
                  transition: 'all 0.2s ease'
                }}
                className="board-post-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <span style={{ fontSize: '0.78rem', background: 'var(--paper-cool)', color: 'var(--ink-soft)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '1.35rem', fontWeight: 'bold', color: 'var(--teal-deep)' }}>
                    ${prod.price}
                  </span>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.35rem 0', fontWeight: 'bold', fontSize: '1.05rem', lineHeight: 1.35 }}>{prod.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{prod.description}</p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-pulse"
                  style={{ marginTop: 'auto', padding: '0.5rem 1rem', fontSize: '0.88rem' }}
                  onClick={() => handleBuyProduct(prod)}
                >
                  Buy Now ➔
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
