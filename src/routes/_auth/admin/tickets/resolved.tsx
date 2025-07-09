import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  MessageCircle,
  Paperclip,
} from "lucide-react";
import apiClient from "@/lib/api";
import { useState, useEffect } from "react";
import { getBadgeStyle, timeSince } from "@/lib/utils";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
export const Route = createFileRoute("/_auth/admin/tickets/resolved")({
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
type EmployeeType = {
  email: string;
  name: string;
  availability: boolean;
  assigned_categories: string[];
  workload: number;
  employee_id: string;
};

function RouteComponent() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [employees, setemployees] = useState<EmployeeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<string>("");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (selectedTicket) {
      // setAssignedTo(selectedTicket.assigned_to);
      setStatus(selectedTicket.status.toLowerCase().replace(/\s+/g, ""));
    }
  }, [selectedTicket]);

  async function loadTickets() {
    try {
      const tickets = await apiClient.get<TicketType[]>("/tickets/all");
      console.log("Tickets loaded:", tickets.data);

      setTickets(tickets.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to get tickets"
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadEmployees() {
    try {
      const response = await apiClient.get<EmployeeType[]>("/employees");
      console.log("Employees loaded:", response.data);
      setemployees(response.data);
    } catch (err: any) {
      console.log("Failed to load employees", err);
    }
  }

  useEffect(() => {
    loadTickets();
    loadEmployees();
  }, []);

  const resolvedTickets = tickets.filter(
    (ticket) =>
      ticket.status?.trim().toLowerCase().replace(/\s+/g, "") === "complete"
  );

  const handlesavechanges = async () => {
    if (!selectedTicket) {
      console.error("No ticket selected");
      return;
    }

    try {
      await apiClient.patch(`/tickets/${selectedTicket.ticket_id}`, {
        assigned_employee_email: assignedTo,
        status: status,
      });
      setAlert({ type: "success", message: "Ticket updated successfully!" });
    } catch {
      setAlert({ type: "error", message: "Failed to update ticket" });
    }
    loadTickets();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto p-6 space-y-6 flex-grow">
        <h1 className="text-3xl font-bold">Resolved Tickets</h1>
        {alert && (
          <Alert variant={alert.type === "error" ? "destructive" : "default"}>
            {alert.type === "error" ? (
              <AlertCircleIcon className="h-4 w-4" />
            ) : (
              <CheckCircle2Icon className="h-4 w-4" />
            )}
            <AlertTitle>{alert.message}</AlertTitle>
          </Alert>
        )}

        {resolvedTickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {resolvedTickets.map((ticket) => (
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

                              const employee_email = employees.filter(
                                (emp) => emp.employee_id === ticket.assigned_to
                              )[0]?.email;

                              console.log(employee_email);

                              setAssignedTo(employee_email);

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
                        {selectedTicket && employees ? (
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
                              <Select
                                value={assignedTo}
                                onValueChange={setAssignedTo}
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Assign to" />
                                </SelectTrigger>
                                <SelectContent>
                                  {employees.map((employee) => (
                                    <SelectItem
                                      key={employee.email}
                                      value={employee.email}
                                    >
                                      {employee.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-3">
                              <Label>Status</Label>
                              <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="inprogress">
                                    In Progress
                                  </SelectItem>
                                  <SelectItem value="complete">
                                    Complete
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ) : (
                          <p>Loading ticket...</p>
                        )}
                        <SheetFooter>
                          <SheetClose asChild>
                            <div className="flex flex-col">
                              <Button type="submit" onClick={handlesavechanges}>
                                {" "}
                                Save changes
                              </Button>
                              <Button variant="outline">Close</Button>
                            </div>
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
