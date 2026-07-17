import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { RANK_KEY, type Ranker } from '../data/content'
import './InnerPages.css'

type FallingWord = {
  id: number
  text: string
  translation: string
  x: number // Percentage (10% to 90%)
  y: number // Pixels (0 to 400)
}

const GAME_WORDS = [
  { text: '나무', translation: 'Tree' },
  { text: '목요일', translation: 'Thursday' },
  { text: '벌목', translation: 'Logging' },
  { text: '수목', translation: 'Standing Trees' },
  { text: '목재', translation: 'Timber / Wood' },
  { text: '색조', translation: 'Color Tone' },
  { text: '보조', translation: 'Pace / Matching steps' },
  { text: '어조', translation: 'Tone of voice' },
  { text: '고조', translation: 'Climax / High tone' },
]

export function TypingGamePage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [words, setWords] = useState<FallingWord[]>([])
  const [inputText, setInputText] = useState('')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [difficulty, setDifficulty] = useState(1.5) // Speed multiplier

  const gameLoopRef = useRef<number | null>(null)
  const spawnTimerRef = useRef<number | null>(null)
  const nextIdRef = useRef(0)

  // Start the game
  const startGame = () => {
    setIsPlaying(true)
    setGameOver(false)
    setWords([])
    setScore(0)
    setLives(3)
    setDifficulty(1.5)
    setInputText('')
    nextIdRef.current = 0
  }

  // Handle word submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isPlaying || gameOver) return

    const trimmed = inputText.trim()
    const matchIdx = words.findIndex((w) => w.text === trimmed)

    if (matchIdx !== -1) {
      // Correct!
      setScore((s) => s + 10)
      setWords((prev) => prev.filter((_, idx) => idx !== matchIdx))
      setInputText('')
      
      // Speed up slightly
      setDifficulty((d) => Math.min(d + 0.1, 4.5))
    }
  }

  // Spawn a word
  useEffect(() => {
    if (!isPlaying || gameOver) {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current)
      return
    }

    spawnTimerRef.current = window.setInterval(() => {
      const randWord = GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)]
      const newWord: FallingWord = {
        id: nextIdRef.current++,
        text: randWord.text,
        translation: randWord.translation,
        x: 15 + Math.random() * 70, // Keep away from screen edges
        y: 0,
      }
      setWords((prev) => [...prev, newWord])
    }, 2000)

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current)
    }
  }, [isPlaying, gameOver])

  // Move words down
  useEffect(() => {
    if (!isPlaying || gameOver) {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
      return
    }

    const updatePositions = () => {
      let lifeLost = false

      setWords((prev) => {
        const nextWords = prev
          .map((w) => ({
            ...w,
            y: w.y + difficulty,
          }))
          .filter((w) => {
            if (w.y >= 380) {
              lifeLost = true
              return false // Removes the word
            }
            return true
          })

        if (lifeLost) {
          setLives((l) => {
            if (l <= 1) {
              setGameOver(true)
              setIsPlaying(false)
              return 0
            }
            return l - 1
          })
        }

        return nextWords
      })

      gameLoopRef.current = requestAnimationFrame(updatePositions)
    }

    gameLoopRef.current = requestAnimationFrame(updatePositions)

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [isPlaying, gameOver, difficulty])

  // Register final score to leaderboard
  const handleRegisterScore = () => {
    const savedUser = localStorage.getItem('malmoa-user-profile')
    let userProfile = { name: 'Anonymous Student', xp: 100 }
    if (savedUser) {
      try {
        userProfile = JSON.parse(savedUser)
      } catch {
        // Ignore
      }
    }

    userProfile.xp += score
    localStorage.setItem('malmoa-user-profile', JSON.stringify(userProfile))

    // Update global rankings
    const savedRankings = localStorage.getItem(RANK_KEY)
    let list: Ranker[] = []
    if (savedRankings) {
      try {
        list = JSON.parse(savedRankings)
      } catch {
        // Ignore
      }
    }

    const userIdx = list.findIndex((r) => r.name.toLowerCase() === userProfile.name.toLowerCase())
    if (userIdx !== -1) {
      list[userIdx].xp = userProfile.xp
    } else {
      list.push({
        name: userProfile.name,
        xp: userProfile.xp,
        badge: 'You 👑',
      })
    }
    list.sort((a, b) => b.xp - a.xp)
    localStorage.setItem(RANK_KEY, JSON.stringify(list))

    alert(`Successfully registered +${score} XP to rankings!`)
  }

  return (
    <div className="shell page-hero reveal" style={{ paddingBottom: '4rem' }}>
      <p className="section-label">🎮 Mini Game</p>
      <h1>Hangul Raindrop Typer</h1>
      <p style={{ maxWidth: '42rem', color: 'var(--ink-soft)' }}>
        Intermediate words are descending! Type the matching Hangul characters and press <strong>Enter</strong> to destroy them before they hit the ground.
      </p>

      {/* Stats bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', border: '1px solid var(--line)', padding: '1rem 1.5rem', borderRadius: '16px', margin: '2rem 0', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
        <div>
          XP Points: <strong style={{ color: 'var(--teal)', fontSize: '1.25rem' }}>+{score} XP</strong>
        </div>
        <div>
          Hearts: <span style={{ fontSize: '1.2rem', color: 'var(--ember)' }}>{'❤️'.repeat(lives) || '💀'}</span>
        </div>
        <div>
          Speed Multiplier: <strong style={{ color: 'var(--ink)' }}>{difficulty.toFixed(1)}x</strong>
        </div>
      </div>

      {/* Game Screen */}
      <div className="game-arena">
        {!isPlaying && !gameOver && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(26, 35, 50, 0.95)', color: 'white', gap: '1rem', padding: '1rem' }}>
            <span style={{ fontSize: '3rem' }}>⌨️</span>
            <h2 style={{ color: 'white', margin: 0, fontFamily: 'var(--font-display)' }}>Hangul Raindrop Game</h2>
            <p style={{ color: '#a0aab8', maxWidth: '320px', textAlign: 'center', margin: 0, fontSize: '0.92rem' }}>
              Select your keyboard layout (Korean Hangul input) and press Start.
            </p>
            <button type="button" className="btn btn-ember btn-pulse" style={{ padding: '0.8rem 2.5rem', marginTop: '1rem' }} onClick={startGame}>
              Start Game
            </button>
          </div>
        )}

        {/* Falling Words */}
        {isPlaying && words.map((w) => (
          <div
            key={w.id}
            className="falling-word"
            style={{
              left: `${w.x}%`,
              top: `${w.y}px`,
            }}
          >
            {w.text}
            <span style={{ display: 'block', fontSize: '0.72rem', opacity: 0.85, fontWeight: 'normal', textAlign: 'center', marginTop: '0.15rem' }}>
              {w.translation}
            </span>
          </div>
        ))}

        {/* Game Over Screen */}
        {gameOver && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(26, 35, 50, 0.97)', color: 'white', gap: '1rem', padding: '1rem' }}>
            <span style={{ fontSize: '3.5rem' }}>☠️</span>
            <h2 style={{ color: 'white', margin: 0, fontFamily: 'var(--font-display)', fontSize: '2rem' }}>Game Over</h2>
            <p style={{ color: '#a0aab8', margin: 0 }}>You scored +{score} XP points!</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button type="button" className="btn btn-primary" onClick={handleRegisterScore}>
                🏆 Submit Score to Rankings
              </button>
              <button type="button" className="btn btn-ember" onClick={startGame}>
                Play Again
              </button>
            </div>
            <Link to="/ranking" style={{ color: 'var(--teal)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              View Leaderboard Rankings →
            </Link>
          </div>
        )}
      </div>

      {/* Input controls */}
      {isPlaying && (
        <form onSubmit={handleSubmit} className="game-input-container">
          <input
            type="text"
            className="game-input"
            placeholder="Type Hangul here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
            Enter
          </button>
        </form>
      )}
    </div>
  )
}
