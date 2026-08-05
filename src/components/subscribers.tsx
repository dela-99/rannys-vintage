import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const columns = [
  { accessorKey: "email", header: "Email" },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "status", header: "Status" },
];

export function SubscribersComponent() {
  return (
    <div className="space-y-6">
      <PageHeader title="Subscribers">
        <Button variant="outline" className="bg-white">
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </PageHeader>
      <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
        <DataTable
          columns={columns}
          data={[]}
          emptyState={<EmptyState message="No subscribers yet." />}
        />
      </div>
    </div>
  );
}
