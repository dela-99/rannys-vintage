import heroImg from "@/assets/hero.jpg";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative h-svh min-h-[640px] w-full overflow-hidden">
      <img
        src={heroImg}
        alt="Confident woman in a flowing purple dress"
        width={1080}
        height={1920}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 gradient-dark-overlay" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24 md:px-12 md:pb-32">
        <div className="max-w-2xl space-y-6 animate-[fade-up_0.9s_cubic-bezier(0.22,1,0.36,1)_both]">
          <p className="font-accent text-xs text-primary-glow">The November Drop · 2026</p>
          <h1 className="font-display text-5xl leading-[0.95] text-white md:text-7xl lg:text-8xl">
            Chic.
            <br />
            <span className="italic text-gradient">Stylishly</span> Confident.
          </h1>
          <p className="max-w-md text-base text-white/80 md:text-lg">
            Handpicked New Styles arriving weekly — for the woman who walks in like she owns
            the room.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button className="group font-accent inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-xs font-semibold text-foreground transition hover:bg-primary hover:text-primary-foreground">
              Shop New Arrivals
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="font-accent inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-4 text-xs font-semibold text-white transition hover:bg-white/10">
              The Story
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-[fade-in_2s_ease-out_both]">
        <div className="h-12 w-px bg-white/40" />
      </div>
    </section>
  );
}
