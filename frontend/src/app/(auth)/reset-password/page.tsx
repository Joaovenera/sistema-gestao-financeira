'use client'

import { ResetPasswordForm } from '@/components/forms/ResetPasswordForm'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <ResetPasswordForm />
      </div>
    </div>
  )
} 