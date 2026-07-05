import { createRoute, createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
  AlertCircle,
  Box,
  Home,
  LayoutDashboard,
  Mail,
  MessageSquare,
  PlusCircle,
  ShoppingBag,
  Users,
} from "lucide-react";
import type { ComponentType } from "react";
import { HomepageManagerComponent } from "@/components/HomepageManager";
import { AddProductComponent } from "@/components/ui/add";
import { DashboardHome } from "@/components/DashboardHome";
import { Placeholder } from "@/components/Placeholder";
import { OrdersComponent } from "@/components/Orders";

const stats = [
  { label: "Orders", value: "124", icon: ShoppingBag, trend: "+12%" },
  { label: "Customers", value: "892", icon: Users, trend: "+5%" },
  { label: "Complaints", value: "2", icon: AlertCircle, trend: "Stable" },
  { label: "Requests", value: "15", icon: MessageSquare, trend: "+2" },
  { label: "Products", value: "450", icon: Box, trend: "Restocking" },
  { label: "Subscribers", value: "2.4k", icon: Mail, trend: "+18%" },
];

function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-slate-50 pt-20">
      <aside className="hidden w-64 border-r border-border bg-white p-6 md:block">
        <nav className="space-y-2">
          <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" exact />
          <SidebarLink to="/dashboard/homepage" icon={Home} label="Homepage" />
          <SidebarLink to="/dashboard/orders" icon={ShoppingBag} label="Orders" />
          <SidebarLink to="/dashboard/complaints" icon={AlertCircle} label="Complaints" />
          <SidebarLink to="/dashboard/requests" icon={MessageSquare} label="Requests" />
          <SidebarLink to="/dashboard/products" icon={Box} label="Products" exact />
          <SidebarLink to="/dashboard/products/add" icon={PlusCircle} label="Add Product" />
          <SidebarLink to="/dashboard/messages" icon={Mail} label="Messages" />
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-x-hidden">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="font-accent text-xs uppercase tracking-widest text-primary">Overview</p>
            <h1 className="mt-2 font-display text-4xl">Studio Control</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 shadow-sm">
              <div className="h-2 w-2 animate-pulse rounded-full bg-success" />
              <span className="text-[10px] font-accent font-semibold uppercase">System Live</span>
            </div>
            <Link
              to="/dashboard/products/add"
              aria-label="Add Product"
              className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-primary-soft"
            >
              Add Product
            </Link>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group rounded-2xl border border-border bg-white p-6 shadow-card transition-all hover:shadow-hover"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <s.icon className="h-6 w-6" />
                </div>
                <span className="rounded-md bg-success/10 px-2 py-1 text-[10px] font-accent font-bold text-success">
                  {s.trend}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-accent uppercase tracking-tighter text-muted-foreground">
                  {s.label}
                </p>
                <p className="mt-1 font-display text-3xl">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-8">
          {/* This Outlet will render the active child route component */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function SidebarLink({
  icon: Icon,
  label,
  to,
  exact = false,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  to: string;
  exact?: boolean;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors text-muted-foreground hover:bg-primary-soft hover:text-primary"
      activeProps={{
        className: "bg-primary text-white shadow-glow",
      }}
      activeOptions={{ exact }}
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs font-accent font-semibold">{label}</span>
    </Link>
  );
}

const dashboardRoute = createFileRoute("/dashboard")({
  component: AdminDashboard,
});

const DashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/",
  component: DashboardHome,
});

const OrdersRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "orders",
  component: OrdersComponent,
});

const HomepageRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "homepage",
  component: HomepageManagerComponent,
});

const AddProductRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "products/add",
  component: AddProductComponent,
});

const ProductsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "products",
  component: () => <Placeholder title="Product Management" />,
});

const ComplaintsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "complaints",
  component: () => <Placeholder title="Complaints Management" />,
});

const RequestsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "requests",
  component: () => <Placeholder title="Requests Management" />,
});

const MessagesRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "messages",
  component: () => <Placeholder title="Customer Communication Center" />,
});

export const Route = dashboardRoute.addChildren([
  DashboardIndexRoute,
  OrdersRoute,
  HomepageRoute,
  AddProductRoute,
  ProductsRoute,
  ComplaintsRoute,
  RequestsRoute,
  MessagesRoute,
]);
