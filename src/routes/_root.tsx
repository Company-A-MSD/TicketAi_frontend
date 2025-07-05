import { AuthContext, AuthProvider } from "@/context/AuthContext";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}