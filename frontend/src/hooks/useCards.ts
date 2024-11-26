import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'react-hot-toast'

interface Card {
  id: number
  name: string
  last_digits: string
  brand: string
  credit_limit: number
  closing_day: number
  due_day: number
}

interface CreateCardData {
  name: string
  last_digits: string
  brand: string
  credit_limit: number
  closing_day: number
  due_day: number
}

export function useCards() {
  const queryClient = useQueryClient()

  const { data: cards, isLoading } = useQuery<Card[]>({
    queryKey: ['cards'],
    queryFn: async () => {
      const response = await api.get('/cards')
      return response.data
    }
  })

  const createCard = useMutation({
    mutationFn: async (data: CreateCardData) => {
      const response = await api.post('/cards', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] })
      toast.success('Cartão criado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao criar cartão')
    }
  })

  return {
    cards,
    isLoading,
    createCard
  }
} 