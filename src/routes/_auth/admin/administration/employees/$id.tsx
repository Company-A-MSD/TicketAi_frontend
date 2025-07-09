import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import apiClient from "@/lib/api";
import { Label } from "@radix-ui/react-label";
import { createFileRoute, useParams } from "@tanstack/react-router";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  XIcon,
  PlusIcon,
} from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute(
  "/_auth/admin/administration/employees/$id"
)({
  component: RouteComponent,
});

type EmployeeType = {
  email: string;
  name: string;
  availability: boolean;
  assigned_categories: string[];
  workload: number;
  employee_id: string;
  role: string;
};

function RouteComponent() {
  const { id } = useParams({ strict: false });

  const [employee, setEmployee] = useState<EmployeeType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [assignedCategories, setAssignedCategories] = useState<string[]>([]);
  const [availability, setAvailability] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState("");

  async function loadUser() {
    try {
      const response = await apiClient.get<EmployeeType>(`/employees/${id}`);
      console.log("Employee data:", response.data);
      setEmployee(response.data);
    } catch (err) {
      console.log("Failed to load employee data", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setEmail(employee.email);
      setRole(employee.role || "");
      setAssignedCategories(employee.assigned_categories || []);
      setAvailability(employee.availability);
    }
  }, [employee]);

  const addCategory = (category: string) => {
    if (category && !assignedCategories.includes(category)) {
      setAssignedCategories([...assignedCategories, category]);
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    console.log("Removing category:", categoryToRemove);

    setAssignedCategories(
      assignedCategories.filter((cat) => cat !== categoryToRemove)
    );
  };

  const addNewCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory("");
    }
  };

  async function handleSubmit() {
    try {
      console.log("Submitting employee data:", {
        name,
        email,
        role,
        assigned_categories: assignedCategories,
        availability,
      });

      const response = await apiClient.patch<EmployeeType>(
        `/employees/${employee?.employee_id}`,
        {
          name,
          email,
          role,
          assigned_categories: assignedCategories,
          availability,
        }
      );
      setAlert({ type: "success", message: "Employee updated successfully!" });
      // setEmployee(response.data);
    } catch (err: any) {
      setAlert({ type: "error", message: "Failed to update employee" });
      console.error("Failed to update employee", err);
    }
  }

  if (loading) return <div>Loading employee data...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!employee) return <div>No employee found.</div>;

  return (
    <div className="flex justify-center m-10">
      <Card className="self-start w-4/5 mx-16">
        <CardHeader>
          <CardTitle>Employee Account</CardTitle>
          <CardDescription>
            Details about employee-id: {employee.employee_id}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alert && (
            <Alert variant={alert.type === "error" ? "destructive" : "default"}>
              {alert.type === "error" ? (
                <AlertCircleIcon className="w-4 h-4" />
              ) : (
                <CheckCircle2Icon className="w-4 h-4" />
              )}
              <AlertTitle>{alert.message}</AlertTitle>
            </Alert>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  type="text"
                  placeholder="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div> */}

              <div className="grid gap-2">
                <Label htmlFor="categories">Assigned Categories</Label>

                {/* Display current categories as badges */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {assignedCategories.map((category, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {category}
                      <span>
                        <XIcon
                          className="w-3 h-3 cursor-pointer hover:text-red-500 stroke-3"
                          onClick={() => removeCategory(category)}
                        />
                      </span>
                    </Badge>
                  ))}
                </div>

                <div className="flex w-full gap-4">
                  {/* Input to add custom category */}
                  <div className="flex w-full gap-2">
                    <Input
                      placeholder="Add category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addNewCategory();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addNewCategory}
                      disabled={!newCategory.trim()}
                    >
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="availability">Availability</Label>
                <RadioGroup
                  value={availability.toString()}
                  onValueChange={(value) => setAvailability(value === "true")}
                  className="flex flex-row gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="available" />
                    <Label htmlFor="available">Available</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="not-available" />
                    <Label htmlFor="not-available">Not Available</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <span>Workload: </span>
                {employee.workload.toString()}
              </div>

              <div>
                <Button type="submit">Save changes</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
