import { useAuth } from "@/auth";
import { GoogleIcon } from "@/components/GoogleIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { normalizeAuthError } from "@/services/authService";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: (search.redirect as string) || "/",
      authError: search.authError as string | undefined,
    };
  },
  component: LoginRouteComponent,
});

function LoginRouteComponent() {
  const search = Route.useSearch();

  return <LoginComponent redirectTo={search.redirect} authError={search.authError} />;
}

export function LoginComponent({
  fromAdmin,
  redirectTo = "/",
  authError,
}: {
  fromAdmin?: boolean;
  redirectTo?: string;
  authError?: string;
}) {
  const { login, loginWithGoogle, user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isBusy = loading || isSubmitting;

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password);
      toast.success("Signed in successfully.");
    } catch (err) {
      const message = normalizeAuthError(err);
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    try {
      loginWithGoogle();
    } catch (err) {
      const message = normalizeAuthError(err, "Google login could not be started.");
      setError(message);
      toast.error(message);
    }
  };

  React.useEffect(() => {
    if (user) {
      const target = fromAdmin ? (role === "admin" ? "/admin/welcome" : "/admin") : redirectTo;
      navigate({ to: target });
    }
  }, [fromAdmin, navigate, redirectTo, role, user]);

  React.useEffect(() => {
    if (authError === "google_cancelled") {
      toast.error("Google login was cancelled.");
    }
  }, [authError]);

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
              ? "Sign in to manage Ranny's Vintage Clothing."
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
          <Button type="submit" className="w-full" disabled={isBusy}>
            {isBusy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isBusy}>
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
