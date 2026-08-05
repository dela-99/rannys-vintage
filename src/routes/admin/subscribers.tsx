import { SubscribersComponent } from "@/components/subscribers";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/subscribers")({
  component: SubscribersComponent,
});
