import { OrdersComponent } from "@/components/Orders";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/orders")({
  component: OrdersComponent,
});
