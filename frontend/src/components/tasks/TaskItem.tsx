import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IconDotsVertical, IconPencil, IconTrash, IconCalendar, IconAlertCircle } from '@tabler/icons-react'
import { useTasks } from '@/hooks/useTasks'
import type { Task } from '@/types'
import { format, isPast, isToday } from 'date-fns'

interface TaskItemProps {
  task: Task
  onEdit: (task: Task) => void
}

export const TaskItem = ({ task, onEdit }: TaskItemProps) => {
  const { updateTask, deleteTask } = useTasks()

  const handleToggleComplete = (): void => {
    updateTask.mutate({
      id: task.id,
      data: { completed: !task.completed },
    })
  }

  const handleDelete = (): void => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask.mutate(task.id)
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={handleToggleComplete}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <h3
            className={`font-medium ${
              task.completed ? 'line-through text-muted-foreground' : ''
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {task.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant={task.completed ? 'secondary' : 'default'}>
              {task.completed ? 'Completed' : 'Pending'}
            </Badge>
            
            {task.dueDate && (
              <Badge
                variant="outline"
                className={
                  !task.completed && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
                    ? 'border-red-500 text-red-500'
                    : isToday(new Date(task.dueDate))
                    ? 'border-orange-500 text-orange-500'
                    : ''
                }
              >
                <IconCalendar className="h-3 w-3 mr-1" />
                {format(new Date(task.dueDate), 'MMM d')}
                {!task.completed && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && (
                  <IconAlertCircle className="h-3 w-3 ml-1" />
                )}
              </Badge>
            )}

            {task.categories?.map((tc) => (
              <Badge
                key={tc.category.id}
                variant="outline"
                style={{
                  borderColor: tc.category.color,
                  color: tc.category.color,
                }}
              >
                {tc.category.name}
              </Badge>
            ))}
            
            <span className="text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <IconDotsVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <IconPencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-600 focus:text-red-600"
            >
              <IconTrash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}
