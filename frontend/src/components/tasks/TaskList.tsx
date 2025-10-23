import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { TaskItem } from './TaskItem'
import { TaskDialog } from './TaskDialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { IconPlus, IconLoader2, IconAlertCircle } from '@tabler/icons-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Task } from '@/types'

export const TaskList = () => {
  const { tasks, isLoading } = useTasks()
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

  const pendingTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Tasks</h2>
          <p className="text-muted-foreground">
            {pendingTasks.length} pending, {completedTasks.length} completed
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <IconPlus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <Alert>
          <IconAlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don&apos;t have any tasks yet. Create your first task!
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              All ({tasks.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3 mt-4">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={handleEdit} />
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-3 mt-4">
            {pendingTasks.length === 0 ? (
              <Alert>
                <IconAlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Great! You have no pending tasks.
                </AlertDescription>
              </Alert>
            ) : (
              pendingTasks.map((task) => (
                <TaskItem key={task.id} task={task} onEdit={handleEdit} />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3 mt-4">
            {completedTasks.length === 0 ? (
              <Alert>
                <IconAlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You haven&apos;t completed any tasks yet.
                </AlertDescription>
              </Alert>
            ) : (
              completedTasks.map((task) => (
                <TaskItem key={task.id} task={task} onEdit={handleEdit} />
              ))
            )}
          </TabsContent>
        </Tabs>
      )}

      <TaskDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        task={editingTask}
      />
    </div>
  )
}
