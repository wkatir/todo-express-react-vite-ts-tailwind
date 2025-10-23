import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useTasks } from '@/hooks/useTasks'
import type { Task } from '@/types'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
})

type TaskFormData = z.infer<typeof taskSchema>

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task | null
}

export const TaskDialog = ({ open, onOpenChange, task }: TaskDialogProps) => {
  const { createTask, updateTask } = useTasks()
  const isEditing = !!task

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
    },
  })

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
      })
    } else {
      reset({ title: '', description: '' })
    }
  }, [task, reset])

  const onSubmit = (data: TaskFormData): void => {
    if (isEditing) {
      updateTask.mutate(
        { id: task.id, data },
        {
          onSuccess: () => {
            onOpenChange(false)
            reset()
          },
        }
      )
    } else {
      createTask.mutate(data, {
        onSuccess: () => {
          onOpenChange(false)
          reset()
        },
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Task' : 'New Task'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the details of your task'
              : 'Create a new task for your list'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g. Buy milk"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Additional details..."
              rows={4}
              {...register('description')}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTask.isPending || updateTask.isPending}
            >
              {isEditing ? 'Save' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
