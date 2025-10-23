import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { IconCalendar, IconX } from '@tabler/icons-react'
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
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { useTasks } from '@/hooks/useTasks'
import { useCategories } from '@/hooks/useCategories'
import type { Task } from '@/types'
import { cn } from '@/lib/utils'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.date().optional().nullable(),
  categoryIds: z.array(z.number()).optional(),
})

type TaskFormData = z.infer<typeof taskSchema>

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task | null
}

export const TaskDialog = ({ open, onOpenChange, task }: TaskDialogProps) => {
  const { createTask, updateTask } = useTasks()
  const { categories } = useCategories()
  const isEditing = !!task
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      dueDate: task?.dueDate ? new Date(task.dueDate) : null,
      categoryIds: task?.categories?.map((tc) => tc.category.id) || [],
    },
  })

  useEffect(() => {
    if (task) {
      const catIds = task.categories?.map((tc) => tc.category.id) || []
      setSelectedCategories(catIds)
      reset({
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        categoryIds: catIds,
      })
    } else {
      setSelectedCategories([])
      reset({ title: '', description: '', dueDate: null, categoryIds: [] })
    }
  }, [task, reset])

  const toggleCategory = (categoryId: number) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId]
    setSelectedCategories(newSelected)
    setValue('categoryIds', newSelected)
  }

  const onSubmit = (data: TaskFormData): void => {
    const submitData = {
      ...data,
      dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
      categoryIds: selectedCategories,
    }
    
    if (isEditing) {
      updateTask.mutate(
        { id: task.id, data: submitData },
        {
          onSuccess: () => {
            onOpenChange(false)
            reset()
            setSelectedCategories([])
          },
        }
      )
    } else {
      createTask.mutate(submitData, {
        onSuccess: () => {
          onOpenChange(false)
          reset()
          setSelectedCategories([])
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
              rows={3}
              {...register('description')}
            />
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Controller
              control={control}
              name="dueDate"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <IconCalendar className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      initialFocus
                    />
                    {field.value && (
                      <div className="p-3 border-t">
                        <Button
                          variant="ghost"
                          className="w-full"
                          onClick={() => field.onChange(null)}
                        >
                          Clear date
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={selectedCategories.includes(category.id) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  style={{
                    backgroundColor: selectedCategories.includes(category.id) ? category.color : 'transparent',
                    borderColor: category.color,
                    color: selectedCategories.includes(category.id) ? 'white' : category.color,
                  }}
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.name}
                  {selectedCategories.includes(category.id) && (
                    <IconX className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground">No categories available</p>
              )}
            </div>
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
