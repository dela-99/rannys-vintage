import { CustomersComponent } from "@/components/customers";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/customers")({
  component: CustomersComponent,
});
