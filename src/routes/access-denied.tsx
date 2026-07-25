import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/access-denied")({
  component: AccessDeniedComponent,
});

function AccessDeniedComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-center">
      <h1 className="font-display text-4xl">Access Denied</h1>
      <p className="max-w-md text-muted-foreground">
        You do not have permission to access the administration panel.
      </p>
      <Button asChild>
        <Link to="/">Return to Store</Link>
      </Button>
    </div>
  );
}