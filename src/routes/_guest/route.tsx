import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_guest")({
  component: RouteComponent,
  beforeLoad: ({ context, location }) => {
    const auth = (context as any).auth;
    if (auth.isAuthenticated()) {
      throw redirect({
        to: auth.getDashboardRoute(),
      });
    }
  },
});

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
