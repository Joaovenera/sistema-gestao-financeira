'use client'

import { LoginForm } from '@/components/forms/LoginForm'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <LoginForm />
      </div>
    </div>
  )
} 