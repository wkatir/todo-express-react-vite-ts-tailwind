import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from '@/components/ui/sonner'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

const RootLayout = () => {
  const location = useLocation()
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register'

  if (isAuthRoute) {
    return (
      <>
        <Outlet />
        <Toaster />
        <TanStackRouterDevtools />
      </>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 w-full">
        <Outlet />
        <Toaster />
        <TanStackRouterDevtools />
      </div>
    </SidebarProvider>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
