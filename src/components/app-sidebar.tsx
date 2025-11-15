import * as React from "react"
import { Link } from "react-router-dom"
import {
  IconHelp,
  IconLayoutDashboard,
  IconSettings,
  IconSTurnUp,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Beer } from "lucide-react"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconLayoutDashboard,
    },
    {
      title: "Painel de Controle",
      url: "/painel",
      icon: IconSTurnUp,
    },
    {
      title: "Configurações",
      url: "/settings",
      icon: IconSettings,
    },
  ],
  navSecondary: [
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5"
            >
              <Link to="/">
                <Beer className="size-10 text-amber-500" />
                <span className="text-base"><strong>Chopp</strong> Control</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}
