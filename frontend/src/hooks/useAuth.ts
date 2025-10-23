import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import type { AuthResponse, LoginData, RegisterData } from '@/types'

export const useAuth = () => {
  const navigate = useNavigate()
  const { setAuth, clearAuth } = useAuthStore()

  const login = useMutation({
    mutationFn: async (data: LoginData): Promise<AuthResponse> => {
      const response = await api.post<AuthResponse>('/auth/login', data)
      return response.data
    },
    onSuccess: (data: AuthResponse) => {
      setAuth(data.user, data.token)
      toast.success('Welcome back!')
      navigate({ to: '/tasks' })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to sign in')
    },
  })

  const register = useMutation({
    mutationFn: async (data: RegisterData): Promise<AuthResponse> => {
      const response = await api.post<AuthResponse>('/auth/register', data)
      return response.data
    },
    onSuccess: (data: AuthResponse) => {
      setAuth(data.user, data.token)
      toast.success('Account created successfully!')
      navigate({ to: '/tasks' })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create account')
    },
  })

  const logout = (): void => {
    clearAuth()
    toast.success('Logged out successfully')
    navigate({ to: '/login' })
  }

  return {
    login,
    register,
    logout,
  }
}
