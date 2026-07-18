import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { WAITLIST_KEY } from '../data/content'
import './InnerPages.css'

type Track = 'basic' | 'beginner' | 'intermediate' | 'advanced' | 'vip'
type BillingCycle = 'monthly' | 'annual'

type WaitlistEntry = {
  name: string
  email: string
  nativeLanguage: string
  track: Track
  billing: BillingCycle
  createdAt: string
  status: string
}

export function WaitlistPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [nativeLanguage, setNativeLanguage] = useState('')
  const [track, setTrack] = useState<Track>('intermediate')
  const [billing, setBilling] = useState<BillingCycle>('monthly')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Handle plan card click to focus and select interest track
  const handleSelectPlan = (selectedPlan: Track) => {
    setTrack(selectedPlan)
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
      billing,
      createdAt: new Date().toISOString(),
      status: 'Processing'
    }

    try {
      // 1. Save to waitlist locally
      const raw = localStorage.getItem(WAITLIST_KEY)
      const list: WaitlistEntry[] = raw ? (JSON.parse(raw) as WaitlistEntry[]) : []
      const withoutDup = list.filter((item) => item.email !== entry.email)
      withoutDup.push(entry)
      localStorage.setItem(WAITLIST_KEY, JSON.stringify(withoutDup))

      // 2. Register order desk matching
      const savedOrders = localStorage.getItem('malmoa-orders')
      let orders = []
      if (savedOrders) {
        try { orders = JSON.parse(savedOrders) } catch { }
      }
      orders.push({
        id: `waitord-${Date.now()}`,
        item: `SaaS Premium Plan: ${track.toUpperCase()} (${billing.toUpperCase()})`,
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

  // PRICING DATABASE
  const PLANS = {
    basic: {
      name: 'Free Trial',
      monthlyPrice: 0,
      annualPrice: 0,
      desc: 'Test out basic tracing templates with native Korean speech synthesis.',
      badge: 'GUEST PLAY',
      badgeColor: '#475569'
    },
    beginner: {
      name: 'Beginner Class',
      monthlyPrice: 9,
      annualPrice: 8.1, // 10% discount
      desc: 'Unlock Level 1 basic consonants tracing boards and pronunciation checks.',
      badge: 'LEVEL 1',
      badgeColor: 'var(--teal)'
    },
    intermediate: {
      name: 'Intermediate Class',
      monthlyPrice: 24,
      annualPrice: 21.6, // 10% discount
      desc: 'All Level 2 conversations, vocabulary card structures & sticker workbooks.',
      badge: 'MOST POPULAR',
      badgeColor: 'var(--teal-deep)'
    },
    advanced: {
      name: 'Advanced Class',
      monthlyPrice: 49,
      annualPrice: 44.1, // 10% discount
      desc: 'Level 3 News editorial analysis, Sino-Korean Hanja root map networks.',
      badge: 'LITERACY PACK',
      badgeColor: '#7c3aed'
    },
    vip: {
      name: 'VIP Coaching',
      monthlyPrice: 99,
      annualPrice: 89.1, // 10% discount
      desc: '1:1 custom tutor matched, weekly homework review and live chat matching.',
      badge: 'BEST VALUE',
      badgeColor: 'var(--ember)'
    }
  }

  return (
    <div className="shell reveal" style={{ paddingBottom: '5rem', marginTop: '2.5rem' }}>
      
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <p className="section-label">Pricing Matrix</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', fontWeight: 800 }}>
          Flexible Plans for Learners Worldwide
        </h1>
        <p style={{ color: 'var(--ink-soft)', maxWidth: '38rem', margin: '0.75rem auto 0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Choose the class matching your current level. Pick annual billing to save 10% and get direct workbook shipment bonuses.
        </p>
      </div>

      {/* BILLING CYCLE SWITCH (연간/월간 10% 토글) */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
        <span style={{ fontSize: '0.95rem', fontWeight: billing === 'monthly' ? 'bold' : 'normal', color: billing === 'monthly' ? 'var(--ink)' : 'var(--ink-soft)' }}>
          Monthly Billing
        </span>
        <button
          type="button"
          onClick={() => setBilling((b) => b === 'monthly' ? 'annual' : 'monthly')}
          style={{
            width: '58px',
            height: '32px',
            borderRadius: '20px',
            background: 'var(--teal)',
            border: 'none',
            position: 'relative',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            transition: 'background 0.2s ease'
          }}
        >
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'white',
            transform: billing === 'annual' ? 'translateX(28px)' : 'translateX(2px)',
            transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }} />
        </button>
        <span style={{ fontSize: '0.95rem', fontWeight: billing === 'annual' ? 'bold' : 'normal', color: billing === 'annual' ? 'var(--ink)' : 'var(--ink-soft)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          Annual Billing
          <span style={{ background: '#fef3c7', color: 'var(--ember)', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.15rem 0.5rem', borderRadius: '10px', border: '1px solid #fcd34d' }}>
            Save 10%
          </span>
        </span>
      </div>

      {/* SECTION 1: GLOBAL SAAS PRICING MATRIX (5종 요금제 매트릭스) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
        
        {Object.entries(PLANS).map(([key, plan]) => {
          const isSelected = track === key
          const price = billing === 'monthly' ? plan.monthlyPrice : plan.annualPrice
          
          return (
            <div 
              key={key}
              className="edu-card-chunky" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%', 
                padding: '2rem 1.5rem',
                borderColor: isSelected ? 'var(--teal)' : 'var(--line)',
                borderBottomColor: isSelected ? 'var(--teal-deep)' : 'var(--line)',
                background: 'white',
                position: 'relative'
              }}
            >
              {/* Badges */}
              <span style={{ 
                position: 'absolute', 
                top: '15px', 
                right: '15px', 
                fontSize: '0.65rem', 
                fontWeight: 'bold', 
                color: 'white', 
                background: plan.badgeColor,
                padding: '0.2rem 0.5rem',
                borderRadius: '8px'
              }}>
                {plan.badge}
              </span>

              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 'bold', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
                {plan.name}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', minHeight: '3.5rem', lineHeight: 1.5 }}>
                {plan.desc}
              </p>
              
              <div style={{ margin: '1rem 0' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800 }}>${price}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
                  {billing === 'monthly' ? ' / mo' : ' / mo (billed yearly)'}
                </span>
              </div>
              
              <ul style={{ paddingLeft: '1.1rem', fontSize: '0.8rem', color: 'var(--ink-soft)', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '2rem', flexGrow: 1, lineHeight: 1.4 }}>
                {key === 'basic' && (
                  <>
                    <li>4 consonants tracing</li>
                    <li>Audio pronunciation</li>
                    <li>Memory quizzes</li>
                  </>
                )}
                {key === 'beginner' && (
                  <>
                    <li>All 14 consonants</li>
                    <li>Full tracing vectors</li>
                    <li>Interactive reviews</li>
                  </>
                )}
                {key === 'intermediate' && (
                  <>
                    <li>All vowels included</li>
                    <li>Workbook shipping</li>
                    <li>170+ stickers pack</li>
                    <li>Dialogue audio</li>
                  </>
                )}
                {key === 'advanced' && (
                  <>
                    <li>Hanja root etymology</li>
                    <li>News editorial clauses</li>
                    <li>Sinusoidal typing game</li>
                    <li>Certificate PDF</li>
                  </>
                )}
                {key === 'vip' && (
                  <>
                    <li>1:1 Seoul Univ Tutors</li>
                    <li>Live matching sandbox</li>
                    <li>24/7 chat assistance</li>
                    <li>Custom homework checking</li>
                  </>
                )}
              </ul>

              <button 
                type="button" 
                className={isSelected ? 'edu-btn-3d' : 'edu-btn-secondary-3d'}
                style={{ width: '100%', padding: '0.65rem 0', fontSize: '0.9rem', borderRadius: '12px' }}
                onClick={() => handleSelectPlan(key as Track)}
              >
                {isSelected ? 'Selected' : 'Select Plan'}
              </button>
            </div>
          )
        })}

      </div>

      {/* SECTION 2: GLOBAL TRANSACTION TRUST BADGES (글로벌 규격 보안 안내) */}
      <div style={{ background: '#f1f5f9', borderRadius: '20px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '5rem', border: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🔒</span>
          <span style={{ fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--ink-soft)' }}>
            SSL Encrypted Secure Global Payment Gateway
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <span style={{ background: 'white', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.65rem', borderRadius: '8px', border: '1px solid var(--line)' }}>💳 Visa</span>
          <span style={{ background: 'white', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.65rem', borderRadius: '8px', border: '1px solid var(--line)' }}>💳 Mastercard</span>
          <span style={{ background: 'white', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.65rem', borderRadius: '8px', border: '1px solid var(--line)' }}>💳 Stripe Pay</span>
          <span style={{ background: 'white', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.65rem', borderRadius: '8px', border: '1px solid var(--line)' }}>💳 Apple Pay</span>
        </div>
      </div>

      {/* SECTION 3: CONSULTATION INQUIRY FORM */}
      <div id="inquiry-form-section" style={{ scrollMarginTop: '2rem' }}>
        {submitted ? (
          <div style={{ animation: 'rise 0.4s ease both', background: '#e2f1f1', border: '2px solid var(--teal)', borderRadius: '28px', padding: '3.5rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>🐯</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 'bold', color: 'var(--teal-deep)' }}>
              Inquiry Registered Successfully!
            </h2>
            <p style={{ color: 'var(--ink-soft)', maxWidth: '32rem', margin: '0.75rem auto 2.5rem auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Thanks, <strong>{name}</strong>! We have registered your request for the <strong>{track.toUpperCase()} Plan ({billing.toUpperCase()})</strong>. Our matching desk is preparing your tutor connection sheet. We will email you at <strong>{email}</strong> shortly.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/demo-hub" className="edu-btn-3d">Go to Classroom</Link>
              <a href="/" className="edu-btn-secondary-3d">Back to Home</a>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'start' }}>
            
            <form onSubmit={onSubmit} className="edu-card-chunky" noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'white' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 'bold' }}>
                Consultation Request Form
              </h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.88rem', margin: 0 }}>
                Please fill in the information below. A coaching expert will configure your selected subscription level.
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
                  <option value="basic">Free Trial (Basic Consonants Tracing)</option>
                  <option value="beginner">Beginner Class ($9/mo Tracing Boards)</option>
                  <option value="intermediate">Intermediate Class ($24/mo Vowels & Workbooks)</option>
                  <option value="advanced">Advanced Class ($49/mo News & Hanja)</option>
                  <option value="vip">VIP Coaching ($99/mo 1:1 Native Tutor matched)</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="billing-select" style={{ display: 'block', fontWeight: 'bold', fontSize: '0.88rem', marginBottom: '0.35rem' }}>Preferred Billing Term</label>
                <select
                  id="billing-select"
                  value={billing}
                  onChange={(e) => setBilling(e.target.value as BillingCycle)}
                  style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--line)', borderRadius: '14px', background: 'white' }}
                >
                  <option value="monthly">Monthly Subscription Billing (Standard price)</option>
                  <option value="annual">Annual Subscription Billing (10% Discount applied)</option>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="edu-card-chunky" style={{ background: 'white' }}>
                <span style={{ fontSize: '2.5rem' }}>📞</span>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', margin: '0.75rem 0 0.5rem 0', fontWeight: 'bold' }}>
                  What happens on the call?
                </h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
                  A native Korean literacy consultant will check your syllable tracing speed, assess your daily K-pop reading goals, and configure your standard physical workbook sticker shipment schedules.
                </p>
              </div>

              <div className="edu-card-chunky" style={{ background: 'white' }}>
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
