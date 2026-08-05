import { HomepageManager } from "@/components/homepage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/homepage")({
  component: HomepageManager,
});
