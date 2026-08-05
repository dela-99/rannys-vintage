import {
  Archive,
  Bell,
  CircleDollarSign,
  Mail,
  MessageSquare,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/StatCard";
import { formatPrice } from "@/lib/dropEngine";
import { operationsService } from "@/services/operationsService";
import type { DashboardSummary } from "@/data/operations";

const emptySummary: DashboardSummary = {
  totalProducts: 0,
  pendingOrders: 0,
  todaysOrders: 0,
  revenue: 0,
  lowStock: 0,
  outOfStock: 0,
  subscribers: 0,
  customers: 0,
  unreadMessages: 0,
  recentActivity: [],
};

export function DashboardComponent() {
  const [summary, setSummary] = useState<DashboardSummary>(emptySummary);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSummary = () => {
      operationsService
        .getSummary()
        .then((result) => {
          if (mounted) {
            setSummary(result);
          }
        })
        .finally(() => {
          if (mounted) {
            setLoading(false);
          }
        });
    };

    loadSummary();
    const interval = window.setInterval(loadSummary, 60000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const stats = [
    { icon: ShoppingBag, label: "Total Products", value: String(summary.totalProducts) },
    { icon: ShoppingBag, label: "Pending Orders", value: String(summary.pendingOrders) },
    { icon: Package, label: "Today's Orders", value: String(summary.todaysOrders) },
    { icon: CircleDollarSign, label: "Revenue", value: formatPrice(summary.revenue) },
    { icon: Package, label: "Low Stock", value: String(summary.lowStock) },
    { icon: Mail, label: "Subscribers", value: String(summary.subscribers) },
    { icon: Users, label: "Customers", value: String(summary.customers) },
    { icon: MessageSquare, label: "Unread Messages", value: String(summary.unreadMessages) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={loading ? "..." : stat.value}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
        <NotificationPanel summary={summary} />
        <ActivityPanel activity={summary.recentActivity} />
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <div className="flex items-center gap-3">
            <Archive className="h-5 w-5 text-primary" />
            <h3 className="font-display text-xl">Inventory Alerts</h3>
          </div>
          <div className="mt-5 space-y-3 text-sm">
            <AlertLine label="Low Stock" value={summary.lowStock} />
            <AlertLine label="Out of Stock" value={summary.outOfStock} />
            <AlertLine label="Recently Updated" value={summary.recentActivity.length} />
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationPanel({ summary }: { summary: DashboardSummary }) {
  const notifications = [
    { label: "New Orders", value: summary.pendingOrders },
    { label: "Low Stock", value: summary.lowStock },
    { label: "Out of Stock", value: summary.outOfStock },
    { label: "New Customers", value: summary.customers },
    { label: "Unread Messages", value: summary.unreadMessages },
  ];

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-card xl:col-span-1">
      <div className="flex items-center gap-3">
        <Bell className="h-5 w-5 text-primary" />
        <h3 className="font-display text-xl">Notification Center</h3>
      </div>
      <div className="mt-5 space-y-3">
        {notifications.map((item) => (
          <AlertLine key={item.label} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  );
}

function ActivityPanel({ activity }: { activity: string[] }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
      <h3 className="font-display text-xl">Recent Activity</h3>
      <div className="mt-5 space-y-3 text-sm">
        {activity.length === 0 ? (
          <p className="text-muted-foreground">No recent activity yet.</p>
        ) : (
          activity.map((item) => (
            <div key={item} className="rounded-xl bg-primary-soft/50 p-3">
              {item}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AlertLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-primary-soft/50 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}
