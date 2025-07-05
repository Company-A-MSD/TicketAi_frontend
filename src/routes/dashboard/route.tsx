import { AppSidebar } from "@/components/AppSidebar";
import { NavUser } from "@/components/NavUser";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
};

function RouteComponent() {
  const { user } = useAuth();
  if (!user) {
    return <div>Please log in to access the dashboard.</div>;
  }
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div>Main content header</div>
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