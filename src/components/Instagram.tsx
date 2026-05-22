import d1 from "@/assets/product-dress-1.jpg";
import d2 from "@/assets/product-dress-2.jpg";
import d3 from "@/assets/product-dress-3.jpg";
import h from "@/assets/product-heels.jpg";
import b from "@/assets/product-bag.jpg";
import c from "@/assets/collection-side-1.jpg";
import { Instagram as IG } from "lucide-react";

const tiles = [d1, d2, d3, h, b, c];

export function Instagram() {
  return (
    <section className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="font-accent text-xs text-primary">As Seen On Instagram</p>
          <h2 className="font-display mt-3 text-4xl text-foreground md:text-5xl">
            <em className="text-gradient not-italic">@rannysclothing</em>
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-6 md:gap-3">
          {tiles.map((src, i) => (
            <a key={i} href="#" className="group relative aspect-square overflow-hidden rounded-xl">
              <img
                src={src}
                alt={`Instagram post ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
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
