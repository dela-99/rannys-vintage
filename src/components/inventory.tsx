import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";

const columns = [
  { accessorKey: "image", header: "Image" },
  { accessorKey: "product", header: "Product" },
  { accessorKey: "stock", header: "Stock" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "actions", header: "Actions" },
];

export function InventoryComponent() {
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
