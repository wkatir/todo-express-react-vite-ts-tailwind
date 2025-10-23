import * as React from "react"
import { Link } from "@tanstack/react-router"
import {
  IconInnerShadowTop,
  IconListDetails,
} from "@tabler/icons-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavUser } from "@/components/layout/nav-user"
import { useAuthStore } from "@/store/authStore"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "My Tasks",
      url: "/tasks",
      icon: IconListDetails,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((state) => state.user)

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/tasks">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Task Manager</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      {user && (
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
