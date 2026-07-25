import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_admin/welcome")({
  component: WelcomeScreen,
});

function WelcomeScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate({ to: "/dashboard", replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-center animate-[fade-in_1s_ease-out]">
      <div className="flex items-center">
        <span className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Ranny&apos;s
        </span>
        <span className="font-accent ml-1 text-[10px] text-primary">
          Vintage Clothing
        </span>
      </div>
      <div className="mt-8">
        <h1 className="font-display text-3xl">Welcome back, Ranny 👋</h1>
        <p className="mt-2 text-muted-foreground">Loading your dashboard...</p>
      </div>
      <div className="absolute bottom-16 h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
