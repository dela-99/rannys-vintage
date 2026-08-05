import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download, Search } from "lucide-react";
import { AddProductModal } from "@/components/AddProductModal";
import { useState } from "react";

export const Route = createFileRoute("/admin/products")({
  component: ProductsComponent,
});

const columns = [
  { accessorKey: "image", header: "Image" },
  { accessorKey: "product", header: "Product" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "subcategory", header: "Subcategory" },
  { accessorKey: "price", header: "Price" },
  { accessorKey: "stock", header: "Stock" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "actions", header: "Actions" },
];

function ProductsComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader title="Products">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="bg-white" onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
          <Link to="/admin/products/bulk-upload">
            <Button variant="outline" className="bg-white">
              <Upload className="mr-2 h-4 w-4" /> Bulk Upload
            </Button>
          </Link>
          <Button variant="outline" className="bg-white">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </PageHeader>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
        <div className="mb-4 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search products..."
              className="w-full rounded-lg border border-border bg-transparent py-2 pl-10 pr-4"
            />
          </div>
          {/* Filter buttons would go here */}
        </div>
        <DataTable
          columns={columns}
          data={[]}
          emptyState={<EmptyState message="No products found." />}
        />
      </div>

      <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
