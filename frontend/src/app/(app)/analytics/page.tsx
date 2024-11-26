'use client'

import { useAnalytics } from '@/hooks/useAnalytics'
import { Overview } from '@/components/analytics/Overview'
import { CategoryDistributionChart } from '@/components/analytics/CategoryDistributionChart'
import { FlowPrediction } from '@/components/analytics/FlowPrediction'
import { AnomalyDetection } from '@/components/analytics/AnomalyDetection'
import { Loader2 } from 'lucide-react'

export default function AnalyticsPage() {
  const { predictions, categoryDistribution, anomalies, isLoading } = useAnalytics()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const overviewData = predictions?.predictions ? [
    {
      name: 'Receitas',
      total: predictions.predictions.income.reduce((acc, curr) => acc + curr, 0)
    },
    {
      name: 'Despesas',
      total: predictions.predictions.expense.reduce((acc, curr) => acc + curr, 0)
    },
    {
      name: 'Saldo',
      total: predictions.predictions.balance.reduce((acc, curr) => acc + curr, 0)
    }
  ] : []

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Análises</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Overview data={overviewData} />
        <CategoryDistributionChart 
          data={categoryDistribution || []} 
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FlowPrediction 
          predictions={predictions?.predictions || { income: [], expense: [], balance: [] }}
          confidence_score={predictions?.confidence_score || 0}
        />
        {anomalies?.anomalies.length > 0 && (
          <AnomalyDetection anomalies={anomalies.anomalies} />
        )}
      </div>
    </div>
  )
} 