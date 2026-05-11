import { products } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { Eye } from "lucide-react";

export function Trending() {
  return (
    <section className="bg-foreground px-4 py-20 text-background md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-xl">
          <p className="font-accent text-xs text-primary-glow">Trending Now</p>
          <h2 className="font-display mt-3 text-4xl text-background md:text-6xl">
            Everyone&apos;s <em className="not-italic text-gradient">Obsessed</em> With
          </h2>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-background/70">
            <Eye className="h-4 w-4" /> 1,247 people shopping right now
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
          {products.slice(2, 6).map((p) => (
            <div key={p.id} className="text-foreground">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
