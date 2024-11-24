'use client'

import { ThemeToggle } from '../shared/ThemeToggle'
import { UserMenu } from '../shared/UserMenu'
import { useAuth } from '@/providers/auth'

export function Header() {
  const { user } = useAuth()

  return (
    <header className="h-16 border-b bg-card">
      <div className="h-full container flex items-center justify-between">
        <div>Logo</div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  )
} 