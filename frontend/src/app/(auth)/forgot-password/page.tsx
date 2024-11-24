'use client'

import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <ForgotPasswordForm />
      </div>
    </div>
  )
} 