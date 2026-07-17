import { useState, type FormEvent } from 'react'
import { WAITLIST_KEY } from '../data/content'
import './InnerPages.css'

type Track = 'hangul' | 'hanja' | 'both'

type WaitlistEntry = {
  name: string
  email: string
  nativeLanguage: string
  track: Track
  createdAt: string
}

export function WaitlistPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [nativeLanguage, setNativeLanguage] = useState('')
  const [track, setTrack] = useState<Track>('both')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!name.trim() || !email.trim() || !nativeLanguage.trim()) {
      setError('Please fill in your name, email, and native language.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    const entry: WaitlistEntry = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      nativeLanguage: nativeLanguage.trim(),
      track,
      createdAt: new Date().toISOString(),
    }

    try {
      const raw = localStorage.getItem(WAITLIST_KEY)
      const list: WaitlistEntry[] = raw ? (JSON.parse(raw) as WaitlistEntry[]) : []
      const withoutDup = list.filter((item) => item.email !== entry.email)
      withoutDup.push(entry)
      localStorage.setItem(WAITLIST_KEY, JSON.stringify(withoutDup))
      setSubmitted(true)
    } catch {
      setError('Could not save locally. Please try again.')
    }
  }

  return (
    <div className="shell page-hero reveal" style={{ paddingBottom: '4rem' }}>
      <p className="section-label">Pre-Registration</p>
      <h1>Book a Consultation Session</h1>
      <p style={{ maxWidth: '42rem', marginBottom: '2.5rem' }}>
        Get a free 15-minute Korean level check and customized path consultation with our coaching team. 
        Reserve your seat for the next pilot cohort.
      </p>

      {submitted ? (
        <div className="success-panel" style={{ background: 'color-mix(in srgb, var(--paper-cool) 50%, white)', padding: '3rem 2rem', borderRadius: 'var(--radius)', border: '1px solid var(--line)', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
          <h2>Consultation Request Received!</h2>
          <p style={{ maxWidth: '32rem', margin: '0.5rem auto 1.5rem auto', color: 'var(--ink-soft)', fontSize: '1.05rem' }}>
            Thanks, {name.trim()}! We have saved your interest in the <strong>{track === 'both' ? 'Full Premium Path' : track === 'hangul' ? 'Hangul Foundations' : 'Hanja Bridge'}</strong>. 
            We will contact you shortly at <strong>{email.trim().toLowerCase()}</strong> to schedule your call.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="/" className="btn btn-primary">Back to Home</a>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
          
          {/* Pre-Registration Form */}
          <form className="form-stack" onSubmit={onSubmit} noValidate style={{ background: 'white', padding: '2rem 1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: '1.2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <div className="field">
              <label htmlFor="name" style={{ display: 'block', fontWeight: 'bold', fontSize: '0.88rem', marginBottom: '0.35rem' }}>Name</label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)' }}
              />
            </div>
            <div className="field">
              <label htmlFor="email" style={{ display: 'block', fontWeight: 'bold', fontSize: '0.88rem', marginBottom: '0.35rem' }}>Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)' }}
              />
            </div>
            <div className="field">
              <label htmlFor="nativeLanguage" style={{ display: 'block', fontWeight: 'bold', fontSize: '0.88rem', marginBottom: '0.35rem' }}>Native Language</label>
              <input
                id="nativeLanguage"
                name="nativeLanguage"
                autoComplete="language"
                placeholder="e.g., English, Japanese, French"
                value={nativeLanguage}
                onChange={(e) => setNativeLanguage(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)' }}
              />
            </div>
            <div className="field">
              <label htmlFor="track" style={{ display: 'block', fontWeight: 'bold', fontSize: '0.88rem', marginBottom: '0.35rem' }}>Interest Track</label>
              <select
                id="track"
                name="track"
                value={track}
                onChange={(e) => setTrack(e.target.value as Track)}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)', background: 'white' }}
              >
                <option value="hangul">Stage 1: Hangul Foundations</option>
                <option value="hanja">Stage 2 & 3: Hanja Bridge & Vocabulary</option>
                <option value="both">Full 12-Week Premium Path (Recommended)</option>
              </select>
            </div>
            
            {error && (
              <p className="feedback bad" role="alert" style={{ fontSize: '0.9rem', color: 'var(--ember)', background: 'color-mix(in srgb, var(--ember) 10%, white)', padding: '0.6rem', borderRadius: 'var(--radius)', border: '1px solid var(--ember)', margin: 0 }}>
                {error}
              </p>
            )}
            
            <button type="submit" className="btn btn-ember" style={{ padding: '0.8rem', marginTop: '0.5rem' }}>
              Book My Consultation Session
            </button>
          </form>

          {/* Quick FAQ / Info Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'color-mix(in srgb, var(--paper-cool) 35%, white)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>Why Book a Session?</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                Our 15-minute Zoom call is completely free. We will evaluate your reading pace, show you how our mnemonic sticker system aligns with your goals, and answer questions.
              </p>
            </div>
            <div style={{ background: 'color-mix(in srgb, var(--paper-cool) 35%, white)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>Textbook Shipment</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                Once you join a cohort, we package and ship your workbook, stickers, and bookmarks. Physical delivery takes 5–10 business days worldwide.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
