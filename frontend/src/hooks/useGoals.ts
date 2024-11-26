import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'react-hot-toast'

interface Goal {
  id: number
  name: string
  target: number
  current: number
  type: 'SAVING' | 'SPENDING' | 'INVESTMENT'
  deadline: string
}

interface CreateGoalData {
  name: string
  target: number
  type: 'SAVING' | 'SPENDING' | 'INVESTMENT'
  deadline: string
}

export function useGoals() {
  const queryClient = useQueryClient()

  const { data: goals, isLoading } = useQuery<Goal[]>({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await api.get('/goals')
      return response.data
    }
  })

  const createGoal = useMutation({
    mutationFn: async (data: CreateGoalData) => {
      const response = await api.post('/goals', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      toast.success('Meta criada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao criar meta')
    }
  })

  return {
    goals,
    isLoading,
    createGoal
  }
} 