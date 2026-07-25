import { useAuth } from "@/auth";
import { GoogleIcon } from "@/components/GoogleIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: (search.redirect as string) || "/",
    };
  },
  component: LoginComponent,
});

export function LoginComponent({ fromAdmin }: { fromAdmin?: boolean }) {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [error, setError] = React.useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signIn(email, password);
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  React.useEffect(() => {
    if (user) {
      if (fromAdmin) {
        if (user.role === "admin") {
          navigate({ to: "/admin/welcome" });
        } else {
          navigate({ to: "/access-denied" });
        }
      } else {
        if (user.role === "admin") {
          navigate({ to: "/admin/welcome" });
        } else {
          navigate({ to: search.redirect });
        }
      }
    }
  }, [user, navigate, fromAdmin, search.redirect]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Link to="/" className="font-display inline-block text-3xl font-bold">
            Ranny&apos;s
          </Link>
          <h1 className="font-display mt-4 text-2xl font-semibold">
            {fromAdmin ? "Administrator Access" : "Welcome Back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {fromAdmin
              ? "Sign in to access the Ranny's Vintage Clothing Admin Dashboard."
              : "Sign in to your account to continue."}
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleLogin}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          <GoogleIcon className="mr-2 h-4 w-4" />
          Google
        </Button>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}