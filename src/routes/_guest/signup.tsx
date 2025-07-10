
import SignupForm from '../../components/auth/SignUpform'
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/_guest/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignupForm />
      </div>
    </div>
  )
}
