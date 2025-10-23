export interface User {
  id: string
  name: string
  email: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  user_id: string
  created_at: string
  updated_at: string
}

export interface CreateTaskData {
  title: string
  description?: string
}

export interface UpdateTaskData {
  title?: string
  description?: string
  completed?: boolean
}

