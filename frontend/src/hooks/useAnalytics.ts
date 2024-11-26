import useSWR from 'swr'
import { api } from '@/lib/api'

interface AnalyticsData {
  predictions: {
    income: number[]
    expense: number[]
    balance: number[]
    overview: any[]
  }
  confidence_score: number
  anomalies: Array<{
    transaction_id: number
    category_name: string
    amount: number
    date: string
    z_score: number
    average_amount: number
  }>
}

interface CategoryDistribution {
  name: string
  value: number
  percentage: number
}

export function useAnalytics() {
  const fetcher = async (url: string) => {
    try {
      const response = await api.get(url)
      return response.data
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      throw error
    }
  }

  const { data: predictions, error: predictionsError } = useSWR<AnalyticsData>(
    '/analytics/predictions',
    fetcher
  )

  const { data: anomalies, error: anomaliesError } = useSWR(
    '/analytics/anomalies',
    fetcher
  )

  const { data: categoryDistribution } = useSWR<CategoryDistribution[]>(
    '/analytics/categories',
    fetcher
  )

  return {
    predictions,
    anomalies,
    categoryDistribution,
    isLoading: !predictions && !predictionsError && !anomalies && !anomaliesError,
    isError: !!predictionsError || !!anomaliesError
  }
} 