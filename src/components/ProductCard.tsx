import { Link } from "@tanstack/react-router";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { DropBadge } from "./DropBadge";
import { getDropStatus, formatPrice } from "@/lib/dropEngine";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  const status = getDropStatus(product.createdAt, product.trending);
  const lowStock = product.stock > 0 && product.stock <= 3;
  const soldOut = product.stock === 0;
  const { add } = useCart();

  return (
    <div className="group relative flex flex-col">
      <Link
        to="/products/$productId"
        params={{ productId: product.id }}
        className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-muted shadow-card transition-shadow duration-500 group-hover:shadow-hover"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
            product.hoverImage ? "group-hover:opacity-0" : "group-hover:scale-105"
          }`}
        />
        {product.hoverImage && (
          <img
            src={product.hoverImage}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          <DropBadge status={status} />
          {soldOut && (
            <span className="font-accent inline-flex items-center rounded-full bg-foreground/90 px-3 py-1 text-[10px] font-semibold text-background">
              Sold Out
            </span>
          )}
        </div>

        <button
          aria-label="Add to wishlist"
          onClick={(e) => e.preventDefault()}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur-md transition hover:bg-background hover:text-primary"
        >
          <Heart className="h-4 w-4" />
        </button>

        <div className="absolute inset-x-3 bottom-3 flex translate-y-3 gap-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            disabled={soldOut}
            onClick={(e) => {
              e.preventDefault();
              if (!soldOut) add(product);
            }}
            className="font-accent flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground py-3 text-xs font-semibold text-background transition hover:bg-primary disabled:opacity-50"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {soldOut ? "Sold Out" : "Quick Add"}
          </button>
          <span
            aria-label="Quick view"
            className="grid h-11 w-11 place-items-center rounded-full bg-background text-foreground transition hover:bg-primary hover:text-primary-foreground"
          >
            <Eye className="h-4 w-4" />
          </span>
        </div>
      </Link>

      <div className="mt-4 space-y-1">
        <p className="font-accent text-[10px] text-muted-foreground">{product.category}</p>
        <h3 className="text-base font-medium text-foreground">
          <Link to="/products/$productId" params={{ productId: product.id }} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
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
