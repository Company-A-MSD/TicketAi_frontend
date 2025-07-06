import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import heroImage from "../../assets/yellow.webp";
import { Ticket, ArrowLeft, Terminal } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { type AnyFieldApi, useForm } from "@tanstack/react-form";
import { useAuth } from "@/context/AuthContext";
import z from "zod";
import { apiClient } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

export default function SignupForm() {
  // const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onChange: z.object({
        name: z.string().min(1, "Name is required"),
        email: z
          .string()
          .min(1, "Email is required")
          .email("Please enter a valid email address"),
        password: z
          .string()
          .min(6, "Password must be at least 6 characters long")
          .max(50, "Password must be less than 50 characters"),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const response = await apiClient.post("/register", value);
        if (response.status === 200) {
          toast.success("Account created successfully! Login to continue.");
        }
      } catch (error: any) {
        if (error.response?.status === 400) {
          toast.error(error.response.data.message || "Email already exists. Please try again.");
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
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-muted-foreground text-balance">
                  Enter your details to create an account
                </p>
              </div>

              {/* Name */}
              <div className="grid gap-3">
                <form.Field
                  name="name"
                  children={(field) => (
                    <>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Your Name"
                        // required
                      />
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
                        {errorMap.onSubmit}
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
                      {isSubmitting ? "Creating account..." : "Sign up"}
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
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Login
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
