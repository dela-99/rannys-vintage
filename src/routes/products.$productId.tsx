import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, MessageCircle, Minus, Plus, ShoppingBag, Truck, RotateCcw, Shield } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ProductCard } from "@/components/ProductCard";
import { DropBadge } from "@/components/DropBadge";
import { getProductById, getRelatedProducts } from "@/data/products";
import { formatPrice, getDropStatus } from "@/lib/dropEngine";
import { useCart } from "@/context/CartContext";

export const Route = createFileRoute("/products/$productId")({
  loader: ({ params }) => {
    const product = getProductById(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Ranny's Clothing` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: loaderData.product.name },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-background">
      <div className="text-center">
        <h1 className="font-display text-4xl">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-primary underline">Back to shop</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="grid min-h-screen place-items-center">
      <p>{error.message}</p>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const status = getDropStatus(product.createdAt, product.trending);
  const related = getRelatedProducts(product);
  const { add, openDrawer } = useCart();

  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<string | undefined>(product.sizes?.[0]);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState({ x: 50, y: 50, on: false });

  const soldOut = product.stock === 0;

  const handleAdd = () => {
    if (soldOut) return;
    add(product, { size, quantity: qty });
  };

  const handleWhatsApp = () => {
    const msg = `Hi Ranny's! I'd like to order:%0A• ${product.name}${size ? ` (Size ${size})` : ""}%0AQty: ${qty}%0APrice: ${formatPrice(product.price * qty)}`;
    window.open(`https://wa.me/233000000000?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 md:pt-24">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <nav className="font-accent mb-6 text-[10px] text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-primary">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid gap-8 md:grid-cols-2 md:gap-14">
            {/* Gallery */}
            <div className="flex flex-col-reverse gap-4 md:flex-row">
              {product.gallery.length > 1 && (
                <div className="flex gap-3 overflow-x-auto md:flex-col">
                  {product.gallery.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-lg transition md:h-24 md:w-20 ${
                        activeImage === i ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              <div
                className="relative aspect-[4/5] flex-1 overflow-hidden rounded-2xl bg-muted shadow-card"
                onMouseEnter={() => setZoom((z) => ({ ...z, on: true }))}
                onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  setZoom({
                    x: ((e.clientX - r.left) / r.width) * 100,
                    y: ((e.clientY - r.top) / r.height) * 100,
                    on: true,
                  });
                }}
              >
                <img
                  src={product.gallery[activeImage]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500"
                  style={
                    zoom.on
                      ? { transform: "scale(1.6)", transformOrigin: `${zoom.x}% ${zoom.y}%` }
                      : undefined
                  }
                />
                <div className="absolute left-4 top-4">
                  <DropBadge status={status} />
                </div>
              </div>
            </div>

            {/* Details */}
            <div>
              <p className="font-accent text-[10px] text-primary">{product.category}</p>
              <h1 className="font-display mt-2 text-3xl md:text-5xl">{product.name}</h1>
              <p className="mt-3 text-3xl font-semibold text-primary">{formatPrice(product.price)}</p>

              <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>

              <div className="mt-6 flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    soldOut ? "bg-destructive" : product.stock <= 3 ? "bg-amber" : "bg-success"
                  }`}
                />
                <span className="text-sm">
                  {soldOut
                    ? "Sold out"
                    : product.stock <= 3
                      ? `Only ${product.stock} left in stock`
                      : "In stock"}
                </span>
              </div>

              {product.sizes && (
                <div className="mt-8">
                  <div className="font-accent mb-3 flex items-center justify-between text-[10px]">
                    <span>Size</span>
                    <button className="text-primary hover:underline">Size guide</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s: string) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`min-w-[3rem] rounded-full border px-4 py-2 text-sm transition ${
                          size === s
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:border-foreground"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex items-center gap-4">
                <div className="inline-flex items-center rounded-full border border-border">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="grid h-12 w-12 place-items-center hover:text-primary"
                    aria-label="Decrease"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="grid h-12 w-12 place-items-center hover:text-primary"
                    aria-label="Increase"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={handleAdd}
                  disabled={soldOut}
                  className="font-accent flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground py-4 text-xs font-semibold text-background transition hover:bg-primary disabled:opacity-50"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {soldOut ? "Sold Out" : "Add to Bag"}
                </button>
                <button
                  aria-label="Wishlist"
                  className="grid h-12 w-12 place-items-center rounded-full border border-border hover:border-primary hover:text-primary"
                >
                  <Heart className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleWhatsApp}
                className="font-accent mt-3 flex w-full items-center justify-center gap-2 rounded-full border-2 border-success py-4 text-xs font-semibold text-success transition hover:bg-success hover:text-white"
              >
                <MessageCircle className="h-4 w-4" /> Order via WhatsApp
              </button>

              <button
                onClick={openDrawer}
                className="mt-2 w-full text-center text-xs text-muted-foreground hover:text-primary"
              >
                View bag
              </button>

              <div className="mt-8 grid gap-4 border-t border-border pt-8 text-sm md:grid-cols-3">
                <Info icon={<Truck className="h-4 w-4" />} title="Free delivery" body="Accra orders over GH₵ 500" />
                <Info icon={<RotateCcw className="h-4 w-4" />} title="7-day returns" body="On unworn pieces" />
                <Info icon={<Shield className="h-4 w-4" />} title="Authenticity" body="Hand-checked in Accra" />
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <section className="mt-20">
              <div className="mb-6 flex items-end justify-between">
                <h2 className="font-display text-3xl md:text-4xl">You may also love</h2>
                <Link to="/shop" className="font-accent text-[10px] text-primary hover:underline">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function Info({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-primary">{icon}</span>
      <div>
        <p className="font-accent text-[10px]">{title}</p>
        <p className="text-xs text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
