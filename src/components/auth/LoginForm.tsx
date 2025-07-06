import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import heroImage from "../../assets/yellow.webp";
import { Ticket, ArrowLeft, Terminal } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { type AnyFieldApi, useForm } from "@tanstack/react-form";
import { useAuth, User } from "@/context/AuthContext";
import z from "zod";
import { apiClient } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate({ from: "/login" });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      role: "user",
    },
    validators: {
      onChange: z.object({
        email: z
          .string()
          .min(1, "Email is required")
          .email("Please enter a valid email address"),
        password: z.string().min(1, "Password is required"),
        role: z.enum(["user", "employee"], {
          errorMap: () => ({ message: "Please select a role" }),
        }),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const endpoint =
          value.role === "employee" ? "/employees/login" : "/login";
        const response = await apiClient.post(endpoint, value);

        if (response.status === 200) {
          const user = {
            email: value.email,
            role: response.data.role,
            token: response.data.token,
            id: response.data.id,
            name: response.data.name,
          };
          login(user);
          toast.success("Login successful!");

          if (response.data.role === "ADMIN") {
            navigate({ to: "/admin/dashboard" });
          } else if (response.data.role === "EMPLOYEE") {
            navigate({ to: "/employee/dashboard" });
          } else {
            navigate({ to: "/user/dashboard" });
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            toast.error(
              error.response.data.message ||
                "Invalid email or password. Please try again."
            );
          }
        }
      }
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-0 overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="flex flex-col gap-6">
              <Link to="/" className="w-fit">
                <Button variant="ghost" size="icon" type="button">
                  <ArrowLeft />
                </Button>
              </Link>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Ticket strokeWidth={2} size={36} className="text-blue-600" />
                <h1 className="text-2xl font-bold">TicketAI</h1>
              </div>
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-muted-foreground text-balance">
                  Login to continue
                </p>
              </div>

              {/* Role Selection */}
              <div className="grid gap-3">
                <form.Field
                  name="role"
                  children={(field) => (
                    <>
                      <div className="flex overflow-hidden border rounded-md border-input bg-background">
                        <button
                          type="button"
                          onClick={() => field.handleChange("user")}
                          className={cn(
                            "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                            field.state.value === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-background text-muted-foreground hover:bg-muted"
                          )}
                        >
                          User
                        </button>
                        <button
                          type="button"
                          onClick={() => field.handleChange("employee")}
                          className={cn(
                            "flex-1 px-4 py-2 text-sm font-medium transition-colors border-l border-input",
                            field.state.value === "employee"
                              ? "bg-primary text-primary-foreground"
                              : "bg-background text-muted-foreground hover:bg-muted"
                          )}
                        >
                          Employee
                        </button>
                      </div>
                      <FieldInfo field={field} />
                    </>
                  )}
                />
              </div>

              {/* Email */}
              <div className="grid gap-3">
                <form.Field
                  name="email"
                  children={(field) => (
                    <>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="m@example.com"
                        // required
                      />
                      <FieldInfo field={field} />
                    </>
                  )}
                />
              </div>

              {/* Password */}
              <div className="grid gap-3">
                <form.Field
                  name="password"
                  children={(field) => (
                    <>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder=""
                        // required
                      />
                      <FieldInfo field={field} />
                    </>
                  )}
                />
              </div>

              {/* Error Display */}
              <form.Subscribe
                selector={(state) => [state.errorMap]}
                children={([errorMap]) => (
                  <>
                    {errorMap.onSubmit && (
                      <div className="p-3 text-sm text-red-600 border border-red-200 rounded-md bg-red-50">
                        {typeof errorMap.onSubmit === "string"
                          ? errorMap.onSubmit
                          : "Please check your inputs and try again."}
                      </div>
                    )}
                  </>
                )}
              />

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <div className="space-y-3">
                    <Button
                      type="submit"
                      disabled={!canSubmit || isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                  </div>
                )}
              />

              {/* <div>
                <Button type="submit" className="w-full">
                  Signup
                </Button>
              </div> */}

              <div className="text-sm text-center">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Signup
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={heroImage}
              alt="Image"
              className="object-left absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <div className="text-xs text-rose-700">
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors[0].message}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </div>
  );
}
