'use client'

import { formatCurrency } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { Target, TrendingUp, TrendingDown } from 'lucide-react'

interface Goal {
  id: number
  name: string
  target: number
  current: number
  type: 'SAVING' | 'SPENDING' | 'INVESTMENT'
  deadline: string
}

interface GoalListProps {
  goals: Goal[]
}

export function GoalList({ goals }: GoalListProps) {
  function getGoalIcon(type: Goal['type']) {
    switch (type) {
      case 'SAVING':
        return <TrendingUp className="h-8 w-8 text-green-500" />
      case 'SPENDING':
        return <TrendingDown className="h-8 w-8 text-red-500" />
      case 'INVESTMENT':
        return <Target className="h-8 w-8 text-blue-500" />
    }
  }

  function getProgress(current: number, target: number) {
    return Math.min((current / target) * 100, 100)
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <div
          key={goal.id}
          className="p-4 rounded-lg border bg-card"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getGoalIcon(goal.type)}
              <div>
                <p className="font-medium">{goal.name}</p>
                <p className="text-sm text-muted-foreground">
                  Vence em {new Date(goal.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {formatCurrency(goal.current)} de {formatCurrency(goal.target)}
              </p>
              <p className="text-sm text-muted-foreground">
                {getProgress(goal.current, goal.target).toFixed(1)}% concluído
              </p>
            </div>
          </div>
          <Progress value={getProgress(goal.current, goal.target)} />
        </div>
      ))}

      {goals.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma meta cadastrada
        </div>
      )}
    </div>
  )
} 