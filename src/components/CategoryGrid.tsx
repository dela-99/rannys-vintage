import { Link } from "@tanstack/react-router";

const categories = [
  { name: "Dresses", to: "/shop", search: { category: "Dresses" }, accent: "from-primary/70" },
  { name: "Footwear", to: "/shop", search: { category: "Footwear" }, accent: "from-amber/70" },
  { name: "Jewellery", to: "/shop", search: { category: "Jewellery" }, accent: "from-white/25" },
  { name: "Bags", to: "/shop", search: { category: "Bags" }, accent: "from-primary-glow/60" },
  { name: "Accessories", to: "/shop", search: { category: "Accessories" }, accent: "from-success/50" },
  { name: "New Arrivals", to: "/shop", search: { newOnly: true }, accent: "from-primary/80" },
];

export function CategoryGrid() {
  return (
    <section className="bg-primary-soft px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="font-accent text-xs text-primary">Shop by Category</p>
          <h2 className="font-display mt-3 text-4xl text-foreground md:text-6xl">
            Find Your <em className="text-gradient not-italic">Vibe</em>
          </h2>
        </div>

        <div className="grid auto-rows-[220px] grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {categories.map((c) => (
            <Link
              key={c.name}
              to={c.to}
              search={c.search}
              className="group relative overflow-hidden rounded-2xl bg-foreground shadow-card transition hover:shadow-hover"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-t ${c.accent} via-black/35 to-black transition-transform duration-500 group-hover:scale-105`}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.24),transparent_34%)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity group-hover:from-primary/70" />
              <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-7">
                <h3 className="font-display mt-1 text-2xl text-white md:text-3xl">{c.name}</h3>
                <span className="font-accent mt-1 text-[10px] text-white/80">Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
