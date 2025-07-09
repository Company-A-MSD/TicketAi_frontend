import apiClient from "@/lib/api";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { getBadgeStyle, timeSince } from "@/lib/utils";
import { Paperclip, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  created_by: string;
};

export const Route = createFileRoute("/_auth/admin/administration/user/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });

  const [singleuser, setSingleuser] = useState<UserType | null>(null);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const loadTickets = async () => {
    setLoading(true);
    setError("");

    try {
      const ticketsResponse = await apiClient.get<TicketType[]>(`/tickets/all`);
      const userTickets = ticketsResponse.data.filter(
        (ticket) => ticket.created_by === id
      );
      setTickets(userTickets);
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to get tickets"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.get<UserType>(`/users/${id}`);
      setSingleuser(response.data);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "response" in err
            ? (err as any).response?.data?.message ||
              (err as any).message ||
              "Failed to get user details"
            : "Failed to get user details";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadUser();
      loadTickets();
    }
  }, [id]);

  if (loading) return <div>Loading user data...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!singleuser) return <div>No user found.</div>;
  if (!tickets) return <div>No tickets found.</div>;

  return (
    <div className="flex flex-col gap-10">
      <Card className="self-start w-1/2">
        <CardHeader>
          <CardTitle>User Account</CardTitle>
          <CardDescription>
            Details about user-id: {singleuser.id}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  readOnly
                  value={singleuser.email}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Username</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Name"
                  readOnly
                  value={singleuser.name}
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold">All Tickets</h1>

        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <Card key={ticket.ticket_id}>
              <CardHeader className="flex flex-col md:flex-row md:justify-between">
                <div className="flex flex-col">
                  <CardTitle className="text-2xl font-bold">
                    {ticket.description}
                  </CardTitle>
                  <CardDescription>TKT-{ticket.ticket_id}</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">{ticket.status}</Badge>
                  <Badge style={getBadgeStyle(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div>
                  <p className="font-bold">From: {singleuser.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Created at: {ticket.created_at}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-red-500">{ticket.subject}</p>
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-5 h-5 text-muted-foreground" />
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-5 h-5 text-muted-foreground" />
                      <p className="text-xs">3</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">
            No tickets found for this user.
          </p>
        )}
      </div>
    </div>
  );
}
