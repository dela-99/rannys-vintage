import { Link } from "@tanstack/react-router";

export function AccessDenied() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md rounded-[32px] border border-white/40 bg-white/80 p-8 text-center shadow-[0_30px_70px_-30px_rgba(101,54,193,0.45)] backdrop-blur-xl">
        <span className="font-accent text-[10px] uppercase tracking-[0.3em] text-primary">
          Ranny&apos;s Vintage
        </span>
        <h1 className="font-display mt-4 text-3xl text-foreground">Access Denied</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          You don&apos;t have permission to access this page.
        </p>
        <Link
          to="/"
          className="font-accent mt-6 inline-flex rounded-full bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-background transition-colors hover:bg-primary"
        >
          Return to Store
        </Link>
      </div>
    </div>
  );
}
