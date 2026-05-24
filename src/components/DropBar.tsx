import { Flame } from "lucide-react";

const items = [
  "Ranny just brought in 100+ new styles",
  "Fresh pieces just landed",
  "Free delivery in Accra over GH₵ 500",
  "Order via WhatsApp 24/7",
];

export function DropBar() {
  return (
    <div className="bg-foreground py-3 text-background overflow-hidden">
      <div className="flex animate-[marquee_25s_linear_infinite] whitespace-nowrap">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="font-accent mx-8 inline-flex items-center gap-3 text-[11px]">
            <Flame className="h-3 w-3 text-primary-glow" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
