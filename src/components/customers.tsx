import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";

const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "orders", header: "Orders" },
  { accessorKey: "joined", header: "Joined" },
  { accessorKey: "status", header: "Status" },
];

export function CustomersComponent() {
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
