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
  sortField?: 'date' | 'amount' | 'description'
  filterType?: 'all' | 'INCOME' | 'EXPENSE'
  filterAmount?: 'all' | 'high' | 'low'
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

interface UpdateTransactionDTO {
  id: number
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
    sortField,
    filterType = 'all',
    filterAmount,
    page = 1,
    limit = 10
  } = params || {}

  const query = useQuery({
    queryKey: ['transactions', searchQuery, dateRange, sortOrder, sortField, filterType, filterAmount, page, limit],
    queryFn: async () => {
      try {
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

        if (filterAmount !== 'all') {
          const amounts = filteredTransactions.map(t => Number(t.amount))
          const median = amounts.reduce((a, b) => a + b, 0) / amounts.length

          filteredTransactions = filteredTransactions.filter(transaction => {
            const amount = Number(transaction.amount)
            return filterAmount === 'high' ? amount > median : amount <= median
          })
        }

        if (sortField) {
          filteredTransactions.sort((a, b) => {
            let comparison = 0
            
            switch (sortField) {
              case 'date':
                comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
                break
              case 'amount':
                comparison = Number(a.amount) - Number(b.amount)
                break
              case 'description':
                comparison = a.description.localeCompare(b.description)
                break
            }

            return sortOrder === 'asc' ? comparison : -comparison
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
    staleTime: 1000 * 30,
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
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

  const updateTransaction = useMutation({
    mutationFn: async (data: UpdateTransactionDTO) => {
      const response = await api.put(`/transactions/${data.id}`, data)
      return response.data
    },
    onSuccess: (updatedTransaction) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      
      queryClient.setQueryData<{ transactions: Transaction[]; total: number }>(['transactions'], (old) => {
        if (!old) return { transactions: [updatedTransaction], total: 1 }
        return {
          transactions: old.transactions.map(t => 
            t.id === updatedTransaction.id ? updatedTransaction : t
          ),
          total: old.total
        }
      })
    }
  })

  const deleteTransaction = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/transactions/${id}`)
      return id
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<{ transactions: Transaction[]; total: number }>(['transactions'], (old) => {
        if (!old) return { transactions: [], total: 0 }
        return {
          transactions: old.transactions.filter(t => t.id !== deletedId),
          total: old.total - 1
        }
      })
    }
  })

  return {
    transactions: query.data?.transactions || [],
    total: query.data?.total || 0,
    isLoading: query.isLoading && !query.data,
    error: query.error,
    refetch: query.refetch,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    isFetching: query.isFetching
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
} 