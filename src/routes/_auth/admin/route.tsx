import { NavUser } from "@/components/NavUser";
import { useAuth } from "@/context/AuthContext";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
  Bell,
  ChartNoAxesColumnIncreasing,
  Check,
  Clock,
  LayoutDashboard,
  Plus,
  SlidersHorizontal,
  User,
  Users,
} from "lucide-react";
import * as React from "react";
import { Ticket } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroupAction,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useLocation } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_auth/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="data-[slot=sidebar-menu-button]:!p-1.5"
                >
                  <Link to="/">
                    <Ticket className="!size-6 text-blue-600" />
                    <span className="text-base font-semibold">TicketAI</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === "/admin/dashboard"}
                    >
                      <Link to="/admin/dashboard">
                        <LayoutDashboard />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Tickets</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* pending tickets */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        location.pathname === "/admin/tickets/inprogress"
                      }
                    >
                      <Link to="/admin/tickets/inprogress">
                        <Clock />
                        <span>In Progress</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* resolved tickets */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === "/admin/tickets/resolved"}
                    >
                      <Link to="/admin/tickets/resolved">
                        <Check />
                        <span>Resolved Tickets</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Administration </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        location.pathname === "/admin/administration/analytics"
                      }
                    >
                      <Link to="/admin/administration/analytics">
                        <ChartNoAxesColumnIncreasing />
                        <span>Analytics</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem> */}

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        location.pathname ===
                        "/admin/administration/usermanagement"
                      }
                    >
                      <Link to="/admin/administration/usermanagement">
                        <Users />
                        <span>User Management</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        location.pathname === "/admin/administration/settings"
                      }
                    >
                      <Link to="/admin/administration/settings">
                        <SlidersHorizontal />
                        <span>System Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem> */}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <NavUser user={user} />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />

            <Bell className="ml-auto mr-4 h-6 w-6 text-muted-foreground" />
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
