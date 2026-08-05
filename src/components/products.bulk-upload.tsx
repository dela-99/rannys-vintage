import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { UploadCloud, Trash2, Check } from "lucide-react";

export const Route = createFileRoute("/admin/products/bulk-upload")({
  component: BulkUploadComponent,
});

function BulkUploadComponent() {
  return (
    <div className="space-y-6">
      <PageHeader title="Bulk Upload">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-white">
            <Trash2 className="mr-2 h-4 w-4" /> Discard
          </Button>
          <Button variant="outline" className="bg-primary-soft">
            Save Draft
          </Button>
          <Button>
            <Check className="mr-2 h-4 w-4" /> Publish All
          </Button>
        </div>
      </PageHeader>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
        <div className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-primary-soft/40 text-center">
          <UploadCloud className="h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg text-muted-foreground">Drag & drop your product images here</p>
          <p className="text-sm text-muted-foreground/80">or</p>
          <Button variant="link" className="text-primary">
            Browse Files
          </Button>
        </div>
      </div>
    </div>
  );
}
