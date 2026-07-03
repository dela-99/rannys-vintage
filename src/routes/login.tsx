import { createFileRoute, Link } from "@tanstack/react-router";
import { KeyRound, Mail } from "lucide-react";
import { useState } from "react";
import { GoogleIcon } from "@/components/GoogleIcon";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { isAppwriteConfigured, signInWithGoogle } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    const result = await signInWithGoogle();
    setStatusMessage(
      result.success
        ? "Google sign-in is ready for the Appwrite configuration step."
        : result.reason,
    );
    setIsLoading(false);
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to continue your wardrobe journey and pick up where you left off."
      footer={
        <p>
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-primary transition-colors hover:underline"
          >
            Create account
          </Link>
        </p>
      }
    >
      {statusMessage ? (
        <div className="mb-4 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
          {statusMessage}
        </div>
      ) : null}

      <div className="space-y-4">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="font-accent group inline-flex h-12 w-full items-center justify-center gap-3 rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GoogleIcon className="h-5 w-5" />
          {isLoading ? "Preparing OAuth…" : "Continue with Google"}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white/70 px-2 text-muted-foreground backdrop-blur">
              Or continue with
            </span>
          </div>
        </div>

        <form className="space-y-4 text-left">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              placeholder="your@email.com"
              className="h-12 w-full rounded-full border border-border bg-[#f7f3ff] pl-12 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              placeholder="Password"
              className="h-12 w-full rounded-full border border-border bg-[#f7f3ff] pl-12 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="font-accent w-full rounded-full bg-foreground py-3.5 text-sm font-semibold text-background transition-colors hover:bg-primary"
          >
            Sign In
          </button>
        </form>
      </div>

      {!isAppwriteConfigured() ? (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Appwrite auth is ready for the next config step once your environment values are added.
        </p>
      ) : null}
    </AuthLayout>
  );
}
