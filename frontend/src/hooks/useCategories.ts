import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Category } from '@/types'

export function useCategories() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories')
      return response.data
    }
  })

  return {
    categories,
    isLoading
  }
} 