import { Link } from 'react-router-dom'
import './InnerPages.css'

export function DemoHubPage() {
  return (
    <div className="shell page-hero reveal" style={{ paddingBottom: '4rem', textAlign: 'center' }}>
      <p className="section-label">Demo Zone</p>
      <h1>Interactive Educational Demos</h1>
      <p style={{ maxWidth: '40rem', margin: '0 auto 2.5rem auto', color: 'var(--ink-soft)' }}>
        Experience the power of Malmoa\'s visual association system. Try our 2-minute consonant association game or unseal Hanja vocabulary network cards.
      </p>

      {/* Grid of Demos */}
      <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
        
        {/* Card 1: Hangul Consonants */}
        <div
          style={{
            background: 'white',
            border: '2px solid var(--line)',
            borderRadius: '28px',
            padding: '3rem 2rem',
            width: '320px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            transition: 'all 0.25s ease'
          }}
          className="board-post-card"
        >
          <span style={{ fontSize: '3.5rem' }}>🧠</span>
          <h3 style={{ fontFamily: 'var(--font-display)', margin: 0, fontWeight: 'bold' }}>
            Hangul Consonant Game
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
            Connect basic consonants (ㄱ, ㄴ, ㄷ) to visual cue mnemonics (Gun, Nose, Door) and test your intuition!
          </p>
          <Link to="/lesson/hangul-demo" className="btn btn-primary btn-pulse" style={{ padding: '0.6rem 2rem', marginTop: '1rem' }}>
            Launch Game Demo ➔
          </Link>
        </div>

        {/* Card 2: Hanja Mnemonic Network */}
        <div
          style={{
            background: 'white',
            border: '2px solid var(--line)',
            borderRadius: '28px',
            padding: '3rem 2rem',
            width: '320px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            transition: 'all 0.25s ease'
          }}
          className="board-post-card"
        >
          <span style={{ fontSize: '3.5rem' }}>✨</span>
          <h3 style={{ fontFamily: 'var(--font-display)', margin: 0, fontWeight: 'bold' }}>
            Hanja Mnemonic Bridge
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
            Unseal Hanja roots like "木" and "調" to watch them branch into intermediate vocabulary networks.
          </p>
          <Link to="/lesson/hanja-demo" className="btn btn-primary btn-pulse" style={{ padding: '0.6rem 2rem', marginTop: '1rem' }}>
            Launch Network Demo ➔
          </Link>
        </div>

      </div>
    </div>
  )
}
