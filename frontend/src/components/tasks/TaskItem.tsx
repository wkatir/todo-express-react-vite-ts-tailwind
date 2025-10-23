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

  const isOverdue = task.dueDate && !task.completed && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate))

  return (
    <Card className={`p-4 transition-colors hover:bg-accent/50 ${isOverdue ? 'border-red-200' : ''}`}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={handleToggleComplete}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-base ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {task.dueDate && (
              <Badge
                variant="outline"
                className={
                  isOverdue
                    ? 'border-red-500 text-red-500'
                    : isDueToday
                    ? 'border-orange-500 text-orange-500'
                    : ''
                }
              >
                <IconCalendar size={12} className="mr-1" />
                {format(new Date(task.dueDate), 'MMM d, yyyy')}
                {isOverdue && <IconAlertCircle size={12} className="ml-1" />}
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
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <IconDotsVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <IconPencil size={16} className="mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-600 focus:text-red-600"
            >
              <IconTrash size={16} className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}
