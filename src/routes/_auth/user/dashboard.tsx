import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { createFileRoute } from "@tanstack/react-router";
import { getBadgeStyle, timeSince } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import apiClient from "@/lib/api";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_auth/user/dashboard")({
  component: RouteComponent,
});

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
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true);
      setError("");

      try {
        const tickets = await apiClient.get<TicketType[]>("/tickets/");
        setTickets(tickets.data);
      } catch (err:any) {
        setError(
          err.response?.data?.message || err.message || "Failed to get tickets"
        );
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  const pendingTickets = tickets.filter(
  (ticket) => ticket.status?.trim().toLowerCase().replace(/\s+/g, '') === "inprogress"
);
  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status?.trim().toLowerCase().replace(/\s+/g, '') === "complete"
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto p-6 space-y-6 flex-grow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}!</p>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-8 gap-4">
          <div className="md:col-span-4 lg:col-span-6 flex flex-col gap-y-20">
            {/* Pending Tickets */}
            <div className="flex flex-col gap-y-10">
              <h1 className="text-2xl font-bold">Pending Tickets</h1>
              <Card className="flex flex-col gap-0">
                {pendingTickets.length === 0 ? (
                  <CardContent className="p-5">No pending tickets.</CardContent>
                ) : (
                  pendingTickets.map((ticket,index) => (
                    <CardContent
                         key={`${ticket.ticket_id}_${index}`}
                      className="bg-[#F0F0F0] mx-5 my-3 px-5 py-3 rounded-xl flex justify-between"
                    >
                      <div>
                        <p className="font-bold">{ticket.description}</p>
                        <p className="text-sm text-muted-foreground">
                          TKT-{ticket.ticket_id}
                        </p>
                      </div>
                      <div className="flex flex-col items-start gap-1">
                        <Badge style={getBadgeStyle(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {timeSince(new Date(ticket.created_at))}
                        </p>
                      </div>
                    </CardContent>
                  ))
                )}
              </Card>
            </div>

            {/* Resolved Tickets */}
            <div className="flex flex-col gap-y-10">
              <h1 className="text-2xl font-bold">Resolved Tickets</h1>
               <Card className="flex flex-col gap-0">
                {resolvedTickets.length === 0 ? (
                  <CardContent className="p-5">
                    No resolved tickets.
                  </CardContent>
                ) : (
                  resolvedTickets.map((ticket,index) => (
                    <CardContent
                       key={`${ticket.ticket_id}_${index}`}
                      className="bg-[#F0F0F0] mx-5 my-3 px-5 py-3 rounded-xl flex justify-between"
                    >
                      <div>
                        <p className="font-bold">{ticket.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {ticket.ticket_id}
                        </p>
                      </div>
                      <div className="flex flex-col items-start gap-1">
                        <Badge style={getBadgeStyle(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {timeSince(new Date(ticket.created_at))}
                        </p>
                      </div>
                    </CardContent>
                  ))
                )}
              </Card>
            </div>
          </div>

          <Card className="md:col-span-2 lg:col-span-2 self-start mt-19 ">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
              <CardTitle className="text-xl font-semibold">
                Support Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-5">
              <div className="flex flex-col gap-y-1">
                <p className="text-sm flex justify-between">
                  <span>Mon - Fri:</span>
                  <span>9.00AM-6.00PM</span>
                </p>
                <p className="text-sm flex justify-between">
                  <span> Saturday:</span>
                  <span>10.00AM-4.00PM</span>
                </p>
                <p className="text-sm flex justify-between">
                  <span>Sunday:</span>
                  <span>Closed</span>
                </p>
              </div>
              <hr className="border-t border-gray-300" />
              <div className="flex flex-col gap-5">
                <CardTitle className="text-xl font-semibold">
                  Emergency Support
                </CardTitle>
                <div className="flex flex-col gap-3 text-sm">
                  <p>For urgent issues outside business hours. Please call</p>
                  <p className="font-bold">+9411 250 6969</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
