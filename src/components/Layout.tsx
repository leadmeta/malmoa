import { NavLink, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'

export function Layout() {
  const [open, setOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [username, setUsername] = useState('John Doe')
  
  // Profile dropdown states
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [userEmail, setUserEmail] = useState('student@malmoa.edu')
  const [userTier, setUserTier] = useState('Beginner')
  const [paymentInfo, setPaymentInfo] = useState('None (Basic Free Tier)')

  const close = () => {
    setOpen(false)
    setShowProfileDropdown(false)
  }

  // Load and sync profile details
  const syncProfileDetails = () => {
    const saved = localStorage.getItem('malmoa-user-profile')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setUsername(parsed.name || 'John Doe')
        setUserTier(parsed.tier || 'Beginner')
        setUserEmail(parsed.name?.includes('Admin') ? 'admin@malmoa.edu' : 'student@malmoa.edu')
      } catch {
        // Ignore
      }
    }

    // Check payment history from orders list
    const savedOrders = localStorage.getItem('malmoa-orders')
    if (savedOrders) {
      try {
        const orders = JSON.parse(savedOrders)
        if (orders.length > 0) {
          const lastOrder = orders[orders.length - 1]
          setPaymentInfo(`${lastOrder.date} (${lastOrder.item})`)
        } else {
          setPaymentInfo('None (Basic Free Tier)')
        }
      } catch {
        setPaymentInfo('None (Basic Free Tier)')
      }
    } else {
      setPaymentInfo('None (Basic Free Tier)')
    }
  }

  useEffect(() => {
    syncProfileDetails()
  }, [showLoginModal, isLoggedIn])

  const handleMockLogin = (role: 'student' | 'admin') => {
    setIsLoggedIn(true)
    setShowLoginModal(false)
    if (role === 'admin') {
      const adminProfile = { name: 'Admin Teacher', xp: 950, tier: 'Advanced' }
      localStorage.setItem('malmoa-user-profile', JSON.stringify(adminProfile))
      setUsername('Admin Teacher')
      setUserTier('Advanced')
      setUserEmail('admin@malmoa.edu')
    } else {
      const studentProfile = { name: 'John Doe', xp: 120, tier: 'Beginner' }
      localStorage.setItem('malmoa-user-profile', JSON.stringify(studentProfile))
      setUsername('John Doe')
      setUserTier('Beginner')
      setUserEmail('student@malmoa.edu')
    }
    syncProfileDetails()
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setShowProfileDropdown(false)
  }

  // NavLink Active Styling capsule logic
  const getNavLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    backgroundColor: isActive ? 'color-mix(in srgb, var(--teal) 10%, white)' : 'transparent',
    color: isActive ? 'var(--teal-deep)' : 'var(--ink-soft)',
    padding: '0.45rem 1rem',
    borderRadius: '24px',
    fontWeight: 'bold',
    transition: 'all 0.25s ease',
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none'
  })

  return (
    <>
      <header className="site-header" style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--line)' }}>
        <div className="shell nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <NavLink to="/" className="brand" onClick={close}>
            Mal<span>moa</span>
          </NavLink>
          
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="primary-nav"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>

          <ul id="primary-nav" className={`nav-links${open ? ' open' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: 0, listStyle: 'none' }}>
            <li>
              <NavLink to="/curriculum" onClick={close} style={getNavLinkStyle}>
                📖 Course
              </NavLink>
            </li>
            <li>
              <NavLink to="/demo-hub" onClick={close} style={getNavLinkStyle}>
                ⚡ Classroom
              </NavLink>
            </li>
            <li>
              <NavLink to="/play-hub" onClick={close} style={getNavLinkStyle}>
                🎮 Play Zone
              </NavLink>
            </li>
            
            {/* Conditional Admin link visible to Admin role */}
            {isLoggedIn && username.includes('Admin') && (
              <li>
                <NavLink to="/admin" onClick={close} style={getNavLinkStyle}>
                  ⚙️ Admin Desk
                </NavLink>
              </li>
            )}

            <li>
              <NavLink to="/waitlist" onClick={close} style={getNavLinkStyle}>
                📋 Pricing & Inquiry
              </NavLink>
            </li>

            {/* Header Authentication / Profile Trigger */}
            <li style={{ marginLeft: '0.5rem', position: 'relative' }}>
              {!isLoggedIn ? (
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem', fontWeight: 'bold' }}
                  onClick={() => setShowLoginModal(true)}
                >
                  🔑 Login
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    style={{
                      background: 'color-mix(in srgb, var(--teal) 8%, white)',
                      border: '2px solid var(--teal)',
                      borderRadius: '16px',
                      padding: '0.45rem 1.1rem',
                      fontWeight: 'bold',
                      color: 'var(--teal-deep)',
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      transition: 'all 0.15s ease'
                    }}
                    onClick={() => {
                      syncProfileDetails()
                      setShowProfileDropdown((v) => !v)
                    }}
                  >
                    👤 {username.split(' ')[0]}
                  </button>
                  <button
                    type="button"
                    style={{ background: 'transparent', border: 'none', color: 'var(--ember)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>

                  {/* Student Details Dropdown Popover Card */}
                  {showProfileDropdown && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: '120%',
                      background: 'white',
                      border: '2px solid var(--line)',
                      borderBottom: '6px solid var(--line)',
                      borderRadius: '20px',
                      padding: '1.5rem',
                      width: '280px',
                      zIndex: 99999,
                      boxShadow: '0 20px 40px rgba(15,23,42,0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem',
                      animation: 'rise 0.2s ease both',
                      textAlign: 'left'
                    }}>
                      <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '0.75rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--teal)', fontWeight: 'bold', textTransform: 'uppercase' }}>STUDENT DOSSIER</span>
                        <h4 style={{ margin: '0.15rem 0 0 0', fontWeight: 800, color: 'var(--ink)', fontSize: '1.05rem' }}>{username}</h4>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', fontWeight: 'bold' }}>📧 Email Address</span>
                        <span style={{ fontSize: '0.88rem', color: 'var(--ink)', wordBreak: 'break-all' }}>{userEmail}</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', fontWeight: 'bold' }}>🎓 Current Course Level</span>
                        <span style={{ fontSize: '0.88rem', color: 'var(--teal-deep)', fontWeight: 'bold' }}>{userTier} Tier</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', fontWeight: 'bold' }}>💳 Active License Billing</span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--ink)', lineHeight: 1.4 }}>{paymentInfo}</span>
                      </div>
                      
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ width: '100%', padding: '0.4rem', fontSize: '0.78rem', marginTop: '0.25rem', borderRadius: '12px' }}
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        Close Panel
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          </ul>
        </div>
      </header>

      {/* Mock Authentication Modal Overlay */}
      {showLoginModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(26, 35, 50, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(4px)',
          animation: 'rise 0.25s ease both'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '28px',
            padding: '2.5rem',
            width: '100%',
            maxWidth: '380px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
            position: 'relative'
          }}>
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              style={{ position: 'absolute', top: '15px', right: '20px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--ink-soft)' }}
            >
              ×
            </button>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', textAlign: 'center', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              🔑 Secure Login
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', textAlign: 'center', marginBottom: '2rem', lineHeight: 1.4 }}>
              Sign up or log in to Malmoa to synchronise your XP points, unlock course packages, and join global rankboards.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button type="button" className="social-btn" onClick={() => handleMockLogin('student')}>
                <span style={{ fontSize: '1.15rem' }}>🌐</span> Continue with Google (Student)
              </button>
              <button type="button" className="social-btn" onClick={() => handleMockLogin('admin')}>
                <span style={{ fontSize: '1.15rem' }}>📧</span> Continue with Email (Admin)
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="shell footer-grid">
          <div>
            <div className="footer-brand">Malmoa</div>
            <p>
              Wadiz-crowdfunded picture & story association method for global learners. 
              Accelerating Korean literacy from Hangul fundamentals to deep Hanja vocabulary.
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem', opacity: 0.8 }}>
              Research since 2020. 2x Successful Wadiz Crowdfunding campaigns.
            </p>
            <p>© {new Date().getFullYear()} Malmoa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
