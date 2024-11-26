import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Transaction, TransactionsResponse } from '@/types/transaction'
import { startOfDay, endOfDay } from 'date-fns'

interface UseTransactionsParams {
  searchQuery?: string
  dateRange?: {
    from: Date | undefined
    to: Date | undefined
  }
  sortOrder?: 'asc' | 'desc'
  filterType?: 'all' | 'INCOME' | 'EXPENSE'
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
  const queryClient = useQueryClient()
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
        const cachedData = queryClient.getQueryData<{ transactions: Transaction[]; total: number }>(['transactions'])
        
        const response = await api.get<Transaction[]>('/transactions')
        let filteredTransactions = response.data

        if (searchQuery.trim() || filterType !== 'all' || dateRange?.from || dateRange?.to) {
          filteredTransactions = filteredTransactions.filter(transaction => {
            const matchesSearch = !searchQuery.trim() || [
              transaction.description.toLowerCase(),
              transaction.category_name.toLowerCase(),
              formatCurrency(Number(transaction.amount)),
              new Date(transaction.date).toLocaleDateString()
            ].some(field => field.includes(searchQuery.toLowerCase().trim()))

            const matchesType = filterType === 'all' || transaction.type === filterType

            const transactionDate = new Date(transaction.date)
            const matchesDate = (!dateRange?.from || transactionDate >= startOfDay(dateRange.from)) &&
                              (!dateRange?.to || transactionDate <= endOfDay(dateRange.to))

            return matchesSearch && matchesType && matchesDate
          })
        }

        if (sortOrder) {
          filteredTransactions.sort((a, b) => {
            const dateA = new Date(a.date).getTime()
            const dateB = new Date(b.date).getTime()
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
          })
        }

        return {
          transactions: filteredTransactions,
          total: filteredTransactions.length
        }
      } catch (error) {
        console.error('Erro ao buscar transações:', error)
        throw error
      }
    },
    staleTime: 1000 * 30, // Cache por 30 segundos
    placeholderData: (previousData) => previousData, // Mantém dados anteriores durante a atualização
    refetchOnWindowFocus: false, // Evita recargas desnecessárias
  })

  const createTransaction = useMutation({
    mutationFn: async (data: CreateTransactionDTO) => {
      const response = await api.post('/transactions', data)
      return response.data
    },
    onSuccess: (newTransaction) => {
      queryClient.setQueryData<{ transactions: Transaction[]; total: number }>(['transactions'], (old) => {
        if (!old) return { transactions: [newTransaction], total: 1 }
        return {
          transactions: [newTransaction, ...old.transactions],
          total: old.total + 1
        }
      })
    }
  })

  return {
    transactions: query.data?.transactions || [],
    total: query.data?.total || 0,
    isLoading: query.isLoading && !query.data, // Só mostra loading se não tiver dados
    error: query.error,
    refetch: query.refetch,
    createTransaction,
    isFetching: query.isFetching
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
} 