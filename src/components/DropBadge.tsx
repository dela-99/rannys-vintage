import type { DropStatus } from "@/lib/dropEngine";
import { Flame, Sparkles } from "lucide-react";

export function DropBadge({ status }: { status: DropStatus }) {
  if (!status) return null;
  if (status === "JUST_DROPPED") {
    return (
      <span className="font-accent inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold text-primary-foreground shadow-glow animate-[pulse-glow_2.4s_ease-in-out_infinite]">
        <Flame className="h-3 w-3" /> Just Dropped
      </span>
    );
  }
  return (
    <span className="font-accent inline-flex items-center gap-1 rounded-full bg-primary-glow px-3 py-1 text-[10px] font-semibold text-primary-foreground">
      <Sparkles className="h-3 w-3" /> New Arrival
    </span>
  );
}
