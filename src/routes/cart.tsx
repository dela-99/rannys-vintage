import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/dropEngine";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — Ranny's Vintage Clothing" },
      { name: "description", content: "Review your selected pieces and check out via WhatsApp." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, remove, setQuantity, subtotal, count, clear } = useCart();

  const handleCheckout = () => {
    const lines = items
      .map((i) => `• ${i.product.name}${i.size ? ` (Size ${i.size})` : ""} × ${i.quantity}`)
      .join("%0A");
    const msg = `Hi Ranny's! I'd like to place this order:%0A${lines}%0A%0ATotal: ${formatPrice(subtotal)}`;
    window.open(`https://wa.me/233000000000?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 md:pt-28">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-accent text-[10px] text-primary">Bag</p>
              <h1 className="font-display mt-1 text-4xl md:text-5xl">Your selection</h1>
            </div>
            {items.length > 0 && (
              <button
                onClick={clear}
                className="font-accent text-[10px] text-muted-foreground hover:text-destructive"
              >
                Clear bag
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-primary-soft">
                <ShoppingBag className="h-9 w-9 text-primary" />
              </div>
              <h2 className="font-display mt-4 text-3xl">Your bag is empty</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Discover the latest drop and find your next favourite piece.
              </p>
              <Link
                to="/shop"
                className="font-accent mt-6 rounded-full bg-foreground px-8 py-3 text-xs font-semibold text-background hover:bg-primary"
              >
                Shop now
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-10 md:grid-cols-[1fr_360px]">
              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 py-6">
                    <Link
                      to="/products/$productId"
                      params={{ productId: item.product.id }}
                      className="block h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-muted"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-accent text-[10px] text-muted-foreground">
                            {item.product.category}
                          </p>
                          <Link
                            to="/products/$productId"
                            params={{ productId: item.product.id }}
                            className="font-display text-lg hover:text-primary"
                          >
                            {item.product.name}
                          </Link>
                          {item.size && (
                            <p className="text-xs text-muted-foreground">Size {item.size}</p>
                          )}
                        </div>
                        <p className="font-semibold text-primary">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="inline-flex items-center rounded-full border border-border">
                          <button
                            onClick={() => setQuantity(item.id, item.quantity - 1)}
                            className="grid h-9 w-9 place-items-center hover:text-primary"
                            aria-label="Decrease"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => setQuantity(item.id, item.quantity + 1)}
                            className="grid h-9 w-9 place-items-center hover:text-primary"
                            aria-label="Increase"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => remove(item.id)}
                          className="font-accent flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" /> Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <aside className="h-fit rounded-2xl border border-border bg-gradient-soft p-6 md:sticky md:top-28">
                <h3 className="font-display text-2xl">Order summary</h3>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Items ({count})</dt>
                    <dd>{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Shipping</dt>
                    <dd className="text-muted-foreground">Calculated at checkout</dd>
                  </div>
                </dl>
                <div className="mt-4 flex justify-between border-t border-border pt-4">
                  <span className="font-accent text-xs">Subtotal</span>
                  <span className="font-display text-2xl">{formatPrice(subtotal)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="font-accent mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-success py-4 text-xs font-semibold text-white hover:opacity-90"
                >
                  <MessageCircle className="h-4 w-4" /> Checkout via WhatsApp
                </button>
                <Link
                  to="/shop"
                  className="font-accent mt-2 block w-full rounded-full border border-border py-3 text-center text-xs font-semibold hover:bg-background"
                >
                  Continue shopping
                </Link>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
