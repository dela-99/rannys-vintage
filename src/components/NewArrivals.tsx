import { ProductCard } from "./ProductCard";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import type { Product } from "@/data/products";

export function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let mounted = true;

    productService
      .listPublished({ limit: 4 })
      .then((result) => {
        if (mounted) {
          setProducts(result.products);
        }
      })
      .catch(() => {
        if (mounted) {
          setProducts([]);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="font-accent text-xs text-primary">Just Landed</p>
            <h2 className="font-display mt-3 text-4xl text-foreground md:text-6xl">
              New <em className="text-gradient not-italic">Styles</em>
            </h2>
            <p className="mt-4 text-muted-foreground">
              The newest pieces in the studio — handpicked, flown in, and dropped before they sell
              out.
            </p>
          </div>
          <button className="font-accent group inline-flex items-center gap-2 text-xs font-semibold text-foreground hover:text-primary">
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {products.length > 0 ? (
          <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 no-scrollbar md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
            {products.map((p) => (
              <div key={p.id} className="w-[78%] shrink-0 snap-start md:w-auto">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/20 px-4 py-12 text-center">
            <h3 className="font-display text-2xl text-foreground">New arrivals coming soon.</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              We're preparing our latest collection of boutique pieces. Check back soon for fresh drops.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
