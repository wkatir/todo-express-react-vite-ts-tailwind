import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'
import type { Task, CreateTaskData, UpdateTaskData, TasksResponse, TaskFilters, StatsResponse } from '@/types'

export const useTasks = (filters?: TaskFilters) => {
  const queryClient = useQueryClient()

  const queryParams = new URLSearchParams()
  if (filters?.status && filters.status !== 'all') queryParams.append('status', filters.status)
  if (filters?.search) queryParams.append('search', filters.search)
  if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy)
  if (filters?.order) queryParams.append('order', filters.order)
  if (filters?.page) queryParams.append('page', filters.page.toString())
  if (filters?.limit) queryParams.append('limit', filters.limit.toString())
  if (filters?.categoryId) queryParams.append('categoryId', filters.categoryId.toString())
  if (filters?.overdue) queryParams.append('overdue', 'true')

  const { data, isLoading } = useQuery<TasksResponse>({
    queryKey: ['tasks', filters],
    queryFn: async (): Promise<TasksResponse> => {
      const response = await api.get<TasksResponse>(`/tasks?${queryParams.toString()}`)
      return response.data
    },
  })

  const tasks = data?.tasks || []
  const pagination = data?.pagination

  const { data: stats } = useQuery<StatsResponse>({
    queryKey: ['task-stats'],
    queryFn: async (): Promise<StatsResponse> => {
      const response = await api.get<StatsResponse>('/tasks/stats')
      return response.data
    },
  })

  const createTask = useMutation({
    mutationFn: async (data: CreateTaskData): Promise<Task> => {
      const response = await api.post<{ task: Task; message: string }>('/tasks', data)
      return response.data.task
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Task created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create task')
    },
  })

  const updateTask = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateTaskData }): Promise<Task> => {
      const response = await api.put<{ task: Task; message: string }>(`/tasks/${id}`, data)
      return response.data.task
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Task updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update task')
    },
  })

  const deleteTask = useMutation({
    mutationFn: async (id: number): Promise<number> => {
      await api.delete(`/tasks/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Task deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete task')
    },
  })

  return {
    tasks,
    isLoading,
    pagination,
    stats,
    createTask,
    updateTask,
    deleteTask,
  }
}
