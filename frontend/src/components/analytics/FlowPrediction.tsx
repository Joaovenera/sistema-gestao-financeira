'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { TrendingDown, TrendingUp } from 'lucide-react'

interface FlowPredictionProps {
  predictions: {
    income: number[]
    expense: number[]
    balance: number[]
  }
  confidence_score: number
}

export function FlowPrediction({ predictions, confidence_score }: FlowPredictionProps) {
  const averageIncome = predictions.income.reduce((a, b) => a + b, 0) / predictions.income.length
  const averageExpense = predictions.expense.reduce((a, b) => a + b, 0) / predictions.expense.length
  const trend = averageIncome > averageExpense ? 'positive' : 'negative'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Previsão de Fluxo
          {trend === 'positive' ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Receita Média Prevista</p>
            <p className="text-2xl font-bold text-green-500">
              {formatCurrency(averageIncome)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Despesa Média Prevista</p>
            <p className="text-2xl font-bold text-red-500">
              {formatCurrency(averageExpense)}
            </p>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm font-medium">Índice de Confiança</p>
            <div className="mt-2 h-2 rounded-full bg-secondary">
              <div 
                className="h-full rounded-full bg-primary"
                style={{ width: `${confidence_score}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground text-right">
              {confidence_score.toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 