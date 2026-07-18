import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { WAITLIST_KEY } from '../data/content'
import './InnerPages.css'

type Track = 'basic' | 'standard' | 'premium'

type WaitlistEntry = {
  name: string
  email: string
  nativeLanguage: string
  track: Track
  createdAt: string
  status: string
}

export function WaitlistPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [nativeLanguage, setNativeLanguage] = useState('')
  const [track, setTrack] = useState<Track>('standard')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Handle plan card click to focus and select interest track
  const handleSelectPlan = (selectedPlan: Track) => {
    setTrack(selectedPlan)
    // Scroll down to inquiry form
    const formElement = document.getElementById('inquiry-form-section')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

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
      status: 'Processing' // Matches admin status pipeline
    }

    try {
      // 1. Save to waitlist locally
      const raw = localStorage.getItem(WAITLIST_KEY)
      const list: WaitlistEntry[] = raw ? (JSON.parse(raw) as WaitlistEntry[]) : []
      const withoutDup = list.filter((item) => item.email !== entry.email)
      withoutDup.push(entry)
      localStorage.setItem(WAITLIST_KEY, JSON.stringify(withoutDup))

      // 2. Also register into order desk for direct matching in admin
      const savedOrders = localStorage.getItem('malmoa-orders')
      let orders = []
      if (savedOrders) {
        try { orders = JSON.parse(savedOrders) } catch { }
      }
      orders.push({
        id: `waitord-${Date.now()}`,
        item: `Premium Plan: ${track.toUpperCase()}`,
        buyer: name.trim(),
        status: 'Processing',
        date: new Date().toISOString().split('T')[0]
      })
      localStorage.setItem('malmoa-orders', JSON.stringify(orders))

      setSubmitted(true)
    } catch {
      setError('Could not save locally. Please try again.')
    }
  }

  return (
    <div className="shell reveal" style={{ paddingBottom: '5rem', marginTop: '2.5rem' }}>
      
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <p className="section-label">Pricing & Pre-registration</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', fontWeight: 'bold' }}>
          Find the Perfect Plan for Your Journey
        </h1>
        <p style={{ color: 'var(--ink-soft)', maxWidth: '38rem', margin: '0.75rem auto 0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Start learning Hangul completely for free, or upgrade to Standard & Premium levels for custom physical workbooks and 1:1 native coaching matching.
        </p>
      </div>

      {/* SECTION 1: PRICING TABLE (3종 요금제 카드) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
        
        {/* Basic Plan */}
        <div className="edu-card-chunky" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '2.5rem 2rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--ink-soft)', textTransform: 'uppercase' }}>Level 1 Open</span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 'bold', margin: '0.25rem 0' }}>Basic</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', minHeight: '3rem' }}>Great for absolute beginners to check phonetics and practice basic tracing.</p>
          <div style={{ margin: '1.5rem 0' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 'bold' }}>$0</span>
            <span style={{ fontSize: '0.88rem', color: 'var(--ink-soft)' }}> / forever free</span>
          </div>
          
          <ul style={{ paddingLeft: '1.2rem', fontSize: '0.88rem', color: 'var(--ink-soft)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2.5rem', flexGrow: 1 }}>
            <li>14 basic consonants tracing</li>
            <li>Interactive vector canvases</li>
            <li>Browser audio voice listening</li>
            <li>Chalkboard memory quizzes</li>
          </ul>

          <button 
            type="button" 
            className="edu-btn-secondary-3d" 
            style={{ width: '100%' }}
            onClick={() => handleSelectPlan('basic')}
          >
            Start Free Tracing
          </button>
        </div>

        {/* Standard Plan */}
        <div className="edu-card-chunky" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '2.5rem 2rem', borderColor: 'var(--teal)', borderBottomColor: 'var(--teal-deep)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--teal-deep)', textTransform: 'uppercase' }}>Most Popular</span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 'bold', margin: '0.25rem 0' }}>Standard</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', minHeight: '3rem' }}>Perfect for intermediate students seeking real conversation fluency and offline book packages.</p>
          <div style={{ margin: '1.5rem 0' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 'bold' }}>$19</span>
            <span style={{ fontSize: '0.88rem', color: 'var(--ink-soft)' }}> / month</span>
          </div>
          
          <ul style={{ paddingLeft: '1.2rem', fontSize: '0.88rem', color: 'var(--ink-soft)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2.5rem', flexGrow: 1 }}>
            <li>All vowels & compound letters</li>
            <li>4 Mnemonic physical workbooks</li>
            <li>170+ association stickers</li>
            <li>Level 2 daily conversations</li>
            <li>Audio speech translation</li>
          </ul>

          <button 
            type="button" 
            className="edu-btn-3d" 
            style={{ width: '100%' }}
            onClick={() => handleSelectPlan('standard')}
          >
            Select Standard
          </button>
        </div>

        {/* Premium Coaching Plan */}
        <div className="edu-card-chunky" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '2.5rem 2rem', borderColor: 'var(--ember)', borderBottomColor: '#8a3c17' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--ember)', textTransform: 'uppercase' }}>Elite Tutor Bridge</span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 'bold', margin: '0.25rem 0' }}>Coaching</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', minHeight: '3rem' }}>Accelerate advanced reading and get direct supervision from native tutors.</p>
          <div style={{ margin: '1.5rem 0' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 'bold' }}>$89</span>
            <span style={{ fontSize: '0.88rem', color: 'var(--ink-soft)' }}> / month</span>
          </div>
          
          <ul style={{ paddingLeft: '1.2rem', fontSize: '0.88rem', color: 'var(--ink-soft)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2.5rem', flexGrow: 1 }}>
            <li>1:1 Seoul National Univ Tutors</li>
            <li>24/7 personal chat matching</li>
            <li>Hanja root etymology maps</li>
            <li>Real-world news reading</li>
            <li>Graduation certificate PDF</li>
          </ul>

          <button 
            type="button" 
            className="edu-btn-ember-3d" 
            style={{ width: '100%' }}
            onClick={() => handleSelectPlan('premium')}
          >
            Book Coaching
          </button>
        </div>

      </div>

      {/* SECTION 2: CONSULTATION INQUIRY FORM */}
      <div id="inquiry-form-section" style={{ scrollMarginTop: '2rem' }}>
        {submitted ? (
          <div style={{ animation: 'rise 0.4s ease both', background: '#e2f1f1', border: '2px solid var(--teal)', borderRadius: '28px', padding: '3.5rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>🐯</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 'bold', color: 'var(--teal-deep)' }}>
              Inquiry Registered Successfully!
            </h2>
            <p style={{ color: 'var(--ink-soft)', maxWidth: '32rem', margin: '0.75rem auto 2.5rem auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Thanks, <strong>{name}</strong>! We have registered your request for the <strong>{track.toUpperCase()} Plan</strong>. Our matching desk is preparing your tutor connection sheet. We will email you at <strong>{email}</strong> shortly.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/demo-hub" className="edu-btn-3d">Go to Classroom</Link>
              <a href="/" className="edu-btn-secondary-3d">Back to Home</a>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'start' }}>
            
            {/* Inquiry submission card */}
            <form onSubmit={onSubmit} className="edu-card-chunky" noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 'bold' }}>
                Consultation Request Form
              </h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.88rem', margin: 0 }}>
                Please fill in the information below. A coaching expert will design a personalized roadmap for your selected tier.
              </p>

              <div className="field">
                <label htmlFor="name" style={{ display: 'block', fontWeight: 'bold', fontSize: '0.88rem', marginBottom: '0.35rem' }}>Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--line)', borderRadius: '14px', background: '#fafbfd' }}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="email" style={{ display: 'block', fontWeight: 'bold', fontSize: '0.88rem', marginBottom: '0.35rem' }}>Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--line)', borderRadius: '14px', background: '#fafbfd' }}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="nativeLanguage" style={{ display: 'block', fontWeight: 'bold', fontSize: '0.88rem', marginBottom: '0.35rem' }}>Native Language</label>
                <input
                  id="nativeLanguage"
                  type="text"
                  placeholder="e.g. English, French, Japanese"
                  value={nativeLanguage}
                  onChange={(e) => setNativeLanguage(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--line)', borderRadius: '14px', background: '#fafbfd' }}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="track" style={{ display: 'block', fontWeight: 'bold', fontSize: '0.88rem', marginBottom: '0.35rem' }}>Selected Target Plan</label>
                <select
                  id="track"
                  value={track}
                  onChange={(e) => setTrack(e.target.value as Track)}
                  style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--line)', borderRadius: '14px', background: 'white' }}
                >
                  <option value="basic">Basic Plan (FreeConsonants Tracing)</option>
                  <option value="standard">Standard Plan ($19/mo Vowels & Workbooks)</option>
                  <option value="premium">Premium Coaching Plan ($89/mo 1:1 native tutor)</option>
                </select>
              </div>

              {error && (
                <p style={{ color: 'var(--ember)', background: 'rgba(196,92,38,0.1)', padding: '0.65rem 1rem', borderRadius: '12px', border: '1px solid var(--ember)', fontSize: '0.88rem', margin: 0 }}>
                  ⚠ {error}
                </p>
              )}

              <button type="submit" className="edu-btn-ember-3d" style={{ width: '100%', marginTop: '0.5rem' }}>
                Book My Consultation Session
              </button>
            </form>

            {/* Why consultation info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="edu-card-chunky">
                <span style={{ fontSize: '2.5rem' }}>📞</span>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', margin: '0.75rem 0 0.5rem 0', fontWeight: 'bold' }}>
                  What happens on the call?
                </h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
                  A native Korean literacy consultant will check your syllable tracing speed, assess your daily K-pop reading goals, and configure your standard physical workbook sticker shipment schedules.
                </p>
              </div>

              <div className="edu-card-chunky">
                <span style={{ fontSize: '2.5rem' }}>📦</span>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', margin: '0.75rem 0 0.5rem 0', fontWeight: 'bold' }}>
                  Textbook Kit Shipping
                </h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
                  Once your consultation call matches you to a plan, the textbooks are dispatched globally from our Seoul logistics desk. Track status live on the Admin panel.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  )
}
