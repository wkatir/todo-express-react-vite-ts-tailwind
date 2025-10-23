import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { IconSearch, IconX } from '@tabler/icons-react'
import type { TaskFilters as TaskFiltersType } from '@/types'

interface TaskFiltersProps {
  filters: TaskFiltersType
  onFiltersChange: (filters: TaskFiltersType) => void
}

export const TaskFilters = ({ filters, onFiltersChange }: TaskFiltersProps) => {

  const updateFilter = (key: keyof TaskFiltersType, value: any) => {
    onFiltersChange({ ...filters, [key]: value, page: 1 })
  }

  const clearFilters = () => {
    onFiltersChange({
      status: 'all',
      search: '',
      sortBy: 'createdAt',
      order: 'desc',
      page: 1,
      limit: 10,
    })
  }

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.categoryId || filters.overdue

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Select value={filters.status || 'all'} onValueChange={(value) => updateFilter('status', value)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.sortBy || 'createdAt'} onValueChange={(value) => updateFilter('sortBy', value)}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt">Date Created</SelectItem>
          <SelectItem value="title">Title</SelectItem>
          <SelectItem value="dueDate">Due Date</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.order || 'desc'} onValueChange={(value) => updateFilter('order', value)}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">Ascending</SelectItem>
          <SelectItem value="desc">Descending</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-10"
        >
          Clear
          <IconX size={12} className="ml-1" />
        </Button>
      )}
    </div>
  )
}

