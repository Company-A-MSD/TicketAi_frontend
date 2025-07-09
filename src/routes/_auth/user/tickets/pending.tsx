import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import apiClient from "@/lib/api";
import { getBadgeStyle, timeSince } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@radix-ui/react-label";

export const Route = createFileRoute("/_auth/user/tickets/pending")({
  component: RouteComponent,
});

type TicketType = {
  ticket_id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  category: string;
  assigned_to: string;
};

function RouteComponent() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);

  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true);
      setError("");

      try {
        const tickets = await apiClient.get<TicketType[]>("/tickets/");
        setTickets(tickets.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || "Failed to get tickets"
        );
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  const pendingTickets = tickets.filter(
    (ticket) =>
      ticket.status?.trim().toLowerCase().replace(/\s+/g, "") === "inprogress"
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto p-6 space-y-6 flex-grow">
        <h1 className="text-3xl font-bold">Pending Tickets</h1>
        {pendingTickets.length === 0 ? (
          <p>No pending tickets found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {pendingTickets.map((ticket) => (
              <Card key={ticket.ticket_id}>
                <CardHeader className="flex justify-between">
                  <div className="flex flex-col">
                    <CardTitle className="font-bold text-2xl">
                      {ticket.description}
                    </CardTitle>
                    <CardDescription className="flex flex-col gap-1">
                      <p>TKT-{ticket.ticket_id}</p>
                      <div className="flex gap-1">
                        <Badge style={getBadgeStyle(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                        <Badge variant="secondary">{ticket.status}</Badge>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={async () => {
                            try {
                              const response = await apiClient.get<TicketType>(
                                `/tickets/${ticket.ticket_id}`
                              );
                              setSelectedTicket(response.data);
                            } catch (err: any) {
                              console.error("Failed to load ticket", err);
                            }
                          }}
                        >
                          Open
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Ticket details</SheetTitle>
                          <SheetDescription>
                            Details for ticket TKT-
                            {selectedTicket?.ticket_id || ""}
                          </SheetDescription>
                        </SheetHeader>
                        {selectedTicket ? (
                          <div className="grid flex-1 auto-rows-min gap-6 px-4">
                            <div className="grid gap-3">
                              <Label>Subject</Label>
                              <Input value={selectedTicket.subject} readOnly />
                            </div>
                            <div className="grid gap-3">
                              <Label>Description</Label>
                              <Input
                                value={selectedTicket.description}
                                readOnly
                              />
                            </div>
                            <div className="grid gap-3">
                              <Label>Category</Label>
                              <Input value={selectedTicket.category} readOnly />
                            </div>
                            <div className="grid gap-3">
                              <Label>Created</Label>
                              <Input
                                value={timeSince(selectedTicket.created_at)}
                                readOnly
                              />
                            </div>
                            <div className="grid gap-3">
                              <Label>Assigned to</Label>
                              <Input
                                value={selectedTicket.assigned_to}
                                readOnly
                              />
                            </div>
                            <div className="grid gap-3">
                              <Label>Status</Label>
                              <Input value={selectedTicket.status} readOnly />
                            </div>
                          </div>
                        ) : (
                          <p>Loading ticket...</p>
                        )}
                        <SheetFooter>
                          <SheetClose asChild>
                            <Button>Close</Button>
                          </SheetClose>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
