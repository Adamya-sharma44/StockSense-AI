import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Layout = () => {
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="logo">
          <span className="logo-mark">SS</span>
          <span className="logo-text">StockSense AI</span>
        </div>
        <nav className="nav-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/analytics">Analytics</NavLink>
        </nav>
        <div className="user-section">
          {user && (
            <>
              <span className="user-name">{user.name}</span>
              <button className="btn-secondary" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <span>
          Built for modern retail inventory intelligence. Need help?{' '}
          <Link to="/dashboard">View recommendations</Link>
        </span>
      </footer>
    </div>
  )
}

export default Layout

