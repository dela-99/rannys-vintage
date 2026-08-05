import { ProductsComponent } from "@/components/products";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/products")({
  component: ProductsComponent,
});
