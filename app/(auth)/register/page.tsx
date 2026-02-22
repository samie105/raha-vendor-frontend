import { SignUpForm } from "@/components/auth-signup-form";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-background">
      <Card className="w-full max-w-md p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Join Raha</h1>
            <p className="text-muted-foreground">
              Create your vendor account to get started
            </p>
          </div>
          <SignUpForm />
        </div>
      </Card>
    </div>
  );
}
