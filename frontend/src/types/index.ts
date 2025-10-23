export interface User {
  id: number
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

export interface Category {
  id: number
  name: string
  color: string
  userId: number
  createdAt: string
  _count?: {
    tasks: number
  }
}

export interface TaskCategory {
  taskId: number
  categoryId: number
  category: Category
}

export interface Task {
  id: number
  title: string
  description?: string
  completed: boolean
  dueDate?: string
  userId: number
  createdAt: string
  updatedAt: string
  categories?: TaskCategory[]
}

export interface CreateTaskData {
  title: string
  description?: string
  dueDate?: string
  categoryIds?: number[]
}

export interface UpdateTaskData {
  title?: string
  description?: string
  completed?: boolean
  dueDate?: string
  categoryIds?: number[]
}

export interface TasksResponse {
  tasks: Task[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface TaskStats {
  total: number
  completed: number
  pending: number
  overdue: number
  completionRate: number
}

export interface CategoryStat {
  name: string
  count: number
  color: string
}

export interface WeeklyData {
  date: string
  count: number
}

export interface StatsResponse {
  stats: TaskStats
  weeklyData: WeeklyData[]
  categoryStats: CategoryStat[]
}

export interface TaskFilters {
  status?: 'completed' | 'pending' | 'all'
  search?: string
  sortBy?: 'createdAt' | 'title' | 'dueDate'
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
  categoryId?: number
  overdue?: boolean
}




