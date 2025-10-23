import { Card } from '@/components/ui/card'
import { IconCheck, IconClock, IconAlertCircle, IconList } from '@tabler/icons-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useTasks } from '@/hooks/useTasks'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'

export const TaskStats = () => {
  const { stats } = useTasks()

  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-20" />
          </Card>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.stats.total,
      icon: IconList,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-950',
    },
    {
      title: 'Completed',
      value: stats.stats.completed,
      icon: IconCheck,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-950',
    },
    {
      title: 'Pending',
      value: stats.stats.pending,
      icon: IconClock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-950',
    },
    {
      title: 'Overdue',
      value: stats.stats.overdue,
      icon: IconAlertCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-950',
    },
  ]

  const weeklyChartData = stats.weeklyData.map((item) => ({
    date: format(new Date(item.date), 'EEE'),
    tasks: item.count,
  }))

  const categoryChartData = stats.categoryStats.map((cat) => ({
    name: cat.name,
    value: cat.count,
    color: cat.color,
  }))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                {stat.title === 'Completed' && stats.stats.total > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.stats.completionRate}% completion rate
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tasks" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Tasks by Category</h3>
          {categoryChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              No categorized tasks yet
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

