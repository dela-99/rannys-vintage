interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h2 className="font-display text-3xl font-bold text-foreground">
        {title}
      </h2>
      {children}
    </div>
  );
}