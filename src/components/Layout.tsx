import { NavLink, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'

export function Layout() {
  const [open, setOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [username, setUsername] = useState('John Doe')

  const close = () => setOpen(false)

  // Sync profile avatar nickname
  useEffect(() => {
    const saved = localStorage.getItem('malmoa-user-profile')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setUsername(parsed.name || 'John Doe')
      } catch {
        // Ignore
      }
    }
  }, [showLoginModal])

  const handleMockLogin = (role: 'student' | 'admin') => {
    setIsLoggedIn(true)
    setShowLoginModal(false)
    if (role === 'admin') {
      const adminProfile = { name: 'Admin Teacher', xp: 950, tier: 'Advanced' }
      localStorage.setItem('malmoa-user-profile', JSON.stringify(adminProfile))
      setUsername('Admin Teacher')
    } else {
      const studentProfile = { name: 'John Doe', xp: 120, tier: 'Beginner' }
      localStorage.setItem('malmoa-user-profile', JSON.stringify(studentProfile))
      setUsername('John Doe')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <>
      <header className="site-header">
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

          <ul id="primary-nav" className={`nav-links${open ? ' open' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', margin: 0, listStyle: 'none' }}>
            <li>
              <NavLink to="/curriculum" onClick={close}>
                📖 Course
              </NavLink>
            </li>
            <li>
              <NavLink to="/demo-hub" onClick={close}>
                ⚡ Classroom
              </NavLink>
            </li>
            <li>
              <NavLink to="/play-hub" onClick={close}>
                🎮 Play Zone
              </NavLink>
            </li>
            
            {/* Conditional Admin link only visible when logged in as admin */}
            {isLoggedIn && username.includes('Admin') && (
              <li>
                <NavLink to="/admin" onClick={close} style={{ color: 'var(--ember)', fontWeight: 'bold' }}>
                  ⚙️ Admin Desk
                </NavLink>
              </li>
            )}

            <li>
              <NavLink to="/waitlist" className="nav-cta" onClick={close}>
                Consultation
              </NavLink>
            </li>

            {/* Header Login Action Widget */}
            <li style={{ marginLeft: '0.5rem' }}>
              {!isLoggedIn ? (
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem 1.25rem', fontSize: '0.88rem', fontWeight: 'bold' }}
                  onClick={() => setShowLoginModal(true)}
                >
                  🔑 Login
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--ink-soft)' }}>
                    Hi, <strong>{username.split(' ')[0]}</strong>
                  </span>
                  <button
                    type="button"
                    style={{ background: 'transparent', border: 'none', color: 'var(--ember)', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
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
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', textAlign: 'center', marginBottom: '0.5rem' }}>
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
