import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";
import { formatOperationalStatus, getInventoryStatus } from "@/data/operations";
import { exportCsv } from "@/lib/csv";
import { operationsService } from "@/services/operationsService";
import { Archive, Download, EyeOff, Loader2, Minus, Plus, RotateCcw, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const PAGE_SIZE = 25;
const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function InventoryComponent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const canLoadMore = (page + 1) * PAGE_SIZE < total;

  const alerts = useMemo(
    () => ({
      lowStock: products.filter((product) => product.stock > 0 && product.stock <= 5).length,
      outOfStock: products.filter((product) => product.stock <= 0).length,
      recentlyUpdated: products.filter(
        (product) => Date.now() - new Date(product.updatedAt).getTime() <= 7 * 86400000,
      ).length,
    }),
    [products],
  );

  const loadInventory = useCallback(async () => {
    setLoading(true);

    try {
      const result = await operationsService.listInventory({
        search,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      });
      setProducts(result.items);
      setTotal(result.total);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Inventory could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadInventory(), 250);
    return () => window.clearTimeout(timeout);
  }, [loadInventory]);

  const updateProduct = async (product: Product, updates: Partial<Product>, message: string) => {
    const previousProducts = products;
    setProducts((current) =>
      current.map((item) =>
        item.documentId === product.documentId ? { ...item, ...updates } : item,
      ),
    );

    try {
      const updated = await operationsService.updateInventory(product.documentId, updates);
      setProducts((current) =>
        current.map((item) => (item.documentId === product.documentId ? updated : item)),
      );
      toast.success(message);
    } catch (error) {
      setProducts(previousProducts);
      toast.error(error instanceof Error ? error.message : "Inventory update failed.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory">
        <Button
          variant="outline"
          className="bg-white"
          onClick={() =>
            exportCsv(
              "inventory.csv",
              products.map((product) => ({
                sku: product.productId,
                product: product.name,
                category: product.category,
                subcategory: product.subcategory,
                stock: product.stock,
                status: getInventoryStatus(product.stock),
                updatedAt: product.updatedAt,
              })),
            )
          }
        >
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-3">
        <AlertCard label="Low Stock" value={alerts.lowStock} tone="amber" />
        <AlertCard label="Out of Stock" value={alerts.outOfStock} tone="destructive" />
        <AlertCard label="Recently Updated" value={alerts.recentlyUpdated} tone="success" />
      </div>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            placeholder="Search inventory by SKU, product, category..."
            className="w-full rounded-lg border border-border bg-transparent py-2 pl-10 pr-4"
          />
        </div>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading inventory...
          </div>
        ) : products.length === 0 ? (
          <EmptyState message="No inventory available." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs text-muted-foreground">
                <tr>
                  <th className="py-3 pr-4 font-medium">Image</th>
                  <th className="py-3 pr-4 font-medium">SKU</th>
                  <th className="py-3 pr-4 font-medium">Product</th>
                  <th className="py-3 pr-4 font-medium">Category</th>
                  <th className="py-3 pr-4 font-medium">Subcategory</th>
                  <th className="py-3 pr-4 font-medium">Current Stock</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 pr-4 font-medium">Last Updated</th>
                  <th className="py-3 pr-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.documentId} className="border-b border-border/70">
                    <td className="py-3 pr-4">
                      {product.image && (
                        <img
                          src={product.image}
                          alt=""
                          className="h-14 w-11 rounded-lg object-cover"
                        />
                      )}
                    </td>
                    <td className="py-3 pr-4 text-xs text-muted-foreground">{product.productId}</td>
                    <td className="py-3 pr-4 font-medium">{product.name}</td>
                    <td className="py-3 pr-4">{product.category}</td>
                    <td className="py-3 pr-4">{product.subcategory}</td>
                    <td className="py-3 pr-4">{product.stock}</td>
                    <td className="py-3 pr-4">
                      <InventoryBadge stock={product.stock} />
                    </td>
                    <td className="py-3 pr-4">
                      {dateFormatter.format(new Date(product.updatedAt))}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-2">
                        <ActionButton
                          label="Increase stock"
                          onClick={() =>
                            updateProduct(product, { stock: product.stock + 1 }, "Stock increased.")
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </ActionButton>
                        <ActionButton
                          label="Decrease stock"
                          onClick={() =>
                            updateProduct(
                              product,
                              { stock: Math.max(0, product.stock - 1) },
                              "Stock decreased.",
                            )
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </ActionButton>
                        <ActionButton
                          label="Mark out of stock"
                          onClick={() =>
                            updateProduct(product, { stock: 0 }, "Marked out of stock.")
                          }
                        >
                          0
                        </ActionButton>
                        <ActionButton
                          label="Hide product"
                          onClick={() =>
                            updateProduct(product, { visible: false }, "Product hidden.")
                          }
                        >
                          <EyeOff className="h-4 w-4" />
                        </ActionButton>
                        <ActionButton
                          label="Archive product"
                          onClick={() =>
                            updateProduct(
                              product,
                              { status: "archived", visible: false },
                              "Product archived.",
                            )
                          }
                        >
                          <Archive className="h-4 w-4" />
                        </ActionButton>
                        <ActionButton
                          label="Restore product"
                          onClick={() =>
                            updateProduct(
                              product,
                              { status: "published", visible: true },
                              "Product restored.",
                            )
                          }
                        >
                          <RotateCcw className="h-4 w-4" />
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {page + 1} · {total} inventory items
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0 || loading}
              onClick={() => setPage((current) => Math.max(0, current - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!canLoadMore || loading}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InventoryBadge({ stock }: { stock: number }) {
  const status = getInventoryStatus(stock);
  const className =
    status === "available"
      ? "bg-success/10 text-success"
      : status === "low-stock"
        ? "bg-amber/10 text-amber"
        : "bg-destructive/10 text-destructive";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${className}`}>
      {formatOperationalStatus(status)}
    </span>
  );
}

function AlertCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  const toneClass =
    tone === "destructive"
      ? "text-destructive"
      : tone === "success"
        ? "text-success"
        : "text-amber";

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
      <p className="font-accent text-[10px] text-muted-foreground">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}

function ActionButton({
  label,
  children,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-border px-2 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}
