import { products } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { ArrowRight } from "lucide-react";

export function NewArrivals() {
  return (
    <section className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="font-accent text-xs text-primary">Just Landed</p>
            <h2 className="font-display mt-3 text-4xl text-foreground md:text-6xl">
              Fresh from <em className="text-gradient not-italic">China</em>
            </h2>
            <p className="mt-4 text-muted-foreground">
              The newest pieces in the studio — handpicked, flown in, and dropped before they sell out.
            </p>
          </div>
          <button className="font-accent group inline-flex items-center gap-2 text-xs font-semibold text-foreground hover:text-primary">
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 no-scrollbar md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <div key={p.id} className="w-[78%] flex-shrink-0 snap-start md:w-auto">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
