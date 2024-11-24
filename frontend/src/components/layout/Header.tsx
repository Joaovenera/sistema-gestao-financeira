import { useAuth } from '@/providers/auth'
import { ThemeToggle } from '../shared/ThemeToggle'
import { UserMenu } from '../shared/UserMenu'
import { NotificationBell } from '../shared/NotificationBell'

export function Header() {
  const { user } = useAuth()

  return (
    <header className="h-16 border-b bg-card">
      <div className="container h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Financial App</h1>
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell />
          <ThemeToggle />
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  )
} 