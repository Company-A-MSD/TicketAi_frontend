import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { createFileRoute } from "@tanstack/react-router";
import { getBadgeStyle, timeSince } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import apiClient from "@/lib/api";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_auth/employee/dashboard")({
  component: RouteComponent,
});

type TicketType = {
  ticket_id: string;
  subject: string;
  description: string;
  status: string;
  Category: string;
  priority: string;
  created_at: string;
};

function DataTable<TData, TValue>({
  columns,
  data,
}: {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead className="text-muted-foreground" key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No tickets found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function RouteComponent() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  async function loadTickets() {
    try {
      const tickets = await apiClient.get<TicketType[]>("/tickets/assigned");
      setTickets(tickets.data);
    } catch (err: any) {
      console.log("Error loading tickets:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    console.log("Search query changed:", searchQuery);
    if (searchQuery) {
      const filteredTickets = tickets.filter((ticket) =>
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setTickets(filteredTickets);
    } else {
      loadTickets(); // Reload all tickets if search query is empty
    }
    
  }, [searchQuery]);

  const columns: ColumnDef<TicketType>[] = [
    {
      accessorKey: "ticket_id",
      header: "ID",
      cell: (info) => "TKT-" + info.getValue(),
    },
    {
      accessorKey: "subject",
      header: "Title",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: (info) => (
        <Badge style={getBadgeStyle(info.getValue() as string)}>
          {info.getValue() as string}
        </Badge>
      ),
    },
    {
      accessorKey: "Category",
      header: "Category",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: (info) => timeSince(info.getValue() as string),
    },
  ];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto p-6 space-y-6 flex-grow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <p className="text-muted-foreground">Welcome back, {user.name}!</p>
          </div>
          <div className="flex w-full max-w-sm items-center gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search tickets..."
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Tickets</CardTitle>
            <p className="text-sm text-muted-foreground">
              {tickets.length} Tickets found
            </p>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={tickets} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
