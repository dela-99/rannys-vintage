import { ArrowRight } from "lucide-react";

export function FeaturedCollection() {
  return (
    <section className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 md:gap-10">
        <div className="relative min-h-[420px] overflow-hidden rounded-3xl bg-gradient-to-br from-foreground via-primary to-primary-soft shadow-card">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_22%,rgba(255,255,255,0.35),transparent_34%)]" />
          <div className="absolute bottom-8 left-8 max-w-xs text-white">
            <p className="font-accent text-[10px] text-white/70">Real Collection Pending</p>
            <p className="font-display mt-2 text-4xl">Boutique imagery coming soon.</p>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-6">
          <div className="space-y-5">
            <p className="font-accent text-xs text-primary">The Edit</p>
            <h2 className="font-display text-4xl text-foreground md:text-6xl">
              The Confidence <em className="text-gradient not-italic">Edit</em>
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Soft silhouettes, bold accents, and silky textures curated for the woman who shows up
              — and stays.
            </p>
            <button className="font-accent group inline-flex items-center gap-2 rounded-full gradient-primary px-8 py-4 text-xs font-semibold text-primary-foreground shadow-card transition hover:shadow-hover">
              Explore Collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-primary-soft to-primary/40 shadow-card" />
            <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-foreground/90 to-primary/50 shadow-card" />
          </div>
        </div>
      </div>
    </section>
  );
}
