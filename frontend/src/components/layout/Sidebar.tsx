'use client'

import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Home,
  LogOut,
  PiggyBank,
  Settings,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const menuItems = [
  {
    href: '/dashboard',
    label: 'Início',
    icon: Home
  },
  {
    href: '/transactions',
    label: 'Transações',
    icon: DollarSign
  },
  {
    href: '/cards',
    label: 'Cartões',
    icon: CreditCard
  },
  {
    href: '/analytics',
    label: 'Análises',
    icon: BarChart3
  },
  {
    href: '/goals',
    label: 'Metas',
    icon: PiggyBank
  },
  {
    href: '/settings',
    label: 'Configurações',
    icon: Settings
  }
]

export function Sidebar() {
  const { signOut, user } = useAuth()
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-card border-r h-screen">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Finance App</h2>
          <p className="text-sm text-muted-foreground mt-2">{user?.name}</p>
        </div>

        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {menuItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                    pathname === href 
                      ? 'bg-primary/10 text-primary hover:bg-primary/15'
                      : 'hover:bg-muted'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 mt-auto border-t">
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </div>
    </aside>
  )
} 