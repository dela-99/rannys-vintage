import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";

export const Route = createFileRoute("/admin/promotions")({
  component: PromotionsComponent,
});

function PromotionsComponent() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Promotions</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Promotion
        </Button>
      </div>
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        <p>Promotions management interface will be here.</p>
        <p className="text-sm">(Popup, Announcement Bar, Banners, etc.)</p>
      </div>
    </div>
  );
}
