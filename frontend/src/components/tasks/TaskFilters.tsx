import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { IconSearch, IconX } from '@tabler/icons-react'
import { useCategories } from '@/hooks/useCategories'
import type { TaskFilters as TaskFiltersType } from '@/types'

interface TaskFiltersProps {
  filters: TaskFiltersType
  onFiltersChange: (filters: TaskFiltersType) => void
}

export const TaskFilters = ({ filters, onFiltersChange }: TaskFiltersProps) => {
  const { categories } = useCategories()

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
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={filters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Select value={filters.sortBy || 'createdAt'} onValueChange={(value) => updateFilter('sortBy', value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Date Created</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="dueDate">Due Date</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.order || 'desc'} onValueChange={(value) => updateFilter('order', value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-accent"
            onClick={clearFilters}
          >
            Clear Filters
            <IconX className="ml-1 h-3 w-3" />
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge
          variant={filters.overdue ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => updateFilter('overdue', !filters.overdue)}
        >
          Overdue
        </Badge>

        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={filters.categoryId === category.id ? 'default' : 'outline'}
            className="cursor-pointer"
            style={{
              backgroundColor: filters.categoryId === category.id ? category.color : 'transparent',
              borderColor: category.color,
              color: filters.categoryId === category.id ? 'white' : category.color,
            }}
            onClick={() => updateFilter('categoryId', filters.categoryId === category.id ? undefined : category.id)}
          >
            {category.name}
          </Badge>
        ))}
      </div>
    </div>
  )
}

