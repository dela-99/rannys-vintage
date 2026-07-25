import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(183,128,255,0.22),_transparent_45%),linear-gradient(135deg,_#f8f1ff_0%,_#efe6ff_45%,_#f6edff_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(95,42,172,0.16),_transparent_35%)]" />
      <div className="relative w-full max-w-md">
        <Link
          to="/"
          params={{}}
          className="font-accent mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary transition-colors hover:text-primary/80"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Home
        </Link>

        <div className="rounded-[32px] border border-white/40 bg-white/70 p-6 shadow-[0_30px_70px_-30px_rgba(101,54,193,0.45)] backdrop-blur-xl sm:p-8">
          <div className="mb-8 text-center">
            <span className="font-accent text-[10px] uppercase tracking-[0.3em] text-primary">
              Ranny&apos;s Vintage
            </span>
            <h1 className="font-display mt-3 text-3xl text-foreground sm:text-4xl">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
          </div>

          {children}

          <div className="mt-8 text-center text-sm text-muted-foreground">{footer}</div>
        </div>
      </div>
    </div>
  );
}
