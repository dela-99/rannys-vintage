import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleIcon } from "@/components/GoogleIcon";

export const Route = createFileRoute("/signup")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: (search.redirect as string) || "/",
    };
  },
  component: SignupPage,
});

export function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage] = useState<string | null>(null);

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    // Replace with Convex Google sign-up logic
    setIsLoading(false);
  };

  return (
    <AuthLayout
      title="Create account"
      description="Build your client profile and keep your favorite wardrobe finds close at hand."
      footer={
        <p>
          Already have an account?{" "}
          <Link
            to="/login"
            params={{}}
            search={{ redirect: "/" }}
            className="font-semibold text-primary transition-colors hover:underline"
          >
            Sign In
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
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="font-accent group inline-flex h-12 w-full items-center justify-center gap-3 rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GoogleIcon className="h-5 w-5" />
          {isLoading ? "Preparing OAuth…" : "Continue with Google"}
        </button>

        <form className="space-y-4 text-left" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="ml-4 text-[10px] font-accent uppercase tracking-[0.2em] text-muted-foreground">
              Full name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                required
                className="h-12 w-full rounded-full border border-border bg-[#f7f3ff] pl-12 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="ml-4 text-[10px] font-accent uppercase tracking-[0.2em] text-muted-foreground">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                className="h-12 w-full rounded-full border border-border bg-[#f7f3ff] pl-12 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="ml-4 text-[10px] font-accent uppercase tracking-[0.2em] text-muted-foreground">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                required
                className="h-12 w-full rounded-full border border-border bg-[#f7f3ff] pl-12 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="font-accent group inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-4 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-primary"
          >
            Start my journey
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
