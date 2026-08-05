import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";

export const Route = createFileRoute("/admin/orders")({
  component: OrdersComponent,
});

const columns = [
  { accessorKey: "orderNumber", header: "Order Number" },
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "payment", header: "Payment" },
  { accessorKey: "total", header: "Total" },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "actions", header: "Actions" },
];

export function OrdersComponent() {
  return (
    <div className="space-y-6">
      <PageHeader title="Orders" />
      <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
        <DataTable
          columns={columns}
          data={[]}
          emptyState={<EmptyState message="No orders to display." />}
        />
      </div>
    </div>
  );
}
