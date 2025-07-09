import { createFileRoute } from "@tanstack/react-router";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/api";
import { timeSince } from "@/lib/utils";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Label } from "@radix-ui/react-label";
export const Route = createFileRoute(
  "/_auth/admin/administration/usermanagement"
)({
  component: RouteComponent,
});

const getBadgeStyle = (priority: string): React.CSSProperties => {
  switch (priority) {
    case "High":
      return { backgroundColor: "red", color: "white" };
    case "Medium":
      return { backgroundColor: "orange", color: "white" };
    case "Low":
      return { backgroundColor: "green", color: "white" };
    default:
      return {};
  }
};

type UserType = {
  id: string;
  email: string;
  name: string;
};

type EmployeeType = {
  email: string;
  name: string;
  availability: boolean;
  assigned_categories: string[];
  workload: number;
  employee_id: string;
};

function DataTable<UData, UValue>({
  columns,
  data,
}: {
  columns: ColumnDef<UData, UValue>[];
  data: UData[];
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
              No users found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function RouteComponent() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  const [users, setusers] = useState<UserType[]>([]);
  // const [singleuser,setsingleuser] =useState(null);
  const [employees, setemployees] = useState<EmployeeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const loadusers = async () => {
    setLoading(true);
    setError("");

    try {
      const users = await apiClient.get<UserType[]>("/users");
      setusers(users.data);
      const employees = await apiClient.get<EmployeeType[]>("/employees");
      setemployees(employees.data);
    } catch (err: any) {
      setError("Failed to get all users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadusers();
  }, []);

  const columns: ColumnDef<UserType>[] = [
    {
      accessorKey: "name",
      header: "Username",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => info.getValue(),
    },
    {
      header: "",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete user
                  account and remove user data from the servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(row.original.id)} className={buttonVariants({ variant: "destructive" })}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Link
            to="/admin/administration/user/$id"
            params={{ id: row.original.id }}
            className="text-blue-500 underline"
          >
            <Button>View Profile</Button>
          </Link>
        </div>
      ),
    },
  ];

  const Employeecolumns: ColumnDef<EmployeeType>[] = [
    {
      accessorKey: "name",
      header: "Employee Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "availability",
      header: "Availability",
      cell: (info) => {
        const available = info.getValue() as boolean;
        return (
          <Badge variant={available ? "default" : "secondary"}>
            {available ? "Available" : "Not Available"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "assigned_categories",
      header: "Categories",
      cell: (info) => {
        const categories = info.getValue() as string[];
        return categories.length ? (
          categories.join(", ")
        ) : (
          <span className="text-muted-foreground">None</span>
        );
      },
    },
    {
      accessorKey: "workload",
      header: "Workload",
      cell: (info) => `${info.getValue()}%`,
    },
     {
      header: "",
      id: "actions",
      cell: ({ row }) => (
     <div className="flex justify-end gap-2">
          <Link
            to="/admin/administration/employees/$id"
            params={{ id: row.original.employee_id }}
            className="text-blue-500 underline"
          >
            <Button>View Profile</Button>
          </Link>
        </div>
          
      ),
    },
  ];
  async function handleDelete(id: string) {
    try {
      await apiClient.delete(`/delete_user/${id}`);
      setAlert({ type: "success", message: "User deleted successfully" });
    } catch (err: any) {
      setAlert({ type: "error", message: "Failed to delete user" });
    }
    loadusers();
  }
  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto p-6 space-y-6 flex-grow">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="flex flex-col gap-5">
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
          <Card>
            <CardHeader>
              <CardTitle>All users</CardTitle>
              <p className="text-sm text-muted-foreground">
                {users.length} users found
              </p>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={users} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>All employees</CardTitle>
              <p className="text-sm text-muted-foreground">
                {employees.length} employees found
              </p>
            </CardHeader>
            <CardContent>
              <DataTable columns={Employeecolumns} data={employees} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
