'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  name: string
  email: string
}

interface AuthContextData {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  const isAuthenticated = !!user

  async function signIn(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      })

      const { token, user } = response.data

      localStorage.setItem('@FinanceApp:token', token)
      api.defaults.headers['Authorization'] = `Bearer ${token}`

      setUser(user)
      router.push('/dashboard')
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    }
  }

  function signOut() {
    setUser(null)
    localStorage.removeItem('@FinanceApp:token')
    delete api.defaults.headers['Authorization']
    router.push('/login')
  }

  useEffect(() => {
    const token = localStorage.getItem('@FinanceApp:token')

    if (token) {
      api.defaults.headers['Authorization'] = `Bearer ${token}`
      api.get('/users/me').then(response => {
        setUser(response.data)
      })
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
} 