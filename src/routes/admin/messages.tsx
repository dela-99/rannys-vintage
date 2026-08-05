import { MessagesComponent } from "@/components/messages";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/messages")({
  component: MessagesComponent,
});
