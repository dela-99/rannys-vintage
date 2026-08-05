import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <h3 className="font-display text-3xl font-bold text-foreground">{value}</h3>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-full bg-primary-soft text-primary">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
