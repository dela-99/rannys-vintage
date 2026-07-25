import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <h1 className="font-display text-4xl">Admin Dashboard</h1>
    </div>
  );
}
