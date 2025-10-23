import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'
import type { Category } from '@/types'

export const useCategories = () => {
  const queryClient = useQueryClient()

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      const response = await api.get<{ categories: Category[] }>('/categories')
      return response.data.categories
    },
  })

  const createCategory = useMutation({
    mutationFn: async (data: { name: string; color?: string }): Promise<Category> => {
      const response = await api.post<{ category: Category }>('/categories', data)
      return response.data.category
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create category')
    },
  })

  const updateCategory = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { name?: string; color?: string } }): Promise<Category> => {
      const response = await api.put<{ category: Category }>(`/categories/${id}`, data)
      return response.data.category
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update category')
    },
  })

  const deleteCategory = useMutation({
    mutationFn: async (id: number): Promise<number> => {
      await api.delete(`/categories/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Category deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete category')
    },
  })

  return {
    categories,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}

