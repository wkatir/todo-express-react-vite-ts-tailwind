import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { TaskItem } from './TaskItem'
import { TaskDialog } from './TaskDialog'
import { TaskFilters } from './TaskFilters'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { IconPlus, IconLoader2, IconAlertCircle } from '@tabler/icons-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Pagination } from '@/components/ui/pagination'
import type { Task, TaskFilters as TaskFiltersType } from '@/types'

export const TaskList = () => {
  const [filters, setFilters] = useState<TaskFiltersType>({
    status: 'all',
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 10,
  })
  const { tasks, isLoading, pagination } = useTasks(filters)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleEdit = (task: Task): void => {
    setEditingTask(task)
    setDialogOpen(true)
  }

  const handleCloseDialog = (): void => {
    setDialogOpen(false)
    setEditingTask(null)
  }

  const handleStatusChange = (status: 'all' | 'completed' | 'pending') => {
    setFilters({ ...filters, status, page: 1 })
  }

  const taskArray = Array.isArray(tasks) ? tasks : []
  const pendingTasks = taskArray.filter((t) => !t.completed)
  const completedTasks = taskArray.filter((t) => t.completed)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Tasks</h2>
          {pagination && (
            <p className="text-muted-foreground">
              Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} tasks
            </p>
          )}
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <IconPlus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      <TaskFilters filters={filters} onFiltersChange={setFilters} />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : taskArray.length === 0 ? (
        <Alert>
          <IconAlertCircle className="h-4 w-4" />
          <AlertDescription>
            {filters.search || filters.categoryId || filters.overdue
              ? 'No tasks match your filters'
              : "You don't have any tasks yet. Create your first task!"}
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <Tabs value={filters.status || 'all'} onValueChange={(value) => handleStatusChange(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3 mt-4">
              {taskArray.map((task) => (
                <TaskItem key={task.id} task={task} onEdit={handleEdit} />
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-3 mt-4">
              {taskArray.map((task) => (
                <TaskItem key={task.id} task={task} onEdit={handleEdit} />
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-3 mt-4">
              {taskArray.map((task) => (
                <TaskItem key={task.id} task={task} onEdit={handleEdit} />
              ))}
            </TabsContent>
          </Tabs>

          {pagination && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(page) => setFilters({ ...filters, page })}
            />
          )}
        </>
      )}

      <TaskDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        task={editingTask}
      />
    </div>
  )
}
