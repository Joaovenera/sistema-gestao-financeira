'use client'

import { useAuth } from '@/providers/auth'
import Link from 'next/link'
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Home,
  LogOut,
  PieChart,
  Settings,
} from 'lucide-react'

export function Sidebar() {
  const { signOut } = useAuth()

  return (
    <aside className="w-64 h-screen bg-card border-r">
      <nav className="flex flex-col gap-6 p-6">
        <Link href="/dashboard" className="flex items-center gap-3 text-sm">
          <Home className="w-4 h-4" />
          Início
        </Link>
        <Link href="/transactions" className="flex items-center gap-3 text-sm">
          <DollarSign className="w-4 h-4" />
          Transações
        </Link>
        <Link href="/cards" className="flex items-center gap-3 text-sm">
          <CreditCard className="w-4 h-4" />
          Cartões
        </Link>
        <Link href="/analytics" className="flex items-center gap-3 text-sm">
          <BarChart3 className="w-4 h-4" />
          Análises
        </Link>
        <Link href="/categories" className="flex items-center gap-3 text-sm">
          <PieChart className="w-4 h-4" />
          Categorias
        </Link>
        <Link href="/settings" className="flex items-center gap-3 text-sm">
          <Settings className="w-4 h-4" />
          Configurações
        </Link>
        <button
          onClick={signOut}
          className="flex items-center gap-3 text-sm text-red-500"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </nav>
    </aside>
  )
} 