import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Transaction, TransactionsResponse } from '@/types/transaction'

interface UseTransactionsParams {
  searchQuery?: string
  dateRange?: {
    from: Date | undefined
    to: Date | undefined
  }
  sortOrder?: 'asc' | 'desc'
  filterType?: 'all' | 'income' | 'expense'
  page?: number
  limit?: number
}

interface CreateTransactionDTO {
  type: 'INCOME' | 'EXPENSE'
  category_id: number
  amount: number
  description: string
  date: string
}

export function useTransactions(params?: UseTransactionsParams) {
  const {
    searchQuery = '',
    dateRange,
    sortOrder = 'desc',
    filterType = 'all',
    page = 1,
    limit = 10
  } = params || {}

  const query = useQuery({
    queryKey: ['transactions', searchQuery, dateRange, sortOrder, filterType, page, limit],
    queryFn: async () => {
      try {
        const response = await api.get<Transaction[]>('/transactions')
        return {
          transactions: response.data,
          total: response.data.length
        }
      } catch (error) {
        console.error('Erro ao buscar transações:', error)
        throw error
      }
    }
  })

  const createTransaction = useMutation({
    mutationFn: async (data: CreateTransactionDTO) => {
      const response = await api.post('/transactions', data)
      return response.data
    },
    onSuccess: () => {
      query.refetch()
    }
  })

  return {
    transactions: query.data?.transactions || [],
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    createTransaction
  }
} 