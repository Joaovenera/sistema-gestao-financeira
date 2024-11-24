import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('@FinancialApp:token')
    
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`
      
      api.get('/users/me')
        .then(response => {
          setUser(response.data)
        })
        .catch(() => {
          signOut()
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  async function signIn(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      })

      const { token, user } = response.data

      localStorage.setItem('@FinancialApp:token', token)
      api.defaults.headers.common.Authorization = `Bearer ${token}`

      setUser(user)
      router.push('/dashboard')
    } catch (error) {
      throw error
    }
  }

  function signOut() {
    localStorage.removeItem('@FinancialApp:token')
    delete api.defaults.headers.common.Authorization
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 