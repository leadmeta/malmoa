import { useState, useEffect, useRef } from 'react'
import { RANK_KEY, SEED_RANKERS, type Ranker } from '../data/content'
import './InnerPages.css'

type SubTab = 'game' | 'rank' | 'board'
type UserTier = 'Beginner' | 'Intermediate' | 'Advanced'
type ForumCategory = 'classroom' | 'knews' | 'culture'

type FallingWord = {
  id: number
  text: string
  translation: string
  x: number
  y: number
  matched?: boolean
}

type ForumPost = {
  id: number
  author: string
  category: ForumCategory
  content: string
  date: string
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

const KEY_MAP: Record<string, string> = {
  'ㅂ': 'Q', 'ㅈ': 'W', 'ㄷ': 'E', 'ㄱ': 'R', 'ㅅ': 'T', 'ㅛ': 'Y', 'ㅕ': 'U', 'ㅑ': 'I', 'ㅐ': 'O', 'ㅔ': 'P',
  'ㅁ': 'A', 'ㄴ': 'S', 'ㅇ': 'D', 'ㄹ': 'F', 'ㅎ': 'G', 'ㅗ': 'H', 'ㅓ': 'J', 'ㅏ': 'K', 'ㅣ': 'L',
  'ㅋ': 'Z', 'ㅌ': 'X', 'ㅊ': 'C', 'ㅍ': 'V', 'ㅠ': 'B', 'ㅜ': 'N', 'ㅡ': 'M'
}

function playSynthSound(type: 'correct' | 'wrong' | 'start' | 'gameover', isMuted: boolean) {
  if (isMuted) return
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    if (type === 'correct') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(523.25, ctx.currentTime) // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08) // E5
      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22)
      osc.start()
      osc.stop(ctx.currentTime + 0.22)
    } else if (type === 'wrong') {
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(160, ctx.currentTime)
      osc.frequency.setValueAtTime(110, ctx.currentTime + 0.12)
      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28)
      osc.start()
      osc.stop(ctx.currentTime + 0.28)
    } else if (type === 'start') {
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(320, ctx.currentTime)
      osc.frequency.setValueAtTime(480, ctx.currentTime + 0.08)
      osc.frequency.setValueAtTime(640, ctx.currentTime + 0.16)
      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
      osc.start()
      osc.stop(ctx.currentTime + 0.4)
    } else if (type === 'gameover') {
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(220, ctx.currentTime)
      osc.frequency.setValueAtTime(140, ctx.currentTime + 0.25)
      osc.frequency.setValueAtTime(90, ctx.currentTime + 0.5)
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6)
      osc.start()
      osc.stop(ctx.currentTime + 0.6)
    }
  } catch {
    // Ignore audio context blocks
  }
}

export function PlayHubPage() {
  const [activeTab, setActiveTab] = useState<SubTab>('game')
  
  // User profile
  const [userProfile, setUserProfile] = useState<{ name: string; xp: number; tier: UserTier }>({
    name: 'Anonymous Student',
    xp: 100,
    tier: 'Beginner'
  })

  // Audio mute state
  const [isMuted, setIsMuted] = useState(true)

  // Virtual keyboard setting: 'all' | 'korean' | 'hide'
  const [keyboardMode, setKeyboardMode] = useState<'all' | 'korean' | 'hide'>('all')

  // Load User profile & rankings safely
  const [miniRankers, setMiniRankers] = useState<Ranker[]>([])
  const [leaderboard, setLeaderboard] = useState<Ranker[]>([])

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
    }
  }

  // Load Leaderboard data safely
  const loadLeaderboardData = () => {
    const saved = localStorage.getItem(RANK_KEY)
    let list: Ranker[] = SEED_RANKERS
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed
        }
      } catch {
        // Ignore
      }
    }
    setLeaderboard(list)
    setMiniRankers(list.slice(0, 3))
  }

  useEffect(() => {
    reloadUserProfile()
    loadLeaderboardData()
  }, [activeTab])

  // --- Sub-Tab 1: Typing Game states, loops & PAUSE controls ---
  const [gamePlaying, setGamePlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [fallingWords, setFallingWords] = useState<FallingWord[]>([])
  
  // High-performance solution for Korean IME buffer crash: Key remounting mechanism
  const [typedKey, setTypedKey] = useState(0)
  const [typedInput, setTypedInput] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  
  // Game arena size & fullscreen triggers
  const [isLargeSize, setIsLargeSize] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const arenaRef = useRef<HTMLDivElement | null>(null)

  // Track browser native fullscreen state changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFsChange)
    return () => document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])
  
  const [gameScore, setGameScore] = useState(0)
  const [gameLives, setGameLives] = useState(3)
  const [difficulty, setDifficulty] = useState(1.5) // Velocity multiplier
  
  const spawnTimerRef = useRef<number | null>(null)
  const movementIntervalRef = useRef<number | null>(null)
  const nextWordId = useRef(0)

  const toggleFullscreen = () => {
    if (!arenaRef.current) return
    if (!document.fullscreenElement) {
      arenaRef.current.requestFullscreen().catch(() => {
        alert('Fullscreen mode is not supported by your browser.')
      })
    } else {
      document.exitFullscreen()
    }
  }

  const startGame = () => {
    setGamePlaying(true)
    setGameOver(false)
    setIsPaused(false)
    setFallingWords([])
    setGameScore(0)
    setGameLives(3)
    setDifficulty(1.5)
    setTypedInput('')
    setTypedKey((k) => k + 1)
    nextWordId.current = 0
    playSynthSound('start', isMuted)
  }

  // Spawn word loop (Pauses when isPaused is active)
  useEffect(() => {
    if (!gamePlaying || gameOver || isPaused) {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current)
      return
    }

    const intervalTime = userProfile.tier === 'Advanced' ? 3500 : 2200

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
    }, intervalTime)

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current)
    }
  }, [gamePlaying, gameOver, isPaused, userProfile.tier])

  // Movement Physics Loop (Pauses when isPaused is active)
  useEffect(() => {
    if (!gamePlaying || gameOver || isPaused) {
      if (movementIntervalRef.current) clearInterval(movementIntervalRef.current)
      return
    }

    movementIntervalRef.current = window.setInterval(() => {
      let lifeLost = false
      const bottomThreshold = isFullscreen ? 560 : (isLargeSize ? 730 : 450)

      setFallingWords((prev) => {
        const next = prev.map((w) => ({
          ...w,
          y: w.matched ? w.y : w.y + (difficulty * 0.8)
        })).filter((w) => {
          if (!w.matched && w.y >= bottomThreshold) {
            lifeLost = true
            return false
          }
          return true
        })

        if (lifeLost) {
          playSynthSound('wrong', isMuted)
          setGameLives((l) => {
            if (l <= 1) {
              setGameOver(true)
              setGamePlaying(false)
              playSynthSound('gameover', isMuted)
              return 0
            }
            return l - 1
          })
        }

        return next
      })
    }, 35)

    return () => {
      if (movementIntervalRef.current) clearInterval(movementIntervalRef.current)
    }
  }, [gamePlaying, gameOver, isPaused, difficulty, isMuted, isLargeSize, isFullscreen])

  // Synchronize difficulty to score
  useEffect(() => {
    const nextDiff = 1.5 + Math.floor(gameScore / 80) * 0.4
    setDifficulty(Math.min(nextDiff, 4.0))
  }, [gameScore])

  // Auto refocus when key remounts or game resumes safely
  useEffect(() => {
    if (gamePlaying && !gameOver && !isPaused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [typedKey, gamePlaying, gameOver, isPaused])

  // Helper to animate and destroy matched word
  const triggerMatchWord = (wordId: number) => {
    setFallingWords((prev) =>
      prev.map((w) => (w.id === wordId ? { ...w, matched: true } : w))
    )
    setGameScore((s) => s + 10)
    playSynthSound('correct', isMuted)

    // Complete cleanup of IME buffer by resetting actual input element and blurring it
    setTypedInput('')
    setTypedKey((k) => k + 1)

    // Critical IME Flush: Blur and refocus the input element to break Hangul IME memory
    if (inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.blur()
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 35) // Small delay to let browser flush composition stack
    }

    setTimeout(() => {
      setFallingWords((prev) => prev.filter((w) => w.id !== wordId))
    }, 320)
  }

  // Handle typing evaluation with granular layout constraints
  const handleTypingChange = (val: string) => {
    if (isPaused) return
    setTypedInput(val)
    const trimmed = val.trim()

    // 1. Single character or consonant/vowel (Instant blast, no Enter/Space required)
    if (trimmed.length === 1) {
      const matchedWord = fallingWords.find((w) => w.text === trimmed && !w.matched)
      if (matchedWord) {
        triggerMatchWord(matchedWord.id)
      }
    }
  }

  // Intercept Space and Enter to clear inputs immediately and evaluate word matching
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isPaused) return
    if (e.key === ' ' || e.key === 'Enter') {
      if (userProfile.tier !== 'Advanced') {
        if (e.key === ' ') {
          e.preventDefault() // Block inserting white space
        }
        const trimmed = typedInput.trim()
        const matchedWord = fallingWords.find((w) => w.text === trimmed && !w.matched)
        if (matchedWord) {
          triggerMatchWord(matchedWord.id)
        } else {
          setTypedInput('')
          setTypedKey((k) => k + 1)
          if (inputRef.current) {
            inputRef.current.value = ''
            inputRef.current.blur()
            setTimeout(() => inputRef.current?.focus(), 35)
          }
        }
      }
    }
  }

  // Handle traditional submit (Enter key for sentences)
  const submitTypingWord = (e: React.FormEvent) => {
    e.preventDefault()
    if (!gamePlaying || gameOver || isPaused) return

    const trimmed = typedInput.trim()
    const matchedWord = fallingWords.find((w) => w.text === trimmed && !w.matched)

    if (matchedWord) {
      triggerMatchWord(matchedWord.id)
    } else {
      playSynthSound('wrong', isMuted)
      setTypedInput('')
      setTypedKey((k) => k + 1)
      if (inputRef.current) {
        inputRef.current.value = ''
        inputRef.current.blur()
        setTimeout(() => inputRef.current?.focus(), 35)
      }
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
    loadLeaderboardData()
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

  // Arena Background click toggles Pause/Resume
  const handleArenaClick = (e: React.MouseEvent) => {
    // Only trigger if game is active and we are clicking the background, not buttons
    if (!gamePlaying || gameOver) return
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('input')) return

    setIsPaused((p) => !p)
  }

  // --- Sub-Tab 3: Forum state & boards (Classroom, Knews, Culture) ---
  const [forumCategory, setForumCategory] = useState<ForumCategory | 'all'>('all')
  const [newPostCategory, setNewPostCategory] = useState<ForumCategory>('classroom')
  const [newPostText, setNewPostText] = useState('')
  const [posts, setPosts] = useState<ForumPost[]>([
    { id: 1, author: 'Sarah Connor', category: 'classroom', content: 'The visual sticker mnemonic for "ㄱ" looking like a Gun is brilliant! Helped me memorize basic stroke shapes in minutes.', date: '2026-07-16' },
    { id: 2, author: 'Kenji Sato', category: 'classroom', content: 'Just unlocked the Intermediate Daily Conversation dialogues course. Practice dialogues are extremely realistic!', date: '2026-07-17' },
    { id: 3, author: 'Liam Neeson', category: 'knews', content: 'Korean literacy rates are hitting the headlines this morning due to active picture-mnemonic digital app promotions.', date: '2026-07-18' },
    { id: 4, author: 'Emma Watson', category: 'culture', content: 'Planning a trip to Gyeongbokgung palace next spring. Learning Sino-Korean Hanja roots helps read signposts so much faster!', date: '2026-07-18' }
  ])

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPostText.trim()) return

    const newPost: ForumPost = {
      id: Date.now(),
      author: userProfile.name,
      category: newPostCategory,
      content: newPostText.trim(),
      date: new Date().toISOString().split('T')[0]
    }
    setPosts([newPost, ...posts])
    setNewPostText('')
  }

  const filteredPosts = forumCategory === 'all' 
    ? posts 
    : posts.filter((p) => p.category === forumCategory)

  // Coming Soon Games notification
  const handleComingSoonClick = (gameName: string) => {
    alert(`🎮 "${gameName}" is coming soon in the next version release! Keep leveling up your tier!`)
  }

  return (
    <div className="shell reveal" style={{ paddingBottom: '4rem', marginTop: '1.5rem' }}>
      
      {/* Sub tabs selector (Bookstore Removed) */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--line)', paddingBottom: '1px', overflowX: 'auto' }}>
        {(['game', 'rank', 'board'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === tab ? 'white' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '3px solid var(--teal)' : '3px solid transparent',
              color: activeTab === tab ? 'var(--teal-deep)' : 'var(--ink-soft)',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontSize: '0.85rem'
            }}
          >
            {tab === 'game' && '⌨️ Keyboard Game'}
            {tab === 'rank' && '🏆 Rankings'}
            {tab === 'board' && '💬 Forums'}
          </button>
        ))}
      </div>

      {/* Profile summary bar */}
      <div style={{ background: 'white', border: '1px solid var(--line)', padding: '1rem 1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
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

      {/* ==================== SKY SCRAPER VERTICAL SIDEBAR RANKING (화면의 완전 좌측, 세로 광고 영역 고정형 - 오직 게임화면 탭에서만 활성화) ==================== */}
      {activeTab === 'game' && (
        <div 
          onClick={() => setActiveTab('rank')}
          className="skyscraper-ranking-card edu-card-chunky hover-lift"
          style={{
            position: 'fixed',
            left: '1.5rem',
            top: '200px',
            width: '170px',
            background: 'white',
            border: '2.5px dashed var(--teal)', // 광고판 느낌의 점선 스타일링
            borderRadius: '20px',
            padding: '1.25rem 1rem',
            cursor: 'pointer',
            zIndex: 100,
            boxShadow: '0 8px 24px rgba(15,23,42,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}
        >
          <div style={{ background: 'var(--teal-deep)', color: 'white', fontSize: '0.68rem', fontWeight: 'bold', padding: '0.2rem 0.4rem', borderRadius: '4px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            📢 LIVE RANKINGS
          </div>
          
          <h4 style={{ margin: '0.15rem 0 0.25rem 0', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 'bold', textAlign: 'center' }}>
            🏆 Leaderboard
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {miniRankers.map((ranker, i) => (
              <div key={ranker.name} style={{ display: 'flex', flexDirection: 'column', fontSize: '0.78rem', borderBottom: i < 2 ? '1px dashed var(--line)' : 'none', paddingBottom: '0.35rem' }}>
                <span style={{ fontWeight: 'bold', color: i === 0 ? 'var(--ember)' : 'var(--ink)' }}>
                  {i + 1}. {ranker.name}
                </span>
                <span style={{ color: 'var(--teal-deep)', fontWeight: 'bold', fontSize: '0.72rem' }}>
                  {ranker.xp} XP
                </span>
              </div>
            ))}
          </div>
          
          <div style={{ borderTop: '1px solid var(--line)', marginTop: '0.25rem', paddingTop: '0.5rem', fontSize: '0.75rem', color: 'var(--teal)', fontWeight: 'bold', textAlign: 'center' }}>
            Expand Table ➔
          </div>
        </div>
      )}

      {/* Main Single Column Content Block (Now takes full screen horizontally under Theater mode naturally) */}
      <div style={{ width: '100%', marginTop: '1.5rem' }}>

          {activeTab === 'game' && (
            <div 
              ref={arenaRef} 
              className={`game-fullscreen-wrapper ${isFullscreen ? 'fullscreen-active' : ''}`}
              style={{ 
                animation: 'rise 0.4s ease both',
                background: isFullscreen ? '#0f172a' : 'transparent',
                padding: isFullscreen ? '2.5rem' : '0',
                borderRadius: isFullscreen ? '0' : '24px',
                color: isFullscreen ? 'white' : 'var(--ink)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: isFullscreen ? 'white' : 'var(--ink)' }}>
                  Raindrop Typer (Level: <span style={{ color: 'var(--teal)' }}>{userProfile.tier}</span>)
                </h3>
                
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', fontWeight: 'bold' }}
                    onClick={() => setIsMuted((m) => !m)}
                  >
                    <span>{isMuted ? '🔇 Muted' : '🔊 Sound ON'}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', fontWeight: 'bold' }}
                    onClick={() => setIsLargeSize((l) => !l)}
                  >
                    {isLargeSize ? '🔍 Normal Size' : '🔍 Theater Mode'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', fontWeight: 'bold' }}
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? '🖥️ Exit Fullscreen' : '🖥️ Fullscreen'}
                  </button>
                  <div style={{ fontSize: '0.9rem', color: isFullscreen ? 'white' : 'var(--ink)' }}>
                    Hearts: <span style={{ color: 'var(--ember)', fontSize: '1.15rem' }}>{'❤️'.repeat(gameLives) || '💀'}</span>
                  </div>
                  <strong style={{ fontSize: '1.15rem', color: 'var(--teal)' }}>+{gameScore} XP</strong>
                </div>
              </div>

              {/* Game Canvas Arena - Click toggles Pause/Resume (ref shifted to wrapper) */}
              <div 
                className={`game-arena ${isLargeSize ? 'game-arena-large' : ''}`}
                onClick={handleArenaClick}
                style={{ 
                  maxWidth: isLargeSize ? '100%' : '800px', 
                  height: isFullscreen ? '580px' : (isLargeSize ? '760px' : '480px'), 
                  margin: '0 auto', 
                  width: '100%',
                  position: 'relative', 
                  cursor: gamePlaying ? 'pointer' : 'default',
                  border: isPaused ? '3px solid var(--ember)' : '3px solid var(--line)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  background: '#0f172a'
                }}
              >
                {/* 1. START OVERLAY */}
                {!gamePlaying && !gameOver && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(26, 35, 50, 0.96)', color: 'white', gap: '1rem', padding: '1.5rem', textAlign: 'center', zIndex: 10 }}>
                    <span style={{ fontSize: '3rem' }}>🎮</span>
                    <h3 style={{ color: 'white', margin: 0 }}>Play Level: {userProfile.tier}</h3>
                    <p style={{ color: '#a0aab8', fontSize: '0.85rem', maxWidth: '380px', margin: 0 }}>
                      Words drop from the top. Correct typing destroys them. Click anywhere on the board while playing to PAUSE.
                    </p>
                    <button type="button" className="btn btn-ember btn-pulse" style={{ padding: '0.8rem 2.5rem', marginTop: '0.5rem' }} onClick={startGame}>
                      Start Typer Game
                    </button>
                  </div>
                )}

                {/* 2. PAUSE OVERLAY */}
                {gamePlaying && isPaused && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.85)', color: 'white', gap: '0.5rem', zIndex: 15, textAlign: 'center' }}>
                    <span style={{ fontSize: '3rem' }}>⏸️</span>
                    <h3 style={{ color: 'white', margin: 0, fontWeight: 'bold' }}>GAME PAUSED</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Click anywhere on the board background to Resume</p>
                  </div>
                )}

                {/* 3. GAME RUNNING FALLING WORDS */}
                {gamePlaying && fallingWords.map((w) => {
                  const shakeOffsetX = Math.sin(w.y / 25) * (difficulty * 2.2)
                  const clampedX = Math.max(8, Math.min(92, w.x + shakeOffsetX))

                  return (
                    <div
                      key={w.id}
                      className={`falling-word ${w.matched ? 'word-matched' : ''}`}
                      style={{
                        left: `${clampedX}%`,
                        top: `${w.y}px`
                      }}
                    >
                      {w.text}
                      <span style={{ display: 'block', fontSize: '0.7rem', opacity: 0.8, fontWeight: 'normal', textAlign: 'center' }}>
                        {w.translation}
                      </span>
                    </div>
                  )
                })}

                {/* 4. GAME OVER OVERLAY */}
                {gameOver && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(26, 35, 50, 0.98)', color: 'white', gap: '1rem', padding: '1.5rem', textAlign: 'center', zIndex: 10 }}>
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

              {/* Typing Form Controls - IME Key Remounting applied */}
              {gamePlaying && (
                <form onSubmit={submitTypingWord} className="game-input-container" style={{ margin: '1.5rem auto' }}>
                  <input
                    ref={inputRef}
                    key={`typed-ime-key-${typedKey}`}
                    type="text"
                    className="game-input"
                    placeholder={
                      userProfile.tier === 'Beginner' 
                        ? "Type 1 char (instant blow)..." 
                        : "Type word + [Space] or [Enter]..."
                    }
                    defaultValue=""
                    onChange={(e) => handleTypingChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isPaused}
                    autoFocus
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }} disabled={isPaused}>
                    Submit
                  </button>
                </form>
              )}

              {/* On-Screen Virtual Keyboard */}
              <div className="virtual-keyboard-area" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                {keyboardMode !== 'hide' && (
                  <div className="virtual-keyboard" style={{ margin: '0 auto' }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: 'var(--ink-soft)', textAlign: 'center', fontWeight: 'bold' }}>
                      ⌨️ VIRTUAL KEYBOARD LAYOUT (NEXT KEY FLICKERS IN ORANGE)
                    </p>
                    
                    {/* Row 1 */}
                    <div className="keyboard-row">
                      {['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'].map((k) => (
                        <div
                          key={k}
                          className={`keyboard-key ${nextChar === k ? 'highlight-next' : ''}`}
                          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '42px', padding: '0.4rem 0.5rem' }}
                        >
                          <span style={{ fontSize: '1rem' }}>{k}</span>
                          {keyboardMode === 'all' && (
                            <span style={{ fontSize: '0.62rem', color: 'var(--ink-soft)', fontWeight: 'normal', marginTop: '0.1rem' }}>
                              {KEY_MAP[k] || ''}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Row 2 */}
                    <div className="keyboard-row">
                      {['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'].map((k) => (
                        <div
                          key={k}
                          className={`keyboard-key ${nextChar === k ? 'highlight-next' : ''}`}
                          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '42px', padding: '0.4rem 0.5rem' }}
                        >
                          <span style={{ fontSize: '1rem' }}>{k}</span>
                          {keyboardMode === 'all' && (
                            <span style={{ fontSize: '0.62rem', color: 'var(--ink-soft)', fontWeight: 'normal', marginTop: '0.1rem' }}>
                              {KEY_MAP[k] || ''}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Row 3 */}
                    <div className="keyboard-row">
                      {['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ'].map((k) => (
                        <div
                          key={k}
                          className={`keyboard-key ${nextChar === k ? 'highlight-next' : ''}`}
                          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '42px', padding: '0.4rem 0.5rem' }}
                        >
                          <span style={{ fontSize: '1rem' }}>{k}</span>
                          {keyboardMode === 'all' && (
                            <span style={{ fontSize: '0.62rem', color: 'var(--ink-soft)', fontWeight: 'normal', marginTop: '0.1rem' }}>
                              {KEY_MAP[k] || ''}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.25rem' }}>
                  <div style={{ display: 'inline-flex', background: 'var(--paper-cool)', padding: '0.25rem', borderRadius: '10px', border: '1px solid var(--line)' }}>
                    {(['all', 'korean', 'hide'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setKeyboardMode(mode)}
                        style={{
                          padding: '0.35rem 0.8rem',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          border: 'none',
                          borderRadius: '8px',
                          background: keyboardMode === mode ? 'white' : 'transparent',
                          color: keyboardMode === mode ? 'var(--teal-deep)' : 'var(--ink-soft)',
                          cursor: 'pointer',
                          boxShadow: keyboardMode === mode ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {mode === 'all' && '⌨️ Show All Keys'}
                        {mode === 'korean' && '🇰🇷 Korean Only'}
                        {mode === 'hide' && '🔇 Hide Keyboard'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* GAME ARCADE PIPELINE SHOWCASE (게임 확장성 명시) */}
              <div style={{ marginTop: '3.5rem', borderTop: '1px solid var(--line)', paddingTop: '2.5rem' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
                  🎮 Malmoa Arcade: Future Game Pipelines
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', textAlign: 'center', marginBottom: '2rem' }}>
                  More gamified educational activities are continuously scheduled to reinforce spelling retention!
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
                  <div className="edu-card-chunky" style={{ background: '#e2f1f1', borderColor: 'var(--teal)', padding: '1.25rem', textAlign: 'center' }}>
                    <span style={{ fontSize: '2rem' }}>🌧️</span>
                    <h5 style={{ fontWeight: 'bold', margin: '0.5rem 0 0.25rem 0', fontSize: '0.9rem' }}>Raindrop Typer</h5>
                    <span style={{ fontSize: '0.7rem', color: 'var(--teal-deep)', fontWeight: 'bold' }}>ACTIVE</span>
                  </div>
                  
                  <div className="edu-card-chunky hover-lift" onClick={() => handleComingSoonClick('Syllable Matching Puzzle')} style={{ padding: '1.25rem', textAlign: 'center', cursor: 'pointer', background: 'white' }}>
                    <span style={{ fontSize: '2rem', opacity: 0.6 }}>🧩</span>
                    <h5 style={{ fontWeight: 'bold', margin: '0.5rem 0 0.25rem 0', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>Matching Puzzle</h5>
                    <span style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', fontWeight: 'bold' }}>COMING SOON</span>
                  </div>

                  <div className="edu-card-chunky hover-lift" onClick={() => handleComingSoonClick('Mnemonic Word Search')} style={{ padding: '1.25rem', textAlign: 'center', cursor: 'pointer', background: 'white' }}>
                    <span style={{ fontSize: '2rem', opacity: 0.6 }}>🔍</span>
                    <h5 style={{ fontWeight: 'bold', margin: '0.5rem 0 0.25rem 0', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>Word Search</h5>
                    <span style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', fontWeight: 'bold' }}>COMING SOON</span>
                  </div>

                  <div className="edu-card-chunky hover-lift" onClick={() => handleComingSoonClick('Sentence Builder')} style={{ padding: '1.25rem', textAlign: 'center', cursor: 'pointer', background: 'white' }}>
                    <span style={{ fontSize: '2rem', opacity: 0.6 }}>✍️</span>
                    <h5 style={{ fontWeight: 'bold', margin: '0.5rem 0 0.25rem 0', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>Sentence Builder</h5>
                    <span style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', fontWeight: 'bold' }}>COMING SOON</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- SUB-TAB 2: RANKINGS --- */}
          {activeTab === 'rank' && (
            <div style={{ animation: 'rise 0.4s ease both' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '1.5rem' }}>🏆 Global XP Rankings</h3>
              <table className="rank-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--line)', textAlign: 'left' }}>
                    <th style={{ width: '80px', padding: '0.75rem 0' }}>Rank</th>
                    <th style={{ padding: '0.75rem 0' }}>Learner</th>
                    <th style={{ padding: '0.75rem 0' }}>Points (XP)</th>
                    <th style={{ padding: '0.75rem 0' }}>Achievement Title</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((item, idx) => (
                    <tr
                      key={item.name}
                      style={{
                        borderBottom: '1px solid var(--line)',
                        background: item.name.toLowerCase() === userProfile.name.toLowerCase() ? 'color-mix(in srgb, var(--teal) 8%, transparent)' : 'transparent',
                        fontWeight: item.name.toLowerCase() === userProfile.name.toLowerCase() ? 'bold' : 'normal'
                      }}
                    >
                      <td style={{ padding: '0.75rem 0' }}><strong>{idx + 1}</strong></td>
                      <td style={{ padding: '0.75rem 0' }}>{item.name}</td>
                      <td style={{ padding: '0.75rem 0', color: 'var(--teal-deep)', fontWeight: 'bold' }}>{item.xp} XP</td>
                      <td style={{ padding: '0.75rem 0' }}>{item.badge}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* --- SUB-TAB 3: STUDENT FORUM (수업 포럼, K뉴스, 한국 정보 공유) --- */}
          {activeTab === 'board' && (
            <div style={{ animation: 'rise 0.4s ease both' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '1rem' }}>💬 Peer Discussion Forum</h3>
              
              {/* Category Board Filtering buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {(['all', 'classroom', 'knews', 'culture'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForumCategory(cat)}
                    style={{
                      padding: '0.45rem 1rem',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      border: '1px solid var(--line)',
                      borderRadius: '20px',
                      background: forumCategory === cat ? 'var(--teal-deep)' : 'white',
                      color: forumCategory === cat ? 'white' : 'var(--ink-soft)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {cat === 'all' && '🌐 Show All Categories'}
                    {cat === 'classroom' && '📖 Classroom Forum'}
                    {cat === 'knews' && '📰 K-News Forum'}
                    {cat === 'culture' && '🇰🇷 K-Culture Share'}
                  </button>
                ))}
              </div>

              {/* Forum post creation form */}
              <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem', background: 'white', padding: '1.5rem', border: '1px solid var(--line)', borderRadius: '24px' }}>
                <h4 style={{ margin: 0, fontWeight: 'bold', fontSize: '1.05rem' }}>Post a thought to the community:</h4>
                
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <label htmlFor="forum-cat-select" style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Target Board:</label>
                  <select
                    id="forum-cat-select"
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value as ForumCategory)}
                    style={{ padding: '0.35rem 0.75rem', border: '1px solid var(--line)', borderRadius: '8px', background: 'white', fontSize: '0.85rem' }}
                  >
                    <option value="classroom">📖 Classroom Forum (수업 포럼)</option>
                    <option value="knews">📰 K-News Forum (K뉴스)</option>
                    <option value="culture">🇰🇷 K-Culture Share (한국 정보 공유)</option>
                  </select>
                </div>

                <textarea
                  placeholder="What are your thoughts on Mnemonic stickers or 한글 stroke drawing sheets?"
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  style={{ width: '100%', minHeight: '80px', padding: '0.75rem', border: '1px solid var(--line)', borderRadius: '12px', resize: 'vertical', fontSize: '0.9rem' }}
                />
                
                <button type="submit" className="edu-btn-3d" style={{ alignSelf: 'flex-start', padding: '0.55rem 1.8rem', fontSize: '0.88rem', borderRadius: '10px' }}>
                  Publish Post
                </button>
              </form>

              {/* Render forum posts list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {filteredPosts.map((post) => (
                  <div key={post.id} style={{ background: 'white', border: '1px solid var(--line)', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <strong>{post.author}</strong>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 'bold',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '6px',
                          background: post.category === 'classroom' ? '#e2f1f1' : post.category === 'knews' ? '#f3e8ff' : '#fef3c7',
                          color: post.category === 'classroom' ? 'var(--teal-deep)' : post.category === 'knews' ? '#7c3aed' : 'var(--ember)'
                        }}>
                          {post.category === 'classroom' && 'Classroom Forum'}
                          {post.category === 'knews' && 'K-News Forum'}
                          {post.category === 'culture' && 'K-Culture Share'}
                        </span>
                      </div>
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

        </div>

    </div>
  )
}
