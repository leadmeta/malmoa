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
      setError('Please fill in name, email, and native language.')
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
    <div className="shell page-hero reveal">
      <p className="section-label">Early access</p>
      <h1>Join the Malmoa waitlist</h1>
      <p>
        Be first in line for the Hangul → Hanja pilot cohort. We store your
        request in this browser for now — swap in Formspree or a sheet later for
        team collection.
      </p>

      {submitted ? (
        <div className="success-panel">
          <h2>You’re on the list</h2>
          <p>
            Thanks, {name.trim()}. We’ll email {email.trim().toLowerCase()} when
            the next cohort opens. Meanwhile, try the sample lessons anytime.
          </p>
        </div>
      ) : (
        <form className="form-stack" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="nativeLanguage">Native language</label>
            <input
              id="nativeLanguage"
              name="nativeLanguage"
              autoComplete="language"
              placeholder="e.g. English, Spanish, Japanese"
              value={nativeLanguage}
              onChange={(e) => setNativeLanguage(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="track">Interest track</label>
            <select
              id="track"
              name="track"
              value={track}
              onChange={(e) => setTrack(e.target.value as Track)}
            >
              <option value="hangul">Hangul foundations</option>
              <option value="hanja">Hanja bridge</option>
              <option value="both">Both (recommended)</option>
            </select>
          </div>
          {error && (
            <p className="feedback bad" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="btn btn-ember">
            Request a seat
          </button>
          <p className="form-note">
            Data key: <code>{WAITLIST_KEY}</code> in localStorage. For production
            collection, point this form at Formspree, Google Sheets, or your CRM.
          </p>
        </form>
      )}
    </div>
  )
}
