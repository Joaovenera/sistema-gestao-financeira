import { useAuth } from '@/providers/auth'
import { Button } from '../ui/button'
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Settings, 
  LogOut 
} from 'lucide-react'
import Link from 'next/link'

export function Sidebar() {
  const { signOut } = useAuth()

  return (
    <aside className="w-64 h-screen bg-card border-r">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Financial App</h1>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-start">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/transactions">
                <Button variant="ghost" className="w-full justify-start">
                  <Receipt className="mr-2 h-4 w-4" />
                  Transações
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/reports">
                <Button variant="ghost" className="w-full justify-start">
                  <PieChart className="mr-2 h-4 w-4" />
                  Relatórios
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/settings">
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </Button>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive"
            onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </aside>
  )
} 