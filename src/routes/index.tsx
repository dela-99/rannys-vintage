import { DashboardHome } from "@/components/DashboardHome";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_admin/")({
  component: DashboardComponent,
});

function DashboardComponent() {
  return <DashboardHome />;
}
