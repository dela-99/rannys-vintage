import { BulkUploadComponent } from "@/components/products.bulk-upload";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/products/bulk-upload")({
  component: BulkUploadComponent,
});
