/* eslint-disable prettier/prettier */
export function Placeholder({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-8 shadow-card">
      <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-12 text-center">
        <h3 className="font-display text-xl">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This management interface will be built in a future phase.
        </p>
      </div>
    </div>
  );
}
