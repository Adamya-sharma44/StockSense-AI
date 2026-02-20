import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('stocksense_token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const { data } = await authApi.me()
        setUser(data)
      } catch (err) {
        console.error('Auth init failed', err)
        localStorage.removeItem('stocksense_token')
        setToken(null)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [token])

  const login = async (email, password) => {
    const { data } = await authApi.login({ email, password })
    localStorage.setItem('stocksense_token', data.token)
    setToken(data.token)
    setUser(data.user)
  }

  const register = async (name, email, password) => {
    const { data } = await authApi.register({ name, email, password })
    localStorage.setItem('stocksense_token', data.token)
    setToken(data.token)
    setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem('stocksense_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

