import { Instagram as IG } from "lucide-react";

const tiles = Array.from({ length: 6 });

export function Instagram() {
  return (
    <section className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="font-accent text-xs text-primary">As Seen On Instagram</p>
          <a
            href="https://www.instagram.com/shop_rannys"
            target="_blank"
            rel="noreferrer"
            className="inline-block group"
          >
            <h2 className="font-display mt-3 text-4xl text-foreground md:text-5xl transition-colors group-hover:text-primary">
              <em className="text-gradient not-italic">@rannysclothing</em>
            </h2>
          </a>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-6 md:gap-3">
          {tiles.map((src, i) => (
            <a
              key={i}
              href="https://www.instagram.com/shop_rannys"
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl"
            >
              <div className="h-full w-full bg-gradient-to-br from-primary-soft via-background to-primary/30 transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 grid place-items-center bg-primary/0 transition group-hover:bg-primary/70">
                <IG className="h-6 w-6 text-white opacity-0 transition group-hover:opacity-100" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
