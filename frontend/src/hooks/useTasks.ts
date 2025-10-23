import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'
import type { Task, CreateTaskData, UpdateTaskData } from '@/types'

export const useTasks = () => {
  const queryClient = useQueryClient()

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async (): Promise<Task[]> => {
      const response = await api.get<Task[]>('/tasks')
      return response.data
    },
  })

  const createTask = useMutation({
    mutationFn: async (data: CreateTaskData): Promise<Task> => {
      const response = await api.post<Task>('/tasks', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Task created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create task')
    },
  })

  const updateTask = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTaskData }): Promise<Task> => {
      const response = await api.put<Task>(`/tasks/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Task updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update task')
    },
  })

  const deleteTask = useMutation({
    mutationFn: async (id: string): Promise<string> => {
      await api.delete(`/tasks/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Task deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete task')
    },
  })

  return {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
  }
}
