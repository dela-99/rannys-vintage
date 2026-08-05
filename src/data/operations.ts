export const orderStatuses = [
  "pending",
  "confirmed",
  "preparing",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;

export const paymentStatuses = ["pending", "paid", "failed", "refunded"] as const;
export const messageStatuses = ["new", "open", "pending", "resolved", "archived"] as const;
export const customerStatuses = ["active", "inactive", "vip", "blocked"] as const;

export type OrderStatus = (typeof orderStatuses)[number];
export type PaymentStatus = (typeof paymentStatuses)[number];
export type MessageStatus = (typeof messageStatuses)[number];
export type CustomerStatus = (typeof customerStatuses)[number];
export type InventoryStatus = "out-of-stock" | "low-stock" | "available";

export interface OrderItem {
  productId: string;
  name: string;
  image?: string;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

export interface StatusHistoryEntry {
  status: OrderStatus | MessageStatus | CustomerStatus;
  note?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  notes: string;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  profile?: string;
  name: string;
  phone: string;
  email: string;
  orders: number;
  totalSpent: number;
  addresses: string[];
  wishlist: string[];
  status: CustomerStatus;
  activityTimeline: StatusHistoryEntry[];
  dateJoined: string;
  updatedAt: string;
}

export interface MessageReply {
  body: string;
  author: string;
  createdAt: string;
}

export interface CustomerMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  body: string;
  status: MessageStatus;
  internalNotes: string;
  replies: MessageReply[];
  unread: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totalProducts: number;
  pendingOrders: number;
  todaysOrders: number;
  revenue: number;
  lowStock: number;
  outOfStock: number;
  subscribers: number;
  customers: number;
  unreadMessages: number;
  recentActivity: string[];
}

export function getInventoryStatus(stock: number): InventoryStatus {
  if (stock <= 0) {
    return "out-of-stock";
  }

  if (stock <= 5) {
    return "low-stock";
  }

  return "available";
}

export function formatOperationalStatus(status: string) {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function buildOrderNotification(order: Order, nextStatus: OrderStatus) {
  const templates: Record<OrderStatus, string> = {
    pending: `Hi ${order.customerName}, your order ${order.orderNumber} is pending review.`,
    confirmed: `Hi ${order.customerName}, your order ${order.orderNumber} has been confirmed.`,
    preparing: `Hi ${order.customerName}, your order ${order.orderNumber} is being prepared.`,
    packed: `Hi ${order.customerName}, your order ${order.orderNumber} has been packed.`,
    shipped: `Hi ${order.customerName}, your order ${order.orderNumber} has been shipped.`,
    delivered: `Hi ${order.customerName}, your order ${order.orderNumber} has been delivered.`,
    cancelled: `Hi ${order.customerName}, your order ${order.orderNumber} has been cancelled.`,
    refunded: `Hi ${order.customerName}, your order ${order.orderNumber} has been refunded.`,
  };

  return {
    email: {
      subject: `Order ${order.orderNumber}: ${formatOperationalStatus(nextStatus)}`,
      body: templates[nextStatus],
    },
    whatsapp: templates[nextStatus],
    sms: templates[nextStatus],
  };
}
