import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import { IconLogout, IconChecklist } from '@tabler/icons-react'

export const Header = () => {
  const { logout } = useAuth()
  const user = useAuthStore((state) => state.user)

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconChecklist className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Task Manager</h1>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Hello, <span className="font-medium text-foreground">{user.name}</span>
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              <IconLogout className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
