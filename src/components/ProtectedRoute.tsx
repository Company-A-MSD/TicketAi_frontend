import { ReactNode } from "react";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requiredPermissions?: string[];
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  allowedRoles = [],
  requiredPermissions = [],
  fallback,
}: ProtectedRouteProps) {
  const { user, hasRole, hasPermission } = useAuth();

  if (!user) {
    return (
      fallback || (
        <Alert className="m-4">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Please log in to access this page.
          </AlertDescription>
        </Alert>
      )
    );
  }

  const hasRequiredRole =
    allowedRoles.length === 0 || allowedRoles.some((role) => hasRole(role));
  const hasRequiredPermissions =
    requiredPermissions.length === 0 ||
    requiredPermissions.every((permission) => hasPermission(permission));

  if (!hasRequiredRole || !hasRequiredPermissions) {
    return (
      fallback || (
        <Alert className="m-4" variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this page. Required role:{" "}
            {allowedRoles.join(", ")}
            {requiredPermissions.length > 0 &&
              ` and permissions: ${requiredPermissions.join(", ")}`}
          </AlertDescription>
        </Alert>
      )
    );
  }

  return <>{children}</>;
}

// Higher-order component for route protection
export function withRoleProtection(
  Component: React.ComponentType<any>,
  allowedRoles: UserRole[],
  requiredPermissions?: string[]
) {
  return function ProtectedComponent(props: any) {
    return (
      <ProtectedRoute
        allowedRoles={allowedRoles}
        requiredPermissions={requiredPermissions}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}