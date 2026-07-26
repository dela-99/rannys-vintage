import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";

export const Route = createFileRoute("/admin/customers")({
  component: CustomersComponent,
});

const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "orders", header: "Orders" },
  { accessorKey: "joined", header: "Joined" },
  { accessorKey: "status", header: "Status" },
];

function CustomersComponent() {
  return (
    <div className="space-y-6">
      <PageHeader title="Customers" />
      <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
        <DataTable
          columns={columns}
          data={[]}
          emptyState={<EmptyState message="No customers found." />}
        />
      </div>
    </div>
  );
}