import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { TaskList } from '@/components/tasks/TaskList'

export const Route = createFileRoute('/tasks')({
  component: TasksPage,
})

function TasksPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <TaskList />
        </main>
      </div>
    </ProtectedRoute>
  )
}
