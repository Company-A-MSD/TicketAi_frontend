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

export const Route = createFileRoute("/_auth/employee")({
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
                      isActive={location.pathname === "/employee/dashboard"}
                    >
                      <Link to="/employee/dashboard">
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
                        location.pathname === "/employee/tickets/inprogress"
                      }
                    >
                      <Link to="/employee/tickets/inprogress">
                        <Clock />
                        <span>In Progress</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* resolved tickets */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        location.pathname === "/employee/tickets/resolved"
                      }
                    >
                      <Link to="/employee/tickets/resolved">
                        <Check />
                        <span>Resolved Tickets</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* <SidebarGroup>
              <SidebarGroupLabel>Administration </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        location.pathname ===
                        "/employee/administration/analytics"
                      }
                    >
                      <Link to="/employee/administration/analytics">
                        <ChartNoAxesColumnIncreasing />
                        <span>Analytics</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        location.pathname ===
                        "/employee/administration/settings"
                      }
                    >
                      <Link to="/employee/administration/settings">
                        <SlidersHorizontal />
                        <span>Account Setting</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup> */}
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
