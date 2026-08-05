import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import {
  buildOrderNotification,
  formatOperationalStatus,
  orderStatuses,
  type Order,
  type OrderStatus,
} from "@/data/operations";
import { exportCsv } from "@/lib/csv";
import { formatPrice } from "@/lib/dropEngine";
import { operationsService } from "@/services/operationsService";
import { Download, Loader2, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const PAGE_SIZE = 20;
const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function OrdersComponent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notificationStatus, setNotificationStatus] = useState<OrderStatus>("confirmed");
  const [notes, setNotes] = useState("");

  const canLoadMore = (page + 1) * PAGE_SIZE < total;
  const notification = selectedOrder
    ? buildOrderNotification(selectedOrder, notificationStatus)
    : null;

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return orders;
    }

    return orders.filter((order) =>
      `${order.orderNumber} ${order.customerName} ${order.phone} ${order.email} ${order.orderStatus}`
        .toLowerCase()
        .includes(query),
    );
  }, [orders, search]);

  const loadOrders = useCallback(async () => {
    setLoading(true);

    try {
      const result = await operationsService.listOrders({
        status,
        search,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      });
      setOrders(result.items);
      setTotal(result.total);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Orders could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadOrders(), 250);
    return () => window.clearTimeout(timeout);
  }, [loadOrders]);

  const updateStatus = async (order: Order, nextStatus: OrderStatus) => {
    const previousOrders = orders;
    setOrders((current) =>
      current.map((item) =>
        item.id === order.id
          ? {
              ...item,
              orderStatus: nextStatus,
            }
          : item,
      ),
    );

    try {
      const updated = await operationsService.updateOrderStatus(order.id, nextStatus);
      setOrders((current) => current.map((item) => (item.id === order.id ? updated : item)));
      setSelectedOrder((current) => (current?.id === order.id ? updated : current));
      setNotificationStatus(nextStatus);
      toast.success("Order status updated. Notification template prepared.");
    } catch (error) {
      setOrders(previousOrders);
      toast.error(error instanceof Error ? error.message : "Order status could not be updated.");
    }
  };

  const saveNotes = async () => {
    if (!selectedOrder) {
      return;
    }

    try {
      const updated = await operationsService.updateOrderNotes(selectedOrder.id, notes);
      setSelectedOrder(updated);
      setOrders((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      toast.success("Order notes saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Notes could not be saved.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Orders">
        <Button
          variant="outline"
          className="bg-white"
          onClick={() =>
            exportCsv(
              "orders.csv",
              filteredOrders.map((order) => ({
                orderNumber: order.orderNumber,
                customer: order.customerName,
                phone: order.phone,
                email: order.email,
                status: order.orderStatus,
                payment: order.paymentStatus,
                total: order.total,
                createdAt: order.createdAt,
              })),
            )
          }
        >
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </PageHeader>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(0);
              }}
              placeholder="Search orders, customers, phone, email..."
              className="w-full rounded-lg border border-border bg-transparent py-2 pl-10 pr-4"
            />
          </div>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as OrderStatus | "all");
              setPage(0);
            }}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
          >
            <option value="all">All statuses</option>
            {orderStatuses.map((item) => (
              <option key={item} value={item}>
                {formatOperationalStatus(item)}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <LoadingState label="Loading orders..." />
        ) : filteredOrders.length === 0 ? (
          <EmptyState message="No orders to display." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs text-muted-foreground">
                <tr>
                  <th className="py-3 pr-4 font-medium">Order Number</th>
                  <th className="py-3 pr-4 font-medium">Customer</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 pr-4 font-medium">Payment</th>
                  <th className="py-3 pr-4 font-medium">Total</th>
                  <th className="py-3 pr-4 font-medium">Date</th>
                  <th className="py-3 pr-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/70">
                    <td className="py-3 pr-4 font-medium">{order.orderNumber}</td>
                    <td className="py-3 pr-4">
                      <p>{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.phone}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <select
                        value={order.orderStatus}
                        onChange={(event) => updateStatus(order, event.target.value as OrderStatus)}
                        className="rounded-full border border-border bg-white px-3 py-1 text-xs"
                      >
                        {orderStatuses.map((item) => (
                          <option key={item} value={item}>
                            {formatOperationalStatus(item)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 pr-4 capitalize">{order.paymentStatus}</td>
                    <td className="py-3 pr-4">{formatPrice(order.total)}</td>
                    <td className="py-3 pr-4">{dateFormatter.format(new Date(order.createdAt))}</td>
                    <td className="py-3 pr-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setNotificationStatus(order.orderStatus);
                          setNotes(order.notes);
                        }}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          page={page}
          total={total}
          canLoadMore={canLoadMore}
          loading={loading}
          onPrevious={() => setPage((current) => Math.max(0, current - 1))}
          onNext={() => setPage((current) => current + 1)}
        />
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-foreground/40">
          <div className="h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-hover">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-accent text-[10px] text-primary">Order Details</p>
                <h2 className="font-display mt-1 text-3xl">{selectedOrder.orderNumber}</h2>
              </div>
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <DetailCard title="Customer Information">
                <p>{selectedOrder.customerName}</p>
                <p>{selectedOrder.phone}</p>
                <p>{selectedOrder.email}</p>
              </DetailCard>
              <DetailCard title="Payment Details">
                <p>{selectedOrder.paymentMethod}</p>
                <p className="capitalize">{selectedOrder.paymentStatus}</p>
                <p className="font-semibold">{formatPrice(selectedOrder.total)}</p>
              </DetailCard>
            </div>

            <DetailCard title="Delivery Address" className="mt-4">
              <p>{selectedOrder.deliveryAddress}</p>
            </DetailCard>

            <DetailCard title="Ordered Products" className="mt-4">
              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt="" className="h-14 w-11 rounded-lg object-cover" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty {item.quantity}
                        {item.size ? ` · Size ${item.size}` : ""}
                        {item.color ? ` · ${item.color}` : ""}
                      </p>
                    </div>
                    <p>{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </DetailCard>

            <DetailCard title="Timeline & Status History" className="mt-4">
              <div className="space-y-3">
                {selectedOrder.statusHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No status history yet.</p>
                ) : (
                  selectedOrder.statusHistory.map((entry) => (
                    <div key={`${entry.status}-${entry.createdAt}`} className="border-l pl-3">
                      <p className="font-medium">{formatOperationalStatus(entry.status)}</p>
                      <p className="text-xs text-muted-foreground">
                        {dateFormatter.format(new Date(entry.createdAt))}
                      </p>
                      {entry.note && <p className="text-sm">{entry.note}</p>}
                    </div>
                  ))
                )}
              </div>
            </DetailCard>

            <DetailCard title="Notes" className="mt-4">
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="min-h-24 w-full rounded-lg border border-border p-3 text-sm"
                placeholder="Internal order notes..."
              />
              <Button className="mt-3" size="sm" onClick={saveNotes}>
                Save Notes
              </Button>
            </DetailCard>

            <DetailCard title="Notification Workflow" className="mt-4">
              <select
                value={notificationStatus}
                onChange={(event) => setNotificationStatus(event.target.value as OrderStatus)}
                className="mb-3 rounded-lg border border-border bg-white px-3 py-2 text-sm"
              >
                {orderStatuses.map((item) => (
                  <option key={item} value={item}>
                    {formatOperationalStatus(item)}
                  </option>
                ))}
              </select>
              {notification && (
                <div className="space-y-3 text-sm">
                  <Template
                    label="Email"
                    value={`${notification.email.subject}\n\n${notification.email.body}`}
                  />
                  <Template label="WhatsApp" value={notification.whatsapp} />
                  <Template label="SMS" value={notification.sms} />
                </div>
              )}
            </DetailCard>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-border p-4 ${className}`}>
      <h3 className="font-accent mb-3 text-[10px] text-muted-foreground">{title}</h3>
      <div className="text-sm">{children}</div>
    </section>
  );
}

function Template({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 font-medium">{label}</p>
      <textarea
        readOnly
        value={value}
        className="min-h-20 w-full rounded-lg border border-border p-3"
      />
    </div>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex min-h-72 items-center justify-center text-muted-foreground">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {label}
    </div>
  );
}

function Pagination({
  page,
  total,
  canLoadMore,
  loading,
  onPrevious,
  onNext,
}: {
  page: number;
  total: number;
  canLoadMore: boolean;
  loading: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
      <span>
        Page {page + 1} · {total} total orders
      </span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={page === 0 || loading} onClick={onPrevious}>
          Previous
        </Button>
        <Button variant="outline" size="sm" disabled={!canLoadMore || loading} onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
