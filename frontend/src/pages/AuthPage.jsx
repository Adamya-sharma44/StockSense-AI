import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AuthPage = ({ mode }) => {
  const isLogin = mode === 'login'
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isLogin) {
        await login(form.email, form.password)
      } else {
        await register(form.name, form.email, form.password)
      }
      navigate('/dashboard')
    } catch (err) {
      console.error('Auth error', err)
      const msg = err.response?.data?.message || 'Authentication failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{isLogin ? 'Welcome back' : 'Create your account'}</h1>
        <p className="auth-subtitle">
          StockSense AI predicts demand trends and helps you restock smarter.
        </p>
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
            />
          </div>
          {error && <div className="error-banner">{error}</div>}
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Please wait…' : isLogin ? 'Login' : 'Create account'}
          </button>
        </form>
        <p className="auth-toggle">
          {isLogin ? (
            <>
              Need an account? <a href="/register">Register</a>
            </>
          ) : (
            <>
              Already have an account? <a href="/login">Login</a>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

export default AuthPage

