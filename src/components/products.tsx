import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { AddProductModal } from "@/components/AddProductModal";
import { Button } from "@/components/ui/button";
import {
  CATEGORIES,
  type Category,
  type Product,
  type ProductInput,
  type ProductStatus,
} from "@/data/products";
import { formatPrice } from "@/lib/dropEngine";
import { productService } from "@/services/productService";
import {
  Archive,
  Download,
  Edit,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";

const PAGE_SIZE = 25;
type AdminSort = "updated-desc" | "created-desc" | "created-asc" | "name-asc" | "price-desc";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function ProductsComponent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [status, setStatus] = useState<ProductStatus | "all">("all");
  const [sort, setSort] = useState<AdminSort>("updated-desc");
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const canLoadMore = (page + 1) * PAGE_SIZE < total;

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? products.filter((product) =>
          `${product.name} ${product.category} ${product.subcategory} ${product.status}`
            .toLowerCase()
            .includes(query),
        )
      : products;

    return [...filtered].sort((first, second) => {
      switch (sort) {
        case "created-asc":
          return +new Date(first.createdAt) - +new Date(second.createdAt);
        case "created-desc":
          return +new Date(second.createdAt) - +new Date(first.createdAt);
        case "name-asc":
          return first.name.localeCompare(second.name);
        case "price-desc":
          return second.price - first.price;
        default:
          return +new Date(second.updatedAt) - +new Date(first.updatedAt);
      }
    });
  }, [products, search, sort]);

  const loadProducts = useCallback(async () => {
    setLoading(true);

    try {
      const result = await productService.listAdmin({
        category,
        status,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      });
      setProducts(result.products);
      setTotal(result.total);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Products could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [category, page, status]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const handleSubmit = async (input: ProductInput, documentId?: string) => {
    if (documentId) {
      await productService.update(documentId, input);
      toast.success("Product updated.");
    } else {
      await productService.create(input);
      toast.success(input.status === "published" ? "Product published." : "Draft saved.");
    }

    await loadProducts();
  };

  const patchProduct = async (
    product: Product,
    updates: Partial<ProductInput>,
    message: string,
  ) => {
    const previousProducts = products;
    setProducts((current) =>
      current.map((item) =>
        item.documentId === product.documentId ? { ...item, ...updates } : item,
      ),
    );

    try {
      await productService.patch(product.documentId, updates);
      toast.success(message);
    } catch (error) {
      setProducts(previousProducts);
      toast.error(error instanceof Error ? error.message : "Product action failed.");
    }
  };

  const deleteProduct = async (product: Product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      return;
    }

    const previousProducts = products;
    setProducts((current) => current.filter((item) => item.documentId !== product.documentId));

    try {
      await productService.delete(product.documentId);
      toast.success("Product deleted.");
    } catch (error) {
      setProducts(previousProducts);
      toast.error(error instanceof Error ? error.message : "Product could not be deleted.");
    }
  };

  const duplicateProduct = async (product: Product) => {
    try {
      await productService.duplicate(product);
      toast.success("Product duplicated as a draft.");
      await loadProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Product could not be duplicated.");
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Products">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="bg-white" onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
          <Link to="/admin/products/bulk-upload">
            <Button variant="outline" className="bg-white">
              <Upload className="mr-2 h-4 w-4" /> Bulk Upload
            </Button>
          </Link>
          <Button variant="outline" className="bg-white" disabled>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </PageHeader>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px_180px_180px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border border-border bg-transparent py-2 pl-10 pr-4"
            />
          </div>
          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value as Category | "all");
              setPage(0);
            }}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as ProductStatus | "all");
              setPage(0);
            }}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as AdminSort)}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
          >
            <option value="updated-desc">Recently updated</option>
            <option value="created-desc">Newest created</option>
            <option value="created-asc">Oldest created</option>
            <option value="name-asc">Name A-Z</option>
            <option value="price-desc">Highest price</option>
          </select>
        </div>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading products...
          </div>
        ) : visibleProducts.length === 0 ? (
          <EmptyState message="No products found." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs text-muted-foreground">
                <tr>
                  <th className="py-3 pr-4 font-medium">Image</th>
                  <th className="py-3 pr-4 font-medium">Product</th>
                  <th className="py-3 pr-4 font-medium">Category</th>
                  <th className="py-3 pr-4 font-medium">Subcategory</th>
                  <th className="py-3 pr-4 font-medium">Price</th>
                  <th className="py-3 pr-4 font-medium">Stock</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 pr-4 font-medium">Created</th>
                  <th className="py-3 pr-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleProducts.map((product) => (
                  <tr key={product.documentId} className="border-b border-border/70">
                    <td className="py-3 pr-4">
                      <img
                        src={product.image}
                        alt=""
                        className="h-14 w-11 rounded-lg object-cover"
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.slug}</p>
                    </td>
                    <td className="py-3 pr-4">{product.category}</td>
                    <td className="py-3 pr-4">{product.subcategory}</td>
                    <td className="py-3 pr-4">{formatPrice(product.price)}</td>
                    <td className="py-3 pr-4">{product.stock}</td>
                    <td className="py-3 pr-4">
                      <StatusBadge product={product} />
                    </td>
                    <td className="py-3 pr-4">
                      {dateFormatter.format(new Date(product.createdAt))}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-2">
                        <ActionButton label="Edit" onClick={() => openEditModal(product)}>
                          <Edit className="h-4 w-4" />
                        </ActionButton>
                        <ActionButton
                          label={product.visible ? "Hide" : "Show"}
                          onClick={() =>
                            patchProduct(
                              product,
                              { visible: !product.visible },
                              product.visible ? "Product hidden." : "Product visible.",
                            )
                          }
                        >
                          {product.visible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </ActionButton>
                        <ActionButton
                          label="Publish"
                          onClick={() =>
                            patchProduct(
                              product,
                              { status: "published", visible: true },
                              "Product published.",
                            )
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </ActionButton>
                        <ActionButton label="Duplicate" onClick={() => duplicateProduct(product)}>
                          Copy
                        </ActionButton>
                        <ActionButton
                          label="Archive"
                          onClick={() =>
                            patchProduct(
                              product,
                              { status: "archived", visible: false },
                              "Product archived.",
                            )
                          }
                        >
                          <Archive className="h-4 w-4" />
                        </ActionButton>
                        <ActionButton label="Delete" onClick={() => deleteProduct(product)}>
                          <Trash2 className="h-4 w-4" />
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
            Page {page + 1} · {total} total products
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

      <AddProductModal
        isOpen={modalOpen}
        product={editingProduct}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

function StatusBadge({ product }: { product: Product }) {
  const label = product.status === "published" && !product.visible ? "hidden" : product.status;
  const className =
    product.status === "published" && product.visible
      ? "bg-success/10 text-success"
      : product.status === "archived"
        ? "bg-muted text-muted-foreground"
        : "bg-amber/10 text-amber";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${className}`}>
      {label}
    </span>
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
