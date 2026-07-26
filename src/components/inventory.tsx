import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";

export const Route = createFileRoute("/admin/inventory")({
  component: InventoryComponent,
});

const columns = [
  { accessorKey: "image", header: "Image" },
  { accessorKey: "product", header: "Product" },
  { accessorKey: "stock", header: "Stock" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "actions", header: "Actions" },
];

function InventoryComponent() {
  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" />
      <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
        <DataTable
          columns={columns}
          data={[]}
          emptyState={<EmptyState message="No inventory available." />}
        />
      </div>
    </div>
  );
}