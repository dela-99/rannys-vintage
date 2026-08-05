import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { z } from "zod";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ProductCard } from "@/components/ProductCard";
import { ShopFilters, type ShopFilterState, type SortOption } from "@/components/ShopFilters";
import { categoryNames, type Product } from "@/data/products";
import { isNewArrival } from "@/lib/dropEngine";
import { productService } from "@/services/productService";

const shopSearchSchema = z.object({
  page: z.preprocess((value) => {
    if (typeof value === "string") {
      const parsed = Number.parseInt(value, 10);
      return Number.isNaN(parsed) ? 1 : parsed;
    }
    return value;
  }, z.number().int().positive().catch(1)),
  search: z.string().optional(),
  categories: z.array(z.enum(categoryNames)).optional(),
  sort: z.enum(["featured", "newest", "price-asc", "price-desc"]).catch("featured"),
  priceMax: z.number().optional(),
  newOnly: z.boolean().optional(),
  trendingOnly: z.boolean().optional(),
  inStockOnly: z.boolean().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: shopSearchSchema,
  head: () => ({
    meta: [
      { title: "Shop — Ranny's Vintage Clothing" },
      {
        name: "description",
        content:
          "Shop dresses, shoes, jewelry & chains. Fresh drops weekly from Ranny's Vintage Clothing.",
      },
      { property: "og:title", content: "Shop the Drop — Ranny's Vintage Clothing" },
      {
        property: "og:description",
        content: "Curated luxury, freshly imported. Shop the latest pieces.",
      },
    ],
  }),
  component: ShopPage,
});

const PAGE_SIZE = 8;

function ShopPage() {
  const filters = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    productService
      .listPublished({ limit: 100 })
      .then((result) => {
        if (!mounted) {
          return;
        }

        setProducts(result.products);
        setError("");
      })
      .catch((loadError) => {
        if (!mounted) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : "Products could not be loaded.");
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const page = filters.page ?? 1;
  const maxPrice = useMemo(
    () => Math.max(50, ...products.map((product) => product.price)),
    [products],
  );
  const filterState = useMemo<ShopFilterState>(
    () => ({
      categories: filters.categories ?? [],
      search: filters.search ?? "",
      sort: filters.sort ?? "featured",
      priceMax: filters.priceMax ?? maxPrice,
      newOnly: filters.newOnly ?? false,
      trendingOnly: filters.trendingOnly ?? false,
      inStockOnly: filters.inStockOnly ?? false,
    }),
    [
      filters.categories,
      filters.newOnly,
      filters.priceMax,
      filters.search,
      filters.sort,
      filters.trendingOnly,
      filters.inStockOnly,
      maxPrice,
    ],
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = filterState.search.trim().toLowerCase();
    let list = products.filter((p) => {
      if (filterState.categories.length && !filterState.categories.includes(p.category)) {
        return false;
      }

      if (filterState.newOnly && !isNewArrival(p.createdAt)) return false;
      if (filterState.trendingOnly && !p.trending) return false;
      if (filterState.inStockOnly && p.stock === 0) return false;
      if (filterState.priceMax && p.price > filterState.priceMax) return false;
      if (q && !`${p.name} ${p.category}`.toLowerCase().includes(q)) return false;
      return true;
    });
    list = sortProducts(list, filterState.sort);
    return list;
  }, [filterState, products]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = filtered.length > visible.length;

  const updateFilters = (next: Partial<ShopFilterState>) => {
    navigate({
      search: (prev: z.infer<typeof shopSearchSchema>) => ({ ...prev, ...next, page: 1 }),
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 md:pt-28">
        {/* Hero */}
        <section className="border-b border-border bg-gradient-soft">
          <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
            <p className="font-accent text-[10px] text-primary">The Edit</p>
            <h1 className="font-display mt-2 text-4xl md:text-6xl">Shop the Drop</h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Hand-picked pieces, freshly imported. Filter by category, price and what's trending
              right now.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          {/* Search + sort */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={filterState.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                placeholder="Search dresses, shoes, chains..."
                className="h-12 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileOpen(true)}
                className="font-accent inline-flex items-center gap-2 rounded-full border border-border px-4 py-3 text-xs font-semibold md:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
              <select
                value={filterState.sort}
                onChange={(e) => updateFilters({ sort: e.target.value as SortOption })}
                className="font-accent h-12 rounded-full border border-border bg-background px-4 text-xs font-semibold outline-none focus:border-primary"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-[260px_1fr]">
            {/* Desktop sidebar */}
            <aside className="hidden md:block">
              <div className="sticky top-28">
                <ShopFilters
                  filters={filterState}
                  onChange={(f) => updateFilters(f)}
                  maxPrice={maxPrice}
                />
              </div>
            </aside>

            {/* Grid */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="text-foreground">{visible.length}</span> of{" "}
                  {filtered.length} pieces
                </p>
              </div>

              {loading ? (
                <SkeletonGrid />
              ) : error ? (
                <LoadError message={error} onRetry={() => window.location.reload()} />
              ) : products.length === 0 ? (
                <CatalogueEmptyState />
              ) : visible.length === 0 ? (
                <EmptyState onReset={() => navigate({ search: { page: 1 }, replace: true })} />
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
                  {visible.map((p, i) => (
                    <div
                      key={p.id}
                      className="animate-[fade-up_0.6s_var(--transition-smooth)_both]"
                      style={{ animationDelay: `${(i % PAGE_SIZE) * 60}ms` }}
                    >
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              )}

              {hasMore && (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={() =>
                      navigate({
                        search: (prev: z.infer<typeof shopSearchSchema>) => ({
                          ...prev,
                          page: page + 1,
                        }),
                      })
                    }
                    className="font-accent rounded-full border border-foreground px-8 py-3 text-xs font-semibold text-foreground transition hover:bg-foreground hover:text-background"
                  >
                    Load more
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />

      {/* Mobile filter drawer */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-60 bg-foreground/40 backdrop-blur-sm transition-opacity md:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed bottom-0 left-0 right-0 z-70 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-background p-6 shadow-hover transition-transform duration-500 md:hidden ${
          mobileOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-2xl">Filters</h3>
          <button onClick={() => setMobileOpen(false)} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <ShopFilters filters={filterState} onChange={(f) => updateFilters(f)} maxPrice={maxPrice} />
        <button
          onClick={() => setMobileOpen(false)}
          className="font-accent mt-6 block w-full rounded-full bg-foreground py-3 text-xs font-semibold text-background"
        >
          Show {filtered.length} results
        </button>
      </aside>
    </div>
  );
}

function LoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
      <h3 className="font-display text-2xl">Products could not load</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{message}</p>
      <button
        onClick={onRetry}
        className="font-accent mt-6 rounded-full bg-foreground px-6 py-3 text-xs font-semibold text-background hover:bg-primary"
      >
        Retry
      </button>
    </div>
  );
}

function sortProducts<T extends { price: number; createdAt: string }>(list: T[], sort: SortOption) {
  const arr = [...list];
  switch (sort) {
    case "newest":
      return arr.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    default:
      return arr;
  }
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-4/5 rounded-xl bg-muted" />
          <div className="mt-3 h-3 w-1/3 rounded bg-muted" />
          <div className="mt-2 h-4 w-2/3 rounded bg-muted" />
          <div className="mt-2 h-4 w-1/4 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-primary-soft">
        <Search className="h-7 w-7 text-primary" />
      </div>
      <h3 className="font-display mt-4 text-2xl">No pieces match your filters</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Try adjusting your filters or clearing them to discover more.
      </p>
      <button
        onClick={onReset}
        className="font-accent mt-6 rounded-full bg-foreground px-6 py-3 text-xs font-semibold text-background hover:bg-primary"
      >
        Clear filters
      </button>
    </div>
  );
}

function CatalogueEmptyState() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-primary-soft">
        <Search className="h-7 w-7 text-primary" />
      </div>
      <h3 className="font-display mt-4 text-2xl">We're preparing our latest collection</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Our boutique catalogue is currently empty. Check back soon for our newest arrivals.
      </p>
    </div>
  );
}
