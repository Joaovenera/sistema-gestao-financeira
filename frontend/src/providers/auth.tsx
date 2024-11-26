'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

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
  isLoading: boolean
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const checkAuth = useCallback(async () => {
    try {
      const cookies = document.cookie.split(';')
      const token = cookies.find(c => c.trim().startsWith('@FinanceApp:token='))?.split('=')[1]
      
      if (!token) {
        setUser(null)
        setIsLoading(false)
        return
      }

      api.defaults.headers['Authorization'] = `Bearer ${token}`
      const response = await api.get('/users/me')
      setUser(response.data)
    } catch (error) {
      console.error('Erro na verificação de autenticação:', error)
      setUser(null)
      document.cookie = '@FinanceApp:token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      delete api.defaults.headers['Authorization']
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      })

      const { token, user } = response.data

      document.cookie = `@FinanceApp:token=${token}; path=/; max-age=86400`
      api.defaults.headers['Authorization'] = `Bearer ${token}`
      setUser(user)
      
      return user
    } catch (error: any) {
      console.error('Erro no login:', error)
      throw new Error(error.response?.data?.message || 'Credenciais inválidas ou erro de conexão')
    }
  }

  const signOut = useCallback(() => {
    setUser(null)
    document.cookie = '@FinanceApp:token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    delete api.defaults.headers['Authorization']
    router.push('/login')
  }, [router])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        signIn, 
        signOut, 
        isAuthenticated: !!user, 
        isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
} 