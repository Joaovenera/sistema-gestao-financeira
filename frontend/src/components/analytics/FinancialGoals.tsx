'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"
import { Target, TrendingUp, TrendingDown } from "lucide-react"

interface Goal {
  id: number
  name: string
  target: number
  current: number
  type: 'SAVING' | 'SPENDING' | 'INVESTMENT'
  deadline: string
}

interface FinancialGoalsProps {
  goals: Goal[]
}

export function FinancialGoals({ goals }: FinancialGoalsProps) {
  function getGoalIcon(type: Goal['type']) {
    switch (type) {
      case 'SAVING':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'SPENDING':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case 'INVESTMENT':
        return <Target className="h-4 w-4 text-blue-500" />
    }
  }

  function getProgress(current: number, target: number) {
    return Math.min((current / target) * 100, 100)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metas Financeiras</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getGoalIcon(goal.type)}
                  <span className="font-medium">{goal.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(goal.deadline).toLocaleDateString()}
                </span>
              </div>
              <Progress value={getProgress(goal.current, goal.target)} />
              <div className="flex items-center justify-between text-sm">
                <span>
                  {formatCurrency(goal.current)} de {formatCurrency(goal.target)}
                </span>
                <span className="text-muted-foreground">
                  {getProgress(goal.current, goal.target).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 