import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { TaskList } from '@/components/tasks/TaskList'
import { TaskStats } from '@/components/tasks/TaskStats'
import { CategoryManager } from '@/components/tasks/CategoryManager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const Route = createFileRoute('/tasks')({
  component: TasksPage,
})

function TasksPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="grid w-full max-w-lg grid-cols-3 mb-8">
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks">
              <TaskList />
            </TabsContent>

            <TabsContent value="dashboard">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Dashboard</h2>
                  <p className="text-muted-foreground">
                    Track your productivity and task statistics
                  </p>
                </div>
                <TaskStats />
              </div>
            </TabsContent>

            <TabsContent value="categories">
              <CategoryManager />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  )
}
