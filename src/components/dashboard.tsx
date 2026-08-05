import { createFileRoute } from "@tanstack/react-router";
import {
  ShoppingBag,
  CircleDollarSign,
  Users,
  MessageSquare,
  Mail,
  Package,
  Archive,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Placeholder } from "@/components/Placeholder";

export const Route = createFileRoute("/admin/dashboard")({
  component: DashboardComponent,
});

const stats = [
  { icon: ShoppingBag, label: "Total Products", value: "0" },
  { icon: ShoppingBag, label: "Total Orders", value: "0" },
  { icon: CircleDollarSign, label: "Total Revenue", value: "GH₵0.00" },
  { icon: Users, label: "Total Customers", value: "0" },
  { icon: MessageSquare, label: "Total Messages", value: "0" },
  { icon: Mail, label: "Total Subscribers", value: "0" },
  { icon: Package, label: "Low Stock", value: "0" },
  { icon: Archive, label: "Out of Stock", value: "0" },
];

function DashboardComponent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Placeholder title="Recent Orders" />
        </div>
        <Placeholder title="Recent Products" />
        <Placeholder title="Latest Messages" />
      </div>
    </div>
  );
}
