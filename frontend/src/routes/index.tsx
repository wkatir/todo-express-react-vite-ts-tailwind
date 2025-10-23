import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useAuthStore } from '@/store/authStore'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())

  if (isAuthenticated) {
    return <Navigate to="/tasks" />
  }

  return <Navigate to="/login" />
}
