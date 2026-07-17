import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'

export function Layout() {
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  return (
    <>
      <header className="site-header">
        <div className="shell nav">
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
          <ul id="primary-nav" className={`nav-links${open ? ' open' : ''}`}>
            <li>
              <NavLink to="/method" onClick={close}>
                Method
              </NavLink>
            </li>
            <li>
              <NavLink to="/program" onClick={close}>
                Curriculum
              </NavLink>
            </li>
            <li>
              <NavLink to="/lesson/hangul-demo" onClick={close}>
                Hangul Demo
              </NavLink>
            </li>
            <li>
              <NavLink to="/lesson/hanja-demo" onClick={close}>
                Hanja Demo
              </NavLink>
            </li>
            <li>
              <NavLink to="/board" onClick={close}>
                Community
              </NavLink>
            </li>
            <li>
              <NavLink to="/shop" onClick={close}>
                Store
              </NavLink>
            </li>
            <li>
              <NavLink to="/waitlist" className="nav-cta" onClick={close}>
                Consultation
              </NavLink>
            </li>
          </ul>
        </div>
      </header>
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
