import { Heart } from "lucide-react";
import { DropBadge } from "./DropBadge";
import { getDropStatus, formatPrice } from "@/lib/dropEngine";
import type { Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  const status = getDropStatus(product.createdAt);
  const lowStock = product.stock > 0 && product.stock <= 3;

  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted shadow-card transition-shadow duration-500 group-hover:shadow-hover">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <DropBadge status={status} />
        </div>
        <button
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur-md transition hover:bg-background hover:text-primary"
        >
          <Heart className="h-4 w-4" />
        </button>
        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <button className="font-accent w-full rounded-full bg-foreground py-3 text-xs font-semibold text-background hover:bg-primary">
            Quick Add
          </button>
        </div>
      </div>
      <div className="mt-4 space-y-1">
        <p className="font-accent text-[10px] text-muted-foreground">{product.category}</p>
        <h3 className="text-base font-medium text-foreground">{product.name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-primary">{formatPrice(product.price)}</p>
          {lowStock && (
            <p className="flex items-center gap-1 text-xs text-amber">
              <span className="h-1.5 w-1.5 rounded-full bg-amber" />
              Only {product.stock} left
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
