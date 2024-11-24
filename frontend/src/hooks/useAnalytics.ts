import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface Category {
  name: string
  total: number
}

interface Predictions {
  balance: number
  income: number
  expenses: number
  savings: number
  overview: Array<{
    name: string
    total: number
  }>
  categories: Category[]
  predictions: {
    income: number[]
    expense: number[]
    balance: number[]
  }
  confidence_score: number
}

interface Anomaly {
  transaction_id: number
  category_name: string
  amount: number
  date: string
  z_score: number
  average_amount: number
}

interface AnomalyResponse {
  anomalies: Anomaly[]
  metadata: {
    total_analyzed: number
    anomalies_found: number
    threshold: number
    analysis_date: string
  }
}

interface Goal {
  id: number
  name: string
  target: number
  current: number
  type: 'SAVING' | 'SPENDING' | 'INVESTMENT'
  deadline: string
}

export function useAnalytics() {
  const { data: predictions, isLoading: isPredictionsLoading } = useQuery<Predictions>({
    queryKey: ['analytics/predictions'],
    queryFn: async () => {
      const response = await api.get('/analytics/predictions')
      return response.data
    }
  })

  const { data: anomalies, isLoading: isAnomaliesLoading } = useQuery<AnomalyResponse>({
    queryKey: ['analytics/anomalies'],
    queryFn: async () => {
      const response = await api.get('/analytics/anomalies')
      return response.data
    }
  })

  const { data: goals, isLoading: isGoalsLoading } = useQuery<Goal[]>({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await api.get('/goals')
      return response.data
    }
  })

  const { data: categoryDistribution, isLoading: isCategoryLoading } = useQuery({
    queryKey: ['analytics/categories'],
    queryFn: async () => {
      const response = await api.get('/analytics/categories')
      return response.data
    }
  })

  return {
    predictions,
    anomalies,
    goals,
    categoryDistribution,
    isLoading: isPredictionsLoading || isAnomaliesLoading || isGoalsLoading || isCategoryLoading
  }
} 