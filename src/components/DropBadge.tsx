import type { DropStatus } from "@/lib/dropEngine";
import { Flame, Sparkles, TrendingUp } from "lucide-react";

export function DropBadge({ status }: { status: DropStatus }) {
  if (!status) return null;
  if (status === "JUST_DROPPED") {
    return (
      <span className="font-accent inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold text-primary-foreground shadow-glow animate-pulse-glow">
        <Flame className="h-3 w-3" /> Just Dropped
      </span>
    );
  }
  if (status === "TRENDING") {
    return (
      <span className="font-accent inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1 text-[10px] font-semibold text-background">
        <TrendingUp className="h-3 w-3" /> Trending
      </span>
    );
  }
  return (
    <span className="font-accent inline-flex items-center gap-1 rounded-full bg-primary-glow px-3 py-1 text-[10px] font-semibold text-primary-foreground">
      <Sparkles className="h-3 w-3" /> New Arrival
    </span>
  );
}
