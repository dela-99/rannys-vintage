import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/dropEngine";

export function CartDrawer() {
  const { items, drawerOpen, closeDrawer, remove, setQuantity, subtotal, count } = useCart();

  return (
    <>
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        aria-hidden={!drawerOpen}
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-background shadow-hover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl">Your Bag ({count})</h2>
          </div>
          <button onClick={closeDrawer} aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-primary-soft">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-display text-xl">Your bag is empty</p>
                <p className="mt-1 text-sm text-muted-foreground">Discover our latest drop.</p>
              </div>
              <Link
                to="/shop"
                onClick={closeDrawer}
                className="font-accent rounded-full bg-foreground px-6 py-3 text-xs font-semibold text-background hover:bg-primary"
              >
                Shop now
              </Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <Link
                    to="/products/$productId"
                    params={{ productId: item.product.id }}
                    onClick={closeDrawer}
                    className="block h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-muted"
                  >
                    <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="font-accent text-[10px] text-muted-foreground">
                          {item.product.category}
                        </p>
                        <p className="text-sm font-medium">{item.product.name}</p>
                        {item.size && (
                          <p className="text-xs text-muted-foreground">Size {item.size}</p>
                        )}
                      </div>
                      <button onClick={() => remove(item.id)} aria-label="Remove">
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="inline-flex items-center rounded-full border border-border">
                        <button
                          onClick={() => setQuantity(item.id, item.quantity - 1)}
                          className="grid h-8 w-8 place-items-center hover:text-primary"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                          className="grid h-8 w-8 place-items-center hover:text-primary"
                          aria-label="Increase"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-primary">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-border px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="font-accent text-xs text-muted-foreground">Subtotal</span>
              <span className="font-display text-2xl">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                to="/cart"
                onClick={closeDrawer}
                className="font-accent block w-full rounded-full bg-foreground py-3 text-center text-xs font-semibold text-background hover:bg-primary"
              >
                View bag & checkout
              </Link>
              <button
                onClick={closeDrawer}
                className="font-accent w-full rounded-full border border-border py-3 text-xs font-semibold hover:bg-primary-soft"
              >
                Continue shopping
              </button>
            </div>
          </footer>
        )}
      </aside>
    </>
  );
}
