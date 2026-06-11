import { Plane, ShoppingBag, Heart } from "lucide-react";

const stats = [
  { icon: Plane, label: "Imported Fresh", value: "Bi-monthly trips" },
  { icon: ShoppingBag, label: "500+ Styles", value: "Curated weekly" },
  { icon: Heart, label: "Happy Customers", value: "Across Ghana" },
];

export function BrandStory() {
  return (
    <section className="bg-primary-soft px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-5xl text-center">
        <p className="font-accent text-xs text-primary">The Ranny Story</p>
        <h2 className="font-display mt-3 text-4xl text-foreground md:text-6xl">
          Handpicked. <em className="text-gradient not-italic">Imported.</em> Loved.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-muted-foreground md:text-lg">
          Every few weeks, Ranny sources the freshest, most current New Styles — so you're never
          wearing yesterday's trend. From international ateliers to your wardrobe in Accra.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-background p-8 shadow-card transition hover:shadow-hover"
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full gradient-primary text-primary-foreground">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display mt-5 text-2xl text-foreground">{s.label}</h3>
              <p className="font-accent mt-2 text-[11px] text-muted-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
