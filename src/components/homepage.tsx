import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { HomepageManagerComponent } from "@/components/HomepageManager";

export const Route = createFileRoute("/admin/homepage")({
  component: HomepageManager,
});

function HomepageManager() {
  return (
    <div className="space-y-6"><PageHeader title="Homepage Manager" /><HomepageManagerComponent /></div>
  );
}