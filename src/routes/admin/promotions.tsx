import { PromotionsComponent } from "@/components/promotions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/promotions")({
  component: PromotionsComponent,
});
