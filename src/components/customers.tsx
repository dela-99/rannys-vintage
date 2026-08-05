import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  customerStatuses,
  formatOperationalStatus,
  type Customer,
  type CustomerStatus,
  type Order,
} from "@/data/operations";
import { exportCsv } from "@/lib/csv";
import { formatPrice } from "@/lib/dropEngine";
import { operationsService } from "@/services/operationsService";
import { Download, Loader2, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const PAGE_SIZE = 25;
const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function CustomersComponent() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CustomerStatus | "all">("all");
  const [sort, setSort] = useState<"joined-desc" | "spent-desc" | "orders-desc" | "name-asc">(
    "joined-desc",
  );
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const canLoadMore = (page + 1) * PAGE_SIZE < total;

  const visibleCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? customers.filter((customer) =>
          `${customer.name} ${customer.phone} ${customer.email} ${customer.status}`
            .toLowerCase()
            .includes(query),
        )
      : customers;

    return [...filtered].sort((first, second) => {
      switch (sort) {
        case "spent-desc":
          return second.totalSpent - first.totalSpent;
        case "orders-desc":
          return second.orders - first.orders;
        case "name-asc":
          return first.name.localeCompare(second.name);
        default:
          return +new Date(second.dateJoined) - +new Date(first.dateJoined);
      }
    });
  }, [customers, search, sort]);

  const loadCustomers = useCallback(async () => {
    setLoading(true);

    try {
      const result = await operationsService.listCustomers({
        status,
        search,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      });
      setCustomers(result.items);
      setTotal(result.total);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Customers could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadCustomers(), 250);
    return () => window.clearTimeout(timeout);
  }, [loadCustomers]);

  const openProfile = async (customer: Customer) => {
    setProfileLoading(true);
    setSelectedCustomer(customer);
    setSelectedOrders([]);

    try {
      const result = await operationsService.getCustomer(customer.id);
      setSelectedCustomer(result.customer);
      setSelectedOrders(result.orders);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Customer profile could not be loaded.");
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Customers">
        <Button
          variant="outline"
          className="bg-white"
          onClick={() =>
            exportCsv(
              "customers.csv",
              visibleCustomers.map((customer) => ({
                name: customer.name,
                phone: customer.phone,
                email: customer.email,
                orders: customer.orders,
                totalSpent: customer.totalSpent,
                dateJoined: customer.dateJoined,
                status: customer.status,
              })),
            )
          }
        >
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </PageHeader>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_170px_170px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(0);
              }}
              placeholder="Search customers by name, phone, email..."
              className="w-full rounded-lg border border-border bg-transparent py-2 pl-10 pr-4"
            />
          </div>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as CustomerStatus | "all");
              setPage(0);
            }}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
          >
            <option value="all">All statuses</option>
            {customerStatuses.map((item) => (
              <option key={item} value={item}>
                {formatOperationalStatus(item)}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as typeof sort)}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
          >
            <option value="joined-desc">Newest joined</option>
            <option value="spent-desc">Highest spend</option>
            <option value="orders-desc">Most orders</option>
            <option value="name-asc">Name A-Z</option>
          </select>
        </div>

        {loading ? (
          <LoadingState />
        ) : visibleCustomers.length === 0 ? (
          <EmptyState message="No customers found." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs text-muted-foreground">
                <tr>
                  <th className="py-3 pr-4 font-medium">Profile</th>
                  <th className="py-3 pr-4 font-medium">Name</th>
                  <th className="py-3 pr-4 font-medium">Phone</th>
                  <th className="py-3 pr-4 font-medium">Email</th>
                  <th className="py-3 pr-4 font-medium">Orders</th>
                  <th className="py-3 pr-4 font-medium">Total Spent</th>
                  <th className="py-3 pr-4 font-medium">Date Joined</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 pr-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-border/70">
                    <td className="py-3 pr-4">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-medium">{customer.name}</td>
                    <td className="py-3 pr-4">{customer.phone}</td>
                    <td className="py-3 pr-4">{customer.email}</td>
                    <td className="py-3 pr-4">{customer.orders}</td>
                    <td className="py-3 pr-4">{formatPrice(customer.totalSpent)}</td>
                    <td className="py-3 pr-4">
                      {dateFormatter.format(new Date(customer.dateJoined))}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium capitalize text-primary">
                        {formatOperationalStatus(customer.status)}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <Button variant="outline" size="sm" onClick={() => openProfile(customer)}>
                        Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {page + 1} · {total} customers
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

      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-foreground/40">
          <div className="h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-hover">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-accent text-[10px] text-primary">Customer Profile</p>
                <h2 className="font-display mt-1 text-3xl">{selectedCustomer.name}</h2>
              </div>
              <Button variant="outline" onClick={() => setSelectedCustomer(null)}>
                Close
              </Button>
            </div>

            {profileLoading ? (
              <LoadingState />
            ) : (
              <div className="mt-6 space-y-4">
                <ProfileCard title="Personal Details">
                  <p>{selectedCustomer.phone}</p>
                  <p>{selectedCustomer.email}</p>
                  <p>{formatOperationalStatus(selectedCustomer.status)}</p>
                </ProfileCard>
                <ProfileCard title="Order History">
                  {selectedOrders.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No orders found.</p>
                  ) : (
                    selectedOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between border-b border-border/70 py-2"
                      >
                        <span>{order.orderNumber}</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    ))
                  )}
                </ProfileCard>
                <ProfileCard title="Addresses">
                  {selectedCustomer.addresses.length === 0
                    ? "No saved addresses."
                    : selectedCustomer.addresses.join(", ")}
                </ProfileCard>
                <ProfileCard title="Wishlist">
                  {selectedCustomer.wishlist.length === 0
                    ? "Wishlist is future-ready."
                    : selectedCustomer.wishlist.join(", ")}
                </ProfileCard>
                <ProfileCard title="Activity Timeline">
                  {selectedCustomer.activityTimeline.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No activity yet.</p>
                  ) : (
                    selectedCustomer.activityTimeline.map((activity) => (
                      <div
                        key={`${activity.status}-${activity.createdAt}`}
                        className="border-l pl-3"
                      >
                        <p>{formatOperationalStatus(activity.status)}</p>
                        <p className="text-xs text-muted-foreground">
                          {dateFormatter.format(new Date(activity.createdAt))}
                        </p>
                      </div>
                    ))
                  )}
                </ProfileCard>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-72 items-center justify-center text-muted-foreground">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading customers...
    </div>
  );
}

function ProfileCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border p-4">
      <h3 className="font-accent mb-3 text-[10px] text-muted-foreground">{title}</h3>
      <div className="text-sm">{children}</div>
    </section>
  );
}
