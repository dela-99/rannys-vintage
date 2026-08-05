import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Placeholder } from "@/components/Placeholder";

export function PromotionsComponent() {
  return (
    <div className="space-y-6">
      <PageHeader title="Promotions">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button disabled>
                <Plus className="mr-2 h-4 w-4" /> Create Promotion
              </Button>
            </TooltipTrigger>
            <TooltipContent>Coming soon!</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PageHeader>

      <div className="space-y-8">
        <section>
          <h3 className="mb-4 font-display text-xl">Active Promotions</h3>
          <div className="rounded-2xl border-2 border-dashed border-muted-foreground/50 p-12 text-center">
            <p className="text-muted-foreground">No active promotions.</p>
          </div>
        </section>
        <section>
          <h3 className="mb-4 font-display text-xl">Scheduled Promotions</h3>
          <div className="rounded-2xl border-2 border-dashed border-muted-foreground/50 p-12 text-center">
            <p className="text-muted-foreground">No scheduled promotions.</p>
          </div>
        </section>
        <section>
          <h3 className="mb-4 font-display text-xl">Expired Promotions</h3>
          <div className="rounded-2xl border-2 border-dashed border-muted-foreground/50 p-12 text-center">
            <p className="text-muted-foreground">No expired promotions.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
