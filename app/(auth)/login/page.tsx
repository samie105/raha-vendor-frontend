import { SignInForm } from "@/components/auth-signin-form";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-background">
      <Card className="w-full max-w-md p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to your vendor account
            </p>
          </div>
          <SignInForm />
        </div>
      </Card>
    </div>
  );
}
