import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { TaskItem } from './TaskItem'
import { TaskDialog } from './TaskDialog'
import { TaskFilters } from './TaskFilters'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { IconPlus, IconLoader2, IconAlertCircle } from '@tabler/icons-react'
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

  const taskArray = Array.isArray(tasks) ? tasks : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {pagination && (
          <p className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} tasks
          </p>
        )}
        <Button onClick={() => setDialogOpen(true)} size="default">
          <IconPlus size={16} className="mr-2" />
          New Task
        </Button>
      </div>

      <TaskFilters filters={filters} onFiltersChange={setFilters} />

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <IconLoader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : taskArray.length === 0 ? (
        <Alert className="border-dashed">
          <IconAlertCircle size={16} />
          <AlertDescription>
            {filters.search || filters.categoryId || filters.overdue
              ? 'No tasks match your filters'
              : "You don't have any tasks yet. Create your first task!"}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-3">
          {taskArray.map((task) => (
            <TaskItem key={task.id} task={task} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        </div>
      )}

      <TaskDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        task={editingTask}
      />
    </div>
  )
}
