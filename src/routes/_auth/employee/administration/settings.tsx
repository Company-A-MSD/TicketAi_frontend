import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_auth/employee/administration/settings',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/employee/administration/settings"!</div>
}
