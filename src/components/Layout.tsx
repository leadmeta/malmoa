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
              <NavLink to="/program" onClick={close}>
                Program
              </NavLink>
            </li>
            <li>
              <NavLink to="/method" onClick={close}>
                Method
              </NavLink>
            </li>
            <li>
              <NavLink to="/lesson/hangul-demo" onClick={close}>
                Hangul demo
              </NavLink>
            </li>
            <li>
              <NavLink to="/lesson/hanja-demo" onClick={close}>
                Hanja demo
              </NavLink>
            </li>
            <li>
              <NavLink to="/waitlist" className="nav-cta" onClick={close}>
                Early access
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
              Picture-and-story Korean literacy for foreign learners —
              Hangul foundations to Hanja vocabulary.
            </p>
          </div>
          <p>© {new Date().getFullYear()} Malmoa. Research since 2020.</p>
        </div>
      </footer>
    </>
  )
}
