import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/employee/administration/analytics')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/admin/administration/analytics"!</div>
}
