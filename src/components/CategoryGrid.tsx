import dress from "@/assets/product-dress-3.jpg";
import shoes from "@/assets/product-heels.jpg";
import chain from "@/assets/product-chains.jpg";
import bag from "@/assets/product-bag.jpg";
import jewel from "@/assets/collection-side-1.jpg";

const categories = [
  { name: "Dresses", img: dress, span: "md:col-span-2 md:row-span-2", icon: "👗" },
  { name: "Shoes", img: shoes, span: "" },
  { name: "Jewelry", img: jewel, span: "" },
  { name: "Chains", img: chain, span: "" },
  { name: "Accessories", img: bag, span: "" },
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

        <div className="grid auto-rows-[180px] grid-cols-2 gap-4 md:auto-rows-[220px] md:grid-cols-4 md:gap-6">
          {categories.map((c) => (
            <a
              key={c.name}
              href="#"
              className={`group relative overflow-hidden rounded-2xl bg-foreground shadow-card transition hover:shadow-hover ${c.span}`}
            >
              <img
                src={c.img}
                alt={c.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent transition-opacity group-hover:from-primary/85" />
              <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-7">
                <span className="text-2xl">{c.icon}</span>
                <h3 className="font-display mt-1 text-2xl text-white md:text-3xl">{c.name}</h3>
                <span className="font-accent mt-1 text-[10px] text-white/80">Explore →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
