/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Route = createFileRoute("/admin/promotions" as any)({
  component: PromotionsComponent,
});

function PromotionsComponent() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Promotions</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Promotion
        </Button>
      </div>
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        <p>Promotions management interface will be here.</p>
        <p className="text-sm">(Popup, Announcement Bar, Banners, etc.)</p>
      </div>
    </div>
  );
}
