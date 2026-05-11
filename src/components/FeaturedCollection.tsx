import main from "@/assets/collection-main.jpg";
import side1 from "@/assets/collection-side-1.jpg";
import side2 from "@/assets/collection-side-2.jpg";
import { ArrowRight } from "lucide-react";

export function FeaturedCollection() {
  return (
    <section className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 md:gap-10">
        <div className="relative overflow-hidden rounded-3xl shadow-card">
          <img src={main} alt="The Confidence Edit" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-between gap-6">
          <div className="space-y-5">
            <p className="font-accent text-xs text-primary">The Edit</p>
            <h2 className="font-display text-4xl text-foreground md:text-6xl">
              The Confidence <em className="text-gradient not-italic">Edit</em>
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Soft silhouettes, bold accents, and silky textures curated for the woman who shows up — and stays.
            </p>
            <button className="font-accent group inline-flex items-center gap-2 rounded-full gradient-primary px-8 py-4 text-xs font-semibold text-primary-foreground shadow-card transition hover:shadow-hover">
              Explore Collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={side1} alt="Jewelry detail" loading="lazy" className="aspect-square w-full rounded-2xl object-cover shadow-card" />
            <img src={side2} alt="Fabric detail" loading="lazy" className="aspect-square w-full rounded-2xl object-cover shadow-card" />
          </div>
        </div>
      </div>
    </section>
  );
}
