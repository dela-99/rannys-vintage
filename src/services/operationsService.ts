import { CATEGORIES, ensureProductGallery, type Product } from "@/data/products";
import {
  type Customer,
  type CustomerMessage,
  type DashboardSummary,
  type MessageReply,
  type Order,
  type OrderItem,
  type OrderStatus,
  type PaymentStatus,
  type StatusHistoryEntry,
} from "@/data/operations";
import { authService } from "@/services/authService";

interface ListResult<T> {
  items: T[];
  total: number;
}

function parseJsonArray<T>(value: string | T[] | undefined, fallback: T[] = []) {
  if (Array.isArray(value)) {
    return value;
  }

  if (!value) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function buildQuery(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== "all") {
      searchParams.set(key, String(value));
    }
  });

  return searchParams.toString();
}

async function request<T>(path: string, options: RequestInit = {}) {
  const token = await authService.createJwt();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(path, { ...options, headers });
  const payload = (await response.json().catch(() => ({}))) as { message?: string };

  if (!response.ok) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload as T;
}

type OrderDocument = Partial<Order> & {
  $id: string;
  items?: string | OrderItem[];
  statusHistory?: string | StatusHistoryEntry[];
};

type CustomerDocument = Partial<Customer> & {
  $id: string;
  $createdAt?: string;
  $updatedAt?: string;
  addresses?: string | string[];
  wishlist?: string | string[];
  activityTimeline?: string | StatusHistoryEntry[];
};

type MessageDocument = Partial<CustomerMessage> & {
  $id: string;
  $createdAt?: string;
  $updatedAt?: string;
  replies?: string | MessageReply[];
};

type ProductDocument = Omit<Partial<Product>, "category"> & {
  $id: string;
  $createdAt?: string;
  $updatedAt?: string;
  category?: Product["category"] | "Jewelry";
  images?: string[] | string;
  sizes?: string[] | string;
  colors?: string[] | string;
};

function toProduct(document: ProductDocument): Product {
  const images = ensureProductGallery(parseJsonArray<string>(document.images));
  const category = document.category === "Jewelry" ? "Jewellery" : document.category;
  const slug = document.slug || document.productId || document.$id;

  return {
    id: slug,
    documentId: document.$id,
    productId: document.productId || document.$id,
    slug,
    name: document.name ?? "Untitled Product",
    category: category && CATEGORIES.includes(category) ? category : "Dresses",
    subcategory: document.subcategory ?? "",
    price: Number(document.price ?? 0),
    oldPrice: document.oldPrice === undefined ? undefined : Number(document.oldPrice),
    description: document.description ?? "",
    stock: Number(document.stock ?? 0),
    images,
    image: images[0] ?? "",
    hoverImage: images[1],
    gallery: images,
    sizes: parseJsonArray<string>(document.sizes),
    colors: parseJsonArray<string>(document.colors),
    featured: Boolean(document.featured),
    trending: Boolean(document.trending),
    visible: document.visible !== false,
    status: document.status ?? "draft",
    createdAt: document.createdAt ?? document.$createdAt ?? new Date().toISOString(),
    updatedAt: document.updatedAt ?? document.$updatedAt ?? new Date().toISOString(),
  };
}

function toOrder(document: OrderDocument): Order {
  return {
    id: document.$id,
    orderNumber: document.orderNumber ?? document.$id,
    customerName: document.customerName ?? "Unknown customer",
    phone: document.phone ?? "",
    email: document.email ?? "",
    deliveryAddress: document.deliveryAddress ?? "",
    items: parseJsonArray<OrderItem>(document.items),
    subtotal: Number(document.subtotal ?? 0),
    shipping: Number(document.shipping ?? 0),
    discount: Number(document.discount ?? 0),
    total: Number(document.total ?? 0),
    paymentMethod: document.paymentMethod ?? "",
    paymentStatus: (document.paymentStatus ?? "pending") as PaymentStatus,
    orderStatus: (document.orderStatus ?? "pending") as OrderStatus,
    notes: document.notes ?? "",
    statusHistory: parseJsonArray<StatusHistoryEntry>(document.statusHistory),
    createdAt: document.createdAt ?? new Date().toISOString(),
    updatedAt: document.updatedAt ?? document.createdAt ?? new Date().toISOString(),
  };
}

function toCustomer(document: CustomerDocument): Customer {
  return {
    id: document.$id,
    profile: document.profile,
    name: document.name ?? "Unknown customer",
    phone: document.phone ?? "",
    email: document.email ?? "",
    orders: Number(document.orders ?? 0),
    totalSpent: Number(document.totalSpent ?? 0),
    addresses: parseJsonArray<string>(document.addresses),
    wishlist: parseJsonArray<string>(document.wishlist),
    status: document.status ?? "active",
    activityTimeline: parseJsonArray<StatusHistoryEntry>(document.activityTimeline),
    dateJoined: document.dateJoined ?? document.$createdAt ?? new Date().toISOString(),
    updatedAt: document.updatedAt ?? document.$updatedAt ?? new Date().toISOString(),
  };
}

function toMessage(document: MessageDocument): CustomerMessage {
  return {
    id: document.$id,
    name: document.name ?? "Unknown sender",
    email: document.email ?? "",
    phone: document.phone,
    subject: document.subject ?? "Website enquiry",
    body: document.body ?? "",
    status: document.status ?? "new",
    internalNotes: document.internalNotes ?? "",
    replies: parseJsonArray<MessageReply>(document.replies),
    unread: document.unread !== false,
    createdAt: document.createdAt ?? document.$createdAt ?? new Date().toISOString(),
    updatedAt: document.updatedAt ?? document.$updatedAt ?? new Date().toISOString(),
  };
}

export const operationsService = {
  async getSummary() {
    const response = await request<{ summary: DashboardSummary }>("/api/admin/operations/summary");
    return response.summary;
  },

  async globalSearch(query: string) {
    return request<{
      results: {
        products: Product[];
        orders: OrderDocument[];
        customers: CustomerDocument[];
        messages: MessageDocument[];
      };
    }>(`/api/admin/operations/search?${buildQuery({ q: query })}`);
  },

  async listOrders(params: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ListResult<Order>> {
    const response = await request<{ orders: OrderDocument[]; total: number }>(
      `/api/admin/operations/orders?${buildQuery(params)}`,
    );
    return { items: response.orders.map(toOrder), total: response.total };
  },

  async updateOrderStatus(orderId: string, status: OrderStatus, note?: string) {
    const response = await request<{ order: OrderDocument }>(
      `/api/admin/operations/orders/${orderId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status, note }),
      },
    );
    return toOrder(response.order);
  },

  async updateOrderNotes(orderId: string, notes: string) {
    const response = await request<{ order: OrderDocument }>(
      `/api/admin/operations/orders/${orderId}/notes`,
      {
        method: "PATCH",
        body: JSON.stringify({ notes }),
      },
    );
    return toOrder(response.order);
  },

  async listInventory(params: { search?: string; limit?: number; offset?: number }) {
    const response = await request<{ products: ProductDocument[]; total: number }>(
      `/api/admin/operations/inventory?${buildQuery(params)}`,
    );
    return { items: response.products.map(toProduct), total: response.total };
  },

  async updateInventory(productId: string, updates: Partial<Product>) {
    const response = await request<{ product: ProductDocument }>(
      `/api/admin/operations/inventory/${productId}`,
      {
        method: "PATCH",
        body: JSON.stringify(updates),
      },
    );
    return toProduct(response.product);
  },

  async listCustomers(params: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ListResult<Customer>> {
    const response = await request<{ customers: CustomerDocument[]; total: number }>(
      `/api/admin/operations/customers?${buildQuery(params)}`,
    );
    return { items: response.customers.map(toCustomer), total: response.total };
  },

  async getCustomer(customerId: string) {
    const response = await request<{ customer: CustomerDocument; orders: OrderDocument[] }>(
      `/api/admin/operations/customers/${customerId}`,
    );
    return {
      customer: toCustomer(response.customer),
      orders: response.orders.map(toOrder),
    };
  },

  async listMessages(params: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ListResult<CustomerMessage>> {
    const response = await request<{ messages: MessageDocument[]; total: number }>(
      `/api/admin/operations/messages?${buildQuery(params)}`,
    );
    return { items: response.messages.map(toMessage), total: response.total };
  },

  async updateMessage(messageId: string, updates: Partial<CustomerMessage>) {
    const response = await request<{ message: MessageDocument }>(
      `/api/admin/operations/messages/${messageId}`,
      {
        method: "PATCH",
        body: JSON.stringify(updates),
      },
    );
    return toMessage(response.message);
  },

  async replyToMessage(messageId: string, body: string) {
    const response = await request<{ message: MessageDocument }>(
      `/api/admin/operations/messages/${messageId}/replies`,
      {
        method: "POST",
        body: JSON.stringify({ body }),
      },
    );
    return toMessage(response.message);
  },
};
