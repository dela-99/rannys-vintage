import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, KeyRound, Mail } from "lucide-react";
import { useState } from "react";
import { GoogleIcon } from "@/components/GoogleIcon";

// Mock Appwrite SDK for frontend integration
const appwrite = {
  account: {
    createOAuth2Session: (provider: "google", success?: string, failure?: string) => {
      console.log(`Initiating Appwrite Google OAuth...`);
      // In a real scenario, this would redirect to Google's auth page.
      // For now, we'll just log it.
      // The user would be redirected to `success` URL on success.
      // Example: createOAuth2Session('google', 'https://example.com/success', 'https://example.com/failure');
    },
  },
};

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    try {
      // The success and failure URLs should be configured in your Appwrite console
      appwrite.account.createOAuth2Session("google");
    } catch (error) {
      console.error("Failed to initiate Google sign-in", error);
      setIsLoading(false);
    }
    // The page will redirect, so we don't need to set isLoading back to false here.
  };

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12">
      <Link
        to="/"
        className="font-accent absolute left-4 top-4 inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary md:left-8 md:top-8"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to Home
      </Link>

      <div className="w-full max-w-sm text-center">
        <Link to="/" className="inline-block">
          <span className="font-display text-4xl font-bold tracking-tight text-foreground">
            Ranny&apos;s
          </span>
        </Link>
        <h1 className="font-display mt-4 text-2xl font-semibold text-foreground">Welcome Back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to access your account and wishlist.
        </p>

        <div className="mt-8 space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="font-accent group inline-flex h-12 w-full items-center justify-center gap-3 rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            <GoogleIcon className="h-5 w-5" />
            Continue with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <form className="space-y-4 text-left">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                placeholder="your@email.com"
                className="h-12 w-full rounded-full border border-border bg-muted pl-12 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                placeholder="Password"
                className="h-12 w-full rounded-full border border-border bg-muted pl-12 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Don't have an account?{" "}
          <Link to="#" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
