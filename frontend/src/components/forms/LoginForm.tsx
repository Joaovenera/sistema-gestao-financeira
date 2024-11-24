'use client'

import { useAuthForm } from '@/hooks/useAuthForm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export function LoginForm() {
  const { form, isLoading, onSubmit } = useAuthForm()
  const { register, formState: { errors } } = form

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <p className="text-sm text-muted-foreground text-center">
          Entre com suas credenciais para acessar sua conta
        </p>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline block text-right"
          >
            Esqueceu sua senha?
          </Link>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
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
          <p className="text-sm text-muted-foreground text-center">
            Não tem uma conta?{' '}
            <Link
              href="/register"
              className="text-primary hover:underline"
            >
              Registre-se
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
} 