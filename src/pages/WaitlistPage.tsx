import { useState, useEffect, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { WAITLIST_KEY } from '../data/content'
import './InnerPages.css'

type Track = 'basic' | 'beginner' | 'intermediate' | 'advanced' | 'vip' | 'kit_basic' | 'kit_kids' | 'kit_minibook' | 'kit_allinone'
type BillingCycle = 'monthly' | 'annual' | 'once'
type PriceTab = 'digital' | 'coaching' | 'textbook'

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
  const location = useLocation()
  
  // Resolve navigation routing state safely
  const stateTrack = location.state?.selectedTrack as Track | undefined
  const stateTab = location.state?.selectedTab as PriceTab | undefined

  // Define tab state
  const [activeTab, setActiveTab] = useState<PriceTab>('digital')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [nativeLanguage, setNativeLanguage] = useState('')
  const [track, setTrack] = useState<Track>('intermediate')
  const [billing, setBilling] = useState<BillingCycle>('monthly')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Align parameters depending on user entry state
  useEffect(() => {
    let finalTab: PriceTab = 'digital'
    let finalBilling: BillingCycle = 'monthly'

    if (stateTrack) {
      setTrack(stateTrack)
      // Deduce tab from track type
      if (stateTrack === 'vip') {
        finalTab = 'coaching'
        finalBilling = 'monthly'
      } else if (stateTrack.startsWith('kit_')) {
        finalTab = 'textbook'
        finalBilling = 'once'
      } else {
        finalTab = 'digital'
        finalBilling = 'monthly'
      }
      setActiveTab(finalTab)
      setBilling(finalBilling)
    }
    
    // Explicit tab overwrite if sent
    if (stateTab) {
      setActiveTab(stateTab)
    }

    // Scroll directly to the reservation form section smoothly for direct call matching
    const formSec = document.getElementById('inquiry-form-section')
    if (formSec) {
      setTimeout(() => {
        formSec.scrollIntoView({ behavior: 'smooth' })
      }, 150)
    }
  }, [stateTrack, stateTab])

  // Adjust billing options automatically when tab changes
  const handleTabChange = (tab: PriceTab) => {
    setActiveTab(tab)
    if (tab === 'textbook') {
      setBilling('once')
      setTrack('kit_allinone')
    } else if (tab === 'coaching') {
      setBilling('monthly')
      setTrack('vip')
    } else {
      setBilling('monthly')
      setTrack('intermediate')
    }
  }

  // Handle plan card selection
  const handleSelectPlan = (selectedPlan: Track, tab: PriceTab) => {
    setTrack(selectedPlan)
    setActiveTab(tab)
    if (tab === 'textbook') {
      setBilling('once')
    } else {
      setBilling(billing === 'once' ? 'monthly' : billing)
    }

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
  const DIGITAL_PLANS = {
    beginner: {
      name: 'Beginner Class',
      monthlyPrice: 9,
      annualPrice: 8.1,
      desc: 'Unlock Level 1 basic consonants tracing boards and pronunciation checks.',
      badge: 'LEVEL 1',
      badgeColor: 'var(--teal)'
    },
    intermediate: {
      name: 'Intermediate Class',
      monthlyPrice: 24,
      annualPrice: 21.6,
      desc: 'All Level 2 conversations, vocabulary card structures & sticker workbooks.',
      badge: 'MOST POPULAR',
      badgeColor: 'var(--teal-deep)'
    },
    advanced: {
      name: 'Advanced Class',
      monthlyPrice: 49,
      annualPrice: 44.1,
      desc: 'Level 3 News editorial analysis, Sino-Korean Hanja root map networks.',
      badge: 'LITERACY PACK',
      badgeColor: '#7c3aed'
    }
  }

  const TEXTBOOK_KITS = {
    kit_basic: {
      name: 'Basic Textbook Pack',
      price: 39,
      desc: 'Includes primary textbook, standard study mask sheet, and initial basic consonant sticker sheets.',
      badge: 'SELF STUDY',
      badgeColor: '#475569',
      image: '/wadiz-assets/wadiz_42.png'
    },
    kit_kids: {
      name: 'Kids & Junior Pack',
      price: 59,
      desc: 'Optimized character worksheets, large tracking cards, and junior study shields for kids.',
      badge: 'FOR CHILDREN',
      badgeColor: 'var(--teal)',
      image: '/wadiz-assets/wadiz_43.png'
    },
    kit_minibook: {
      name: 'Pocket Minibook Pack',
      price: 29,
      desc: 'Portable pocket-sized vocabulary directories and keychain stroke cheat sheets.',
      badge: 'ON THE GO',
      badgeColor: '#7c3aed',
      image: '/wadiz-assets/wadiz_44.png'
    },
    kit_allinone: {
      name: 'Elite All-In-One Pack',
      price: 89,
      desc: 'Textbooks, workbook sets, bookmarks, mini directories, all 170+ sticker varieties, and certificate eligibility.',
      badge: 'BEST CHOICE',
      badgeColor: 'var(--ember)',
      image: '/wadiz-assets/wadiz_45.png'
    }
  }

  return (
    <div id="pricing-main-container" className="shell reveal" style={{ paddingBottom: '5rem', marginTop: '2.5rem', scrollMarginTop: '2rem' }}>
      
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

      {/* CLASSIFIED PRICING TABS (클래스별, 코칭별, 책구매별로 구분된 세련된 3열 탭) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => handleTabChange('digital')}
          style={{
            padding: '0.85rem 1.8rem',
            borderRadius: '16px',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            border: '2px solid var(--line)',
            background: activeTab === 'digital' ? 'var(--teal)' : 'white',
            color: activeTab === 'digital' ? 'white' : 'var(--ink)',
            borderColor: activeTab === 'digital' ? 'var(--teal-deep)' : 'var(--line)',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'digital' ? '0 8px 20px rgba(13,115,119,0.15)' : 'none'
          }}
        >
          🎓 Digital Classes
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('coaching')}
          style={{
            padding: '0.85rem 1.8rem',
            borderRadius: '16px',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            border: '2px solid var(--line)',
            background: activeTab === 'coaching' ? 'var(--teal)' : 'white',
            color: activeTab === 'coaching' ? 'white' : 'var(--ink)',
            borderColor: activeTab === 'coaching' ? 'var(--teal-deep)' : 'var(--line)',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'coaching' ? '0 8px 20px rgba(13,115,119,0.15)' : 'none'
          }}
        >
          👩‍🏫 1:1 Live Coaching
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('textbook')}
          style={{
            padding: '0.85rem 1.8rem',
            borderRadius: '16px',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            border: '2px solid var(--line)',
            background: activeTab === 'textbook' ? 'var(--teal)' : 'white',
            color: activeTab === 'textbook' ? 'white' : 'var(--ink)',
            borderColor: activeTab === 'textbook' ? 'var(--teal-deep)' : 'var(--line)',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'textbook' ? '0 8px 20px rgba(13,115,119,0.15)' : 'none'
          }}
        >
          📦 Physical Textbook Kits
        </button>
      </div>

      {/* BILLING CYCLE SWITCH - Only visible for Digital & Coaching tiers */}
      {activeTab !== 'textbook' && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '3.5rem', animation: 'rise 0.3s ease both' }}>
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
      )}

      {/* RENDER ACTIVE TAB PRICING MATRIX */}
      <div style={{ marginBottom: '5rem' }}>
        
        {/* TAB 1: DIGITAL CLASSES */}
        {activeTab === 'digital' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', animation: 'rise 0.4s ease both' }}>
            {Object.entries(DIGITAL_PLANS).map(([key, plan]) => {
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
                    padding: '2.5rem 2rem',
                    borderColor: isSelected ? 'var(--teal)' : 'var(--line)',
                    borderBottomColor: isSelected ? 'var(--teal-deep)' : 'var(--line)',
                    background: 'white',
                    position: 'relative'
                  }}
                >
                  <span style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '0.65rem', fontWeight: 'bold', color: 'white', background: plan.badgeColor, padding: '0.2rem 0.5rem', borderRadius: '8px' }}>
                    {plan.badge}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 'bold', marginTop: '0.5rem', marginBottom: '0.25rem' }}>{plan.name}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', minHeight: '3.5rem', lineHeight: 1.5 }}>{plan.desc}</p>
                  
                  <div style={{ margin: '1.25rem 0' }}>
                    <span style={{ fontSize: '2.4rem', fontWeight: 800 }}>${price}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                      {billing === 'monthly' ? ' / month' : ' / month (billed annually)'}
                    </span>
                  </div>
                  
                  <ul style={{ paddingLeft: '1.2rem', fontSize: '0.88rem', color: 'var(--ink-soft)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2.5rem', flexGrow: 1, lineHeight: 1.5 }}>
                    {key === 'beginner' && (
                      <>
                        <li>All 14 basic consonants included</li>
                        <li>Full interactive tracing stroke vectors</li>
                        <li>Automated scoring feedback & reviews</li>
                      </>
                    )}
                    {key === 'intermediate' && (
                      <>
                        <li>All basic vowels and complex syllables</li>
                        <li>Printed textbook kit globally shipped</li>
                        <li>170+ cartoon stickers library</li>
                        <li>Situation dialogues listening audio</li>
                      </>
                    )}
                    {key === 'advanced' && (
                      <>
                        <li>Etymology root network tree diagrams</li>
                        <li>Academic Hanja vocabulary lists</li>
                        <li>12 professional news clause templates</li>
                        <li>Typer raindrop game room access</li>
                      </>
                    )}
                  </ul>
                  <button type="button" className={isSelected ? 'edu-btn-3d' : 'edu-btn-secondary-3d'} style={{ width: '100%', padding: '0.8rem 0', fontSize: '0.95rem', borderRadius: '14px' }} onClick={() => handleSelectPlan(key as Track, 'digital')}>
                    {isSelected ? 'Selected Plan' : 'Select Plan'}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* TAB 2: 1:1 LIVE COACHING */}
        {activeTab === 'coaching' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', maxWidth: '580px', margin: '0 auto', animation: 'rise 0.4s ease both' }}>
            <div 
              className="edu-card-chunky" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                padding: '3rem 2.5rem',
                borderColor: track === 'vip' ? 'var(--teal)' : 'var(--line)',
                borderBottomColor: track === 'vip' ? 'var(--teal-deep)' : 'var(--line)',
                background: 'white',
                position: 'relative',
                textAlign: 'center'
              }}
            >
              <span style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '0.72rem', fontWeight: 'bold', color: 'white', background: 'var(--ember)', padding: '0.25rem 0.75rem', borderRadius: '8px' }}>
                BEST VALUE
              </span>
              <span style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👩‍🏫</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 'bold' }}>VIP Native 1-on-1 Coaching</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', maxWidth: '32rem', margin: '0.5rem auto 1.5rem auto', lineHeight: 1.6 }}>
                Directly matched with a certified native tutor from Top Universities in Seoul. Weekly writing homework grading and real-time conversation feedback.
              </p>
              
              <div style={{ margin: '1.5rem 0' }}>
                <span style={{ fontSize: '2.8rem', fontWeight: 800 }}>
                  ${billing === 'monthly' ? 99 : 89.1}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
                  {billing === 'monthly' ? ' / month' : ' / month (billed annually)'}
                </span>
              </div>
              
              <ul style={{ paddingLeft: '1.5rem', fontSize: '0.92rem', color: 'var(--ink-soft)', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '3rem', textAlign: 'left', maxWidth: '420px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
                <li><strong>2 Live Chat Classroom</strong> sessions per week</li>
                <li>Certified native tutors with language degrees</li>
                <li>Unlimited homework grading and correction notes</li>
                <li>All Advanced course textbooks and mini books included</li>
                <li>Customized curriculum based on your diagnostic results</li>
              </ul>
              
              <button type="button" className="edu-btn-3d" style={{ width: '100%', padding: '0.9rem 0', fontSize: '1rem', borderRadius: '16px' }} onClick={() => handleSelectPlan('vip', 'coaching')}>
                {track === 'vip' ? 'Selected for Booking' : 'Select VIP Plan'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: PHYSICAL TEXTBOOK KITS (단독 도서 구매) */}
        {activeTab === 'textbook' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.75rem', animation: 'rise 0.4s ease both' }}>
            {Object.entries(TEXTBOOK_KITS).map(([key, plan]) => {
              const isSelected = track === key
              
              return (
                <div 
                  key={key}
                  className="edu-card-chunky" 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: '100%', 
                    padding: '1.5rem',
                    borderColor: isSelected ? 'var(--teal)' : 'var(--line)',
                    borderBottomColor: isSelected ? 'var(--teal-deep)' : 'var(--line)',
                    background: 'white',
                    position: 'relative'
                  }}
                >
                  <span style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '0.62rem', fontWeight: 'bold', color: 'white', background: plan.badgeColor, padding: '0.2rem 0.5rem', borderRadius: '8px' }}>
                    {plan.badge}
                  </span>
                  
                  <img src={plan.image} alt={plan.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--line)', marginBottom: '1rem' }} />
                  
                  <h4 style={{ fontWeight: 'bold', fontSize: '1.05rem', marginBottom: '0.25rem' }}>{plan.name}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', lineHeight: 1.4, minHeight: '3.5rem', marginBottom: '1rem' }}>{plan.desc}</p>
                  
                  <div style={{ margin: '0.5rem 0 1.25rem 0' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>${plan.price}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--ink-soft)' }}> (one-time purchase)</span>
                  </div>
                  
                  <button type="button" className={isSelected ? 'edu-btn-3d' : 'edu-btn-secondary-3d'} style={{ width: '100%', padding: '0.65rem 0', fontSize: '0.88rem', borderRadius: '12px', marginTop: 'auto' }} onClick={() => handleSelectPlan(key as Track, 'textbook')}>
                    {isSelected ? 'Selected Pack' : 'Buy Pack'}
                  </button>
                </div>
              )
            })}
          </div>
        )}

      </div>

      {/* SECTION 2: GLOBAL TRANSACTION TRUST BADGES */}
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
                  onChange={(e) => {
                    const val = e.target.value as Track
                    setTrack(val)
                    // Auto switch active tab to match track selection
                    if (val.startsWith('kit_')) setActiveTab('textbook')
                    else if (val === 'vip') setActiveTab('coaching')
                    else setActiveTab('digital')
                  }}
                  style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--line)', borderRadius: '14px', background: 'white' }}
                >
                  <optgroup label="🎓 Digital Classes">
                    <option value="beginner">Beginner Class ($9/mo Tracing)</option>
                    <option value="intermediate">Intermediate Class ($24/mo Vowels & Workbooks)</option>
                    <option value="advanced">Advanced Class ($49/mo News & Hanja)</option>
                  </optgroup>
                  <optgroup label="👩‍🏫 1:1 Live Coaching">
                    <option value="vip">VIP Coaching ($99/mo Seoul Univ Tutor)</option>
                  </optgroup>
                  <optgroup label="📦 Physical Textbook Kits">
                    <option value="kit_basic">Basic Textbook Pack ($39 one-time)</option>
                    <option value="kit_kids">Kids & Junior Pack ($59 one-time)</option>
                    <option value="kit_minibook">Pocket Minibook Pack ($29 one-time)</option>
                    <option value="kit_allinone">Elite All-In-One Pack ($89 one-time)</option>
                  </optgroup>
                </select>
              </div>

              <div className="field">
                <label htmlFor="billing-select" style={{ display: 'block', fontWeight: 'bold', fontSize: '0.88rem', marginBottom: '0.35rem' }}>Preferred Billing Term</label>
                <select
                  id="billing-select"
                  value={billing}
                  onChange={(e) => setBilling(e.target.value as BillingCycle)}
                  style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--line)', borderRadius: '14px', background: 'white' }}
                  disabled={activeTab === 'textbook'}
                >
                  {activeTab === 'textbook' ? (
                    <option value="once">One-time single payment purchase</option>
                  ) : (
                    <>
                      <option value="monthly">Monthly Subscription Billing (Standard price)</option>
                      <option value="annual">Annual Subscription Billing (10% Discount applied)</option>
                    </>
                  )}
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
