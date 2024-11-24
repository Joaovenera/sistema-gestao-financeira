import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/lib/validations/auth'
import { useAuth } from '@/providers/auth'
import { toast } from 'react-hot-toast'
import type { LoginCredentials } from '@/types/auth'

export function useAuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function onSubmit(data: LoginCredentials) {
    try {
      setIsLoading(true)
      await signIn(data.email, data.password)
      toast.success('Login realizado com sucesso!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit)
  }
} 