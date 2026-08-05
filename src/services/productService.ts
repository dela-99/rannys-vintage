import {
  CATEGORIES,
  ensureProductGallery,
  slugifyProductName,
  type Category,
  type Product,
  type ProductInput,
  type ProductListFilters,
  type ProductStatus,
} from "@/data/products";
import { authService } from "@/services/authService";
import type { Models } from "appwrite";

type ProductDocument = Models.Document & {
  productId?: string;
  slug?: string;
  name?: string;
  category?: Category | "Jewelry";
  subcategory?: string;
  description?: string;
  price?: number;
  oldPrice?: number;
  stock?: number;
  images?: string[] | string;
  sizes?: string[] | string;
  colors?: string[] | string;
  featured?: boolean;
  trending?: boolean;
  visible?: boolean;
  status?: ProductStatus;
  createdAt?: string;
  updatedAt?: string;
};

export interface ProductListResult {
  products: Product[];
  total: number;
}

function normalizeStringArray(value: string[] | string | undefined) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item).trim()).filter(Boolean);
    }
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function toProduct(document: ProductDocument): Product {
  const images = ensureProductGallery(normalizeStringArray(document.images));
  const createdAt = document.createdAt ?? document.$createdAt;
  const updatedAt = document.updatedAt ?? document.$updatedAt;
  const slug = document.slug || document.productId || document.$id;
  const category = document.category === "Jewelry" ? "Jewellery" : document.category;

  return {
    id: slug,
    documentId: document.$id,
    productId: document.productId || document.$id,
    slug,
    name: document.name ?? "Untitled Product",
    category: category && CATEGORIES.includes(category) ? category : "Dresses",
    subcategory: document.subcategory ?? "",
    description: document.description ?? "",
    price: Number(document.price ?? 0),
    oldPrice: document.oldPrice === undefined ? undefined : Number(document.oldPrice),
    stock: Number(document.stock ?? 0),
    images,
    image: images[0] ?? "",
    hoverImage: images[1],
    gallery: images,
    sizes: normalizeStringArray(document.sizes),
    colors: normalizeStringArray(document.colors),
    featured: Boolean(document.featured),
    trending: Boolean(document.trending),
    visible: document.visible !== false,
    status: document.status ?? "draft",
    createdAt,
    updatedAt,
  };
}

function buildDocumentData(input: ProductInput) {
  const slug = input.slug || slugifyProductName(input.name);
  const now = new Date().toISOString();

  return {
    productId: slug,
    slug,
    name: input.name.trim(),
    category: input.category,
    subcategory: input.subcategory.trim(),
    description: input.description.trim(),
    price: Number(input.price),
    oldPrice: input.oldPrice ? Number(input.oldPrice) : undefined,
    stock: Number(input.stock),
    images: ensureProductGallery(input.images),
    sizes: input.sizes.map((size) => size.trim()).filter(Boolean),
    colors: input.colors.map((color) => color.trim()).filter(Boolean),
    featured: input.featured,
    trending: input.trending,
    visible: input.visible,
    status: input.status,
    updatedAt: now,
  };
}

function withoutUndefined<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined));
}

async function apiRequest<T>(path: string, options: RequestInit = {}, admin = false) {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (admin) {
    headers.set("Authorization", `Bearer ${await authService.createJwt()}`);
  }

  const response = await fetch(path, { ...options, headers });
  const payload = (await response.json().catch(() => ({}))) as { message?: string };

  if (!response.ok) {
    throw new Error(payload.message || "Product request failed.");
  }

  return payload as T;
}

function buildQueryString(filters: ProductListFilters) {
  const params = new URLSearchParams();

  if (filters.category && filters.category !== "all") {
    params.set("category", filters.category);
  }

  if (filters.status && filters.status !== "all") {
    params.set("status", filters.status);
  }

  params.set("limit", String(filters.limit ?? 100));
  params.set("offset", String(filters.offset ?? 0));
  return params.toString();
}

export const productService = {
  async listPublished(filters: ProductListFilters = {}): Promise<ProductListResult> {
    const query = buildQueryString(filters);
    const response = await apiRequest<{
      products: ProductDocument[];
      total: number;
    }>(`/api/appwrite/products?${query}`);

    const products = response.products.map(toProduct);
    const search = filters.search?.trim().toLowerCase();

    return {
      products: search
        ? products.filter((product) =>
            `${product.name} ${product.category} ${product.subcategory}`
              .toLowerCase()
              .includes(search),
          )
        : products,
      total: response.total,
    };
  },

  async listAdmin(filters: ProductListFilters = {}): Promise<ProductListResult> {
    const query = buildQueryString({ ...filters, limit: filters.limit ?? 25 });
    const response = await apiRequest<{
      products: ProductDocument[];
      total: number;
    }>(`/api/admin/products?${query}`, {}, true);

    const products = response.products.map(toProduct);
    const search = filters.search?.trim().toLowerCase();

    return {
      products: search
        ? products.filter((product) =>
            `${product.name} ${product.category} ${product.subcategory}`
              .toLowerCase()
              .includes(search),
          )
        : products,
      total: response.total,
    };
  },

  async getPublishedProduct(productId: string) {
    const response = await fetch(`/api/appwrite/products/${encodeURIComponent(productId)}`);

    if (response.status === 404) {
      return null;
    }

    const payload = (await response.json().catch(() => ({}))) as {
      product?: ProductDocument;
      message?: string;
    };

    if (!response.ok) {
      throw new Error(payload.message || "Product request failed.");
    }

    return payload.product ? toProduct(payload.product) : null;
  },

  async getRelatedProducts(product: Product, limit = 4) {
    const response = await this.listPublished({ category: product.category, limit: limit + 1 });
    return response.products.filter((item) => item.id !== product.id).slice(0, limit);
  },

  async create(input: ProductInput) {
    const data = withoutUndefined({
      ...buildDocumentData(input),
      createdAt: new Date().toISOString(),
    });

    const response = await apiRequest<{ product: ProductDocument }>(
      "/api/admin/products",
      {
        method: "POST",
        body: JSON.stringify({
          documentId: data.slug,
          data,
        }),
      },
      true,
    );

    return toProduct(response.product);
  },

  async update(documentId: string, input: ProductInput) {
    const data = withoutUndefined(buildDocumentData(input));

    const response = await apiRequest<{ product: ProductDocument }>(
      `/api/admin/products/${encodeURIComponent(documentId)}`,
      {
        method: "PATCH",
        body: JSON.stringify({ data }),
      },
      true,
    );

    return toProduct(response.product);
  },

  async patch(documentId: string, updates: Partial<ProductInput>) {
    const data = withoutUndefined({
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    const response = await apiRequest<{ product: ProductDocument }>(
      `/api/admin/products/${encodeURIComponent(documentId)}`,
      {
        method: "PATCH",
        body: JSON.stringify({ data }),
      },
      true,
    );

    return toProduct(response.product);
  },

  async duplicate(product: Product) {
    const copyName = `${product.name} Copy`;

    return this.create({
      name: copyName,
      category: product.category,
      subcategory: product.subcategory,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice,
      stock: product.stock,
      images: product.images,
      sizes: product.sizes,
      colors: product.colors,
      featured: product.featured,
      trending: product.trending,
      visible: false,
      status: "draft",
      slug: `${slugifyProductName(copyName)}-${Date.now()}`,
    });
  },

  async delete(documentId: string) {
    await apiRequest(
      `/api/admin/products/${encodeURIComponent(documentId)}`,
      {
        method: "DELETE",
      },
      true,
    );
  },
};
