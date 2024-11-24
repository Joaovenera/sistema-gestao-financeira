import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Transaction } from '@/types'
import toast from 'react-hot-toast'

export function useTransactions(filters?: {
  startDate?: string
  endDate?: string
  category?: number
  type?: 'INCOME' | 'EXPENSE'
}) {
  const queryClient = useQueryClient()

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      const response = await api.get('/transactions', { params: filters })
      return response.data
    }
  })

  const createTransaction = useMutation({
    mutationFn: async (data: Omit<Transaction, 'id'>) => {
      const response = await api.post('/transactions', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Transação criada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao criar transação')
    }
  })

  return {
    transactions,
    isLoading,
    createTransaction
  }
} 