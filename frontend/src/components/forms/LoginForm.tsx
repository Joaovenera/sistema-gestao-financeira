'use client'

import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'react-hot-toast'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function LoginForm() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      
      const email = formData.get('email')
      const password = formData.get('password')

      if (!email || !password) {
        setError('Por favor, preencha todos os campos')
        return
      }

      await signIn(email as string, password as string)
      toast.success('Login realizado com sucesso!')
      router.push('/dashboard')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao fazer login')
      console.error('Erro no login:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border/40">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="text-sm text-red-500 font-medium">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              name="email"
              className="border-border/40"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              name="password"
              className="border-border/40"
              disabled={isLoading}
            />
          </div>
          <Link
            href="/esqueceu-senha"
            className="inline-block text-sm text-primary hover:text-primary/90 hover:underline"
          >
            Esqueceu sua senha?
          </Link>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

