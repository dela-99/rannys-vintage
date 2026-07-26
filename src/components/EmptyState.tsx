import { PackageOpen } from "lucide-react";

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-primary-soft">
        <PackageOpen className="h-10 w-10 text-primary" />
      </div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
