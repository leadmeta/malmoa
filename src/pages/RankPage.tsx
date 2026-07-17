import { useState, useEffect } from 'react'
import { RANK_KEY, SEED_RANKERS, type Ranker } from '../data/content'
import './InnerPages.css'

export function RankPage() {
  const [rankers, setRankers] = useState<Ranker[]>([])
  const [userName, setUserName] = useState('')
  const [userRegistered, setUserRegistered] = useState(false)
  const [userXp, setUserXp] = useState(100) // Starting XP

  useEffect(() => {
    const saved = localStorage.getItem(RANK_KEY)
    if (saved) {
      try {
        setRankers(JSON.parse(saved))
      } catch {
        setRankers(SEED_RANKERS)
      }
    } else {
      setRankers(SEED_RANKERS)
      localStorage.setItem(RANK_KEY, JSON.stringify(SEED_RANKERS))
    }

    // Check if user has a registered name in this session
    const savedUser = localStorage.getItem('malmoa-user-profile')
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        setUserName(parsed.name)
        setUserXp(parsed.xp || 100)
        setUserRegistered(true)
      } catch {
        // Ignore
      }
    }
  }, [])

  const handleRegisterName = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName.trim()) return

    const profile = { name: userName.trim(), xp: userXp }
    localStorage.setItem('malmoa-user-profile', JSON.stringify(profile))
    setUserRegistered(true)

    // Add user to leaderboard if not already there
    const saved = localStorage.getItem(RANK_KEY)
    let currentRankers: Ranker[] = []
    if (saved) {
      try {
        currentRankers = JSON.parse(saved)
      } catch {
        currentRankers = [...SEED_RANKERS]
      }
    } else {
      currentRankers = [...SEED_RANKERS]
    }

    // Check if user already exists in leaderboard
    const existsIdx = currentRankers.findIndex((r) => r.name.toLowerCase() === userName.trim().toLowerCase())
    if (existsIdx !== -1) {
      currentRankers[existsIdx].xp = userXp
    } else {
      currentRankers.push({
        name: userName.trim(),
        xp: userXp,
        badge: 'You 👑',
      })
    }

    // Sort rankers
    currentRankers.sort((a, b) => b.xp - a.xp)
    setRankers(currentRankers)
    localStorage.setItem(RANK_KEY, JSON.stringify(currentRankers))
  }

  // Deduce 1st, 2nd, 3rd from rankers
  const top1 = rankers[0]
  const top2 = rankers[1]
  const top3 = rankers[2]

  return (
    <div className="shell page-hero reveal" style={{ paddingBottom: '4rem' }}>
      <p className="section-label">Leaderboard</p>
      <h1>Global Mnemonic Rankings</h1>
      <p style={{ maxWidth: '44rem', color: 'var(--ink-soft)' }}>
        Compare your intermediate Korean literacy XP with active language students worldwide. 
        Earn XP by completing quizzes in the News Tab (+50 XP) or fending off descending vocabulary in the Typing Game (+10 XP per word).
      </p>

      {/* User Registration Panel */}
      <div style={{ background: 'white', border: '1px solid var(--line)', padding: '1.5rem', borderRadius: 'var(--radius)', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
        {!userRegistered ? (
          <form onSubmit={handleRegisterName} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>Register Your Learning Avatar:</h4>
            <input
              type="text"
              placeholder="Enter nickname..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{ padding: '0.5rem 1rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)', flex: 1, minWidth: '200px' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>
              Join Leaderboard (+100 XP)
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>Avatar registered: </span>
              <strong>{userName}</strong>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div>
                Your XP Score: <strong style={{ color: 'var(--teal)', fontSize: '1.2rem' }}>{userXp} XP</strong>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.35rem 1rem', fontSize: '0.85rem' }}
                onClick={() => setUserRegistered(false)}
              >
                Change Nickname
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Podiums for Top 3 */}
      {rankers.length >= 3 && (
        <div className="podium-container" aria-label="Leaderboard top three podium">
          {/* 2nd Place */}
          {top2 && (
            <div className="podium-step podium-2nd">
              <span style={{ fontSize: '2.5rem', marginBottom: '0.2rem' }}>🥈</span>
              <div style={{ fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90px', whiteSpace: 'nowrap' }}>{top2.name}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{top2.xp} XP</div>
              <div style={{ background: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', marginTop: '0.35rem' }}>2nd</div>
            </div>
          )}

          {/* 1st Place */}
          {top1 && (
            <div className="podium-step podium-1st">
              <span style={{ fontSize: '3.5rem', marginBottom: '0.2rem', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))' }}>👑</span>
              <div style={{ fontSize: '1.05rem', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px', whiteSpace: 'nowrap' }}>{top1.name}</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>{top1.xp} XP</div>
              <div style={{ background: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '4px', marginTop: '0.5rem' }}>1st Place</div>
            </div>
          )}

          {/* 3rd Place */}
          {top3 && (
            <div className="podium-step podium-3rd">
              <span style={{ fontSize: '2.2rem', marginBottom: '0.2rem' }}>🥉</span>
              <div style={{ fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90px', whiteSpace: 'nowrap' }}>{top3.name}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{top3.xp} XP</div>
              <div style={{ background: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', marginTop: '0.35rem' }}>3rd</div>
            </div>
          )}
        </div>
      )}

      {/* Leaderboard Table (4th and beyond) */}
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', marginTop: '3rem', borderBottom: '1px solid var(--line)', paddingBottom: '0.5rem' }}>
        Leaderboard Rankings
      </h3>
      <table className="rank-table">
        <thead>
          <tr>
            <th style={{ width: '80px' }}>Rank</th>
            <th>Name</th>
            <th style={{ width: '120px' }}>Score (XP)</th>
            <th>Title / Badges</th>
          </tr>
        </thead>
        <tbody>
          {rankers.map((item, idx) => (
            <tr
              key={item.name}
              style={{
                background:
                  userName && item.name.toLowerCase() === userName.toLowerCase()
                    ? 'color-mix(in srgb, var(--teal) 8%, transparent)'
                    : 'transparent',
                fontWeight:
                  userName && item.name.toLowerCase() === userName.toLowerCase() ? 'bold' : 'normal',
              }}
            >
              <td>
                <strong>{idx + 1}</strong>
              </td>
              <td>{item.name}</td>
              <td style={{ color: 'var(--teal-deep)', fontWeight: 'bold' }}>{item.xp} XP</td>
              <td>{item.badge}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
