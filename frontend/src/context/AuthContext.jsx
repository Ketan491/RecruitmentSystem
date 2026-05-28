/**
 * Global auth state — persisted in localStorage, restored on page refresh.
 * Uses /api/auth/me to validate the stored token.
 * useCallback memoises login/signup/logout so consumers don't re-render
 * unnecessarily when the auth object reference changes.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api, { authAPI } from '../utils/api'

const AuthContext = createContext(null)

function stripPassword(user) {
  if (!user) return null
  const safe = { ...user }
  delete safe.password
  return safe
}

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // On mount: restore session from stored token
  useEffect(() => {
    const stored = localStorage.getItem('token')
    if (!stored) { setLoading(false); return }

    api.defaults.headers.common['Authorization'] = `Bearer ${stored}`
    authAPI.getMe()
      .then((userData) => {
        setUser(stripPassword(userData))
        setToken(stored)
      })
      .catch(() => {
        // Token expired / invalid — clear silently, no redirect here
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
        setToken(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const { access_token, user: userData } = await authAPI.login(email, password)
    const safe = stripPassword(userData)
    setUser(safe)
    setToken(access_token)
    localStorage.setItem('token', access_token)
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    return safe
  }, [])

  const signup = useCallback(async (data) => {
    const { access_token, user: userData } = await authAPI.signup(data)
    const safe = stripPassword(userData)
    setUser(safe)
    setToken(access_token)
    localStorage.setItem('token', access_token)
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    return safe
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
  }, [])

  const updateUser = useCallback((partial) => {
    setUser((prev) => prev ? { ...prev, ...partial } : null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
