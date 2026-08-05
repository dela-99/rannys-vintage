import { Loader2 } from "lucide-react";

export function AdminWelcomeScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(183,128,255,0.26),_transparent_42%),linear-gradient(135deg,_#13091f_0%,_#24123a_48%,_#3b1b5d_100%)] px-4 text-white">
      <div className="animate-in fade-in duration-700 text-center">
        <p className="font-accent text-xs uppercase tracking-[0.4em] text-primary-glow">
          RANNY&apos;S VINTAGE CLOTHING
        </p>
        <h1 className="font-display mt-6 text-4xl font-semibold md:text-5xl">Welcome back 👋</h1>
        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm text-white/85 shadow-2xl backdrop-blur">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading Dashboard...
        </div>
      </div>
    </div>
  );
}
