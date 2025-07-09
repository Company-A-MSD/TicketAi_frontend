import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Ticket,
  Clock,
  Check,
  MoveDown,
  MoveUp,
  AlarmClock,
  ChartNoAxesColumn,
  Percent,
  User,
} from "lucide-react";
import apiClient from "@/lib/api";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/_auth/admin/dashboard")({
  component: RouteComponent,
});

type UserType = {
  id: string;
  email: string;
  name: string;
};
type TicketType = {
  ticket_id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  Created: string;
};

function RouteComponent() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }
  const [users, setusers] = useState<UserType[]>([]);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadusers = async () => {
    setLoading(true);
    setError("");

    try {
      const users = await apiClient.get<UserType[]>("/users");
      setusers(users.data);
    } catch (err: any) {
      setError("Failed to get all users");
    } finally {
      setLoading(false);
    }
  };
  const loadTickets = async () => {
    setLoading(true);
    setError("");

    try {
      const tickets = await apiClient.get<TicketType[]>("/tickets/all");
      console.log(tickets);

      setTickets(tickets.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to get tickets"
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadusers();
    loadTickets();
  }, []);
  const pendingTickets = tickets.filter(
    (ticket) =>
      ticket.status?.trim().toLowerCase().replace(/\s+/g, "") === "inprogress"
  );
const ResolvedTicketsToday = tickets.filter((ticket) => {
  const isComplete =
    ticket.status?.trim().toLowerCase().replace(/\s+/g, "") === "complete";

  const parsedTime = Date.parse(ticket.created_at);
  if (isNaN(parsedTime)) {
    console.warn("Invalid date:", ticket.created_at);
    return false;
  }

  const createdDate = new Date(parsedTime);
  const createdDateString = createdDate.toISOString().slice(0, 10);

  const todayString = new Date().toISOString().slice(0, 10);
  const isToday = createdDateString === todayString;

  return isComplete && isToday;
});

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto p-6 space-y-6 flex-grow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}!</p>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                In Progress
              </CardTitle>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTickets.length}</div>
              <p className="text-xs text-muted-foreground">
                Tickets being worked on
              </p>
              <p className="flex items-center text-xs text-green-500 font-bold">
                <MoveUp className="h-3 w-3" />
                10% from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                Resolved Today
              </CardTitle>
              <Check className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {ResolvedTicketsToday.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Tickets closed today
              </p>
              <p className="flex items-center text-xs text-green-500 font-bold">
                <MoveUp className="h-3 w-3" />
                25% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                Avg. Response Time
              </CardTitle>
              <AlarmClock className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.8h</div>
              <p className="text-xs text-muted-foreground">
                First response average
              </p>
              <p className="flex items-center text-xs text-red-500 font-bold">
                <MoveDown className="h-3 w-3" />
                8% of improvement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                Total Users
              </CardTitle>
              <Users className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                Registered customers
              </p>
              <p className="flex items-center text-xs text-green-500 font-bold">
                <MoveUp className="h-3 w-3" />
                7% this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                Ticket Distributions
              </CardTitle>
              <ChartNoAxesColumn className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">View chart</div>
              <p className="text-xs text-muted-foreground">by department</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                Resolution Rate
              </CardTitle>
              <Percent className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">90%</div>
              <p className="text-xs text-muted-foreground">
                Tickets resolved successfully
              </p>
              <p className="flex items-center text-xs text-green-500 font-bold">
                <MoveUp className="h-3 w-3" />
                3% improvement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                Customer Satisfaction
              </CardTitle>
              <User className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.5/5</div>
              <p className="text-xs text-muted-foreground">Based on feedback</p>
              <p className="flex items-center text-xs text-green-500 font-bold">
                <MoveUp className="h-3 w-3" />
                0.5 points increase
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
