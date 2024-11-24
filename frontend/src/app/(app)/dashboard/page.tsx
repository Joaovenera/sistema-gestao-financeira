'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransactions } from "@/hooks/useTransactions"
import { useAnalytics } from "@/hooks/useAnalytics"
import { formatCurrency } from "@/lib/utils"
import { Overview } from "@/components/analytics/Overview"
import { CategoryDistributionChart } from "@/components/analytics/CategoryDistributionChart"
import { FinancialGoals } from "@/components/analytics/FinancialGoals"
import { TransactionList } from "@/components/transactions/TransactionList"
import { FlowPrediction } from "@/components/analytics/FlowPrediction"
import { AnomalyDetection } from "@/components/analytics/AnomalyDetection"
import { Loader2, DollarSign, TrendingUp, TrendingDown, PiggyBank } from "lucide-react"

const CATEGORY_COLORS = [
  "#0ea5e9",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
]

export default function DashboardPage() {
  const { transactions, isLoading: isLoadingTransactions } = useTransactions()
  const { 
    predictions, 
    categoryDistribution,
    goals,
    anomalies,
    isLoading: isLoadingAnalytics 
  } = useAnalytics()

  const isLoading = isLoadingTransactions || isLoadingAnalytics

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(predictions?.balance || 0)}
            </div>
          </CardContent>
        </Card>
        {/* ... outros cards de métricas ... */}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={predictions?.overview || []} />
          </CardContent>
        </Card>

        <div className="col-span-3 space-y-6">
          <CategoryDistributionChart 
            data={categoryDistribution?.map((category, index) => ({
              name: category.name,
              value: category.total,
              color: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
            })) || []} 
          />
          <FlowPrediction
            predictions={predictions?.predictions || { income: [], expense: [], balance: [] }}
            confidence_score={predictions?.confidence_score || 0}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Metas Financeiras</CardTitle>
          </CardHeader>
          <CardContent>
            <FinancialGoals goals={goals || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimas Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionList transactions={transactions?.slice(0, 5) || []} />
          </CardContent>
        </Card>
      </div>

      {anomalies?.anomalies.length > 0 && (
        <AnomalyDetection anomalies={anomalies.anomalies} />
      )}
    </div>
  )
} 