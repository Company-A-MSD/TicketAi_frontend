import apiClient from "@/lib/api";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { NavUser } from "@/components/NavUser";
import { useAuth } from "@/context/AuthContext";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
  AlertCircleIcon,
  Bell,
  Check,
  CheckCircle2Icon,
  Clock,
  LayoutDashboard,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_auth/user")({
  component: RouteComponent,
});

function CreateTicketForm() {
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    channel: "",
  });
  const [loading, setloading] = useState(false);
  type AlertState = {
    type: "success" | "error";
    title: string;
    description: string;
  } | null;

  const [alert, setAlert] = useState<AlertState>(null);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setloading(true);
    setAlert(null);

    try {
      const res = await apiClient.post("/tickets/", formData);

      setAlert({
        type: "success",
        title: "Ticket created successfully!",
        description: res.data.message || "Your ticket has been submitted.",
      });

      setFormData({ subject: "", description: "", channel: "" });
    } catch (error:any) {
      setAlert({
        type: "error",
        title: "Ticket creation failed.",
        description:
          error.response?.data?.message ||
          "An unexpected error occurred. Please try again.",
      });
    } finally {
      setloading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {alert && (
        <Alert variant={alert.type === "error" ? "destructive" : "default"}>
          {alert.type === "success" ? (
            <CheckCircle2Icon className="h-4 w-4" />
          ) : (
            <AlertCircleIcon className="h-4 w-4" />
          )}
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input
          type="text"
          name="subject"
          placeholder="Enter ticket subject"
          required
          value={formData.subject}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          name="description"
          placeholder="Enter ticket description"
          required
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="channel">Channel</Label>
        <Input
          type="text"
          name="channel"
          placeholder="Enter ticket Channel"
          required
          value={formData.channel}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Ticket"}
        </Button>
      </div>
    </form>
  );
}

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
                      isActive={location.pathname === "/user/dashboard"}
                    >
                      <Link to="/user/dashboard">
                        <LayoutDashboard />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                  <SidebarGroup>
                    <SidebarGroupLabel className="flex justify-between items-center">
                      Tickets
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            <Plus className="w-4 h-4" />
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create New Ticket</DialogTitle>
                            <DialogDescription>
                              Fill in the details below to create a new ticket.
                            </DialogDescription>
                          </DialogHeader>
                          <CreateTicketForm />
                        </DialogContent>
                      </Dialog>
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                      <SidebarMenu>
                        {/* pending tickets */}
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            asChild
                            isActive={
                              location.pathname === "/user/tickets/pending"
                            }
                          >
                            <Link to="/user/tickets/pending">
                              <Clock />
                              <span>Pending Tickets</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        {/* resolved tickets */}
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            asChild
                            isActive={
                              location.pathname === "/user/tickets/resolved"
                            }
                          >
                            <Link to="/user/tickets/resolved">
                              <Check />
                              <span>Resolved Tickets</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === "/user/settings"}
                    >
                      <Link to="/user/settings">
                        <SlidersHorizontal />
                        <span>Account Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
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
