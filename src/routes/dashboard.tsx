import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  AlertCircle,
  MessageSquare,
  Box,
  Mail,
  TrendingUp,
} from "lucide-react";
import type React from "react";

const stats = [
  { label: "Orders", value: "124", icon: ShoppingBag, trend: "+12%" },
  { label: "Customers", value: "892", icon: Users, trend: "+5%" },
  { label: "Complaints", value: "2", icon: AlertCircle, trend: "Stable" },
  { label: "Requests", value: "15", icon: MessageSquare, trend: "+2" },
  { label: "Products", value: "450", icon: Box, trend: "Restocking" },
  { label: "Subscribers", value: "2.4k", icon: Mail, trend: "+18%" },
];

export function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-slate-50 pt-20">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-border bg-white p-6 hidden md:block">
        <nav className="space-y-2">
          <SidebarLink icon={LayoutDashboard} label="Dashboard" active />
          <SidebarLink icon={ShoppingBag} label="Orders" />
          <SidebarLink icon={AlertCircle} label="Complaints" />
          <SidebarLink icon={MessageSquare} label="Requests" />
          <SidebarLink icon={Box} label="Products" />
          <SidebarLink icon={Mail} label="Messages" />
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-accent text-xs text-primary uppercase tracking-widest">Overview</p>
            <h1 className="font-display text-4xl mt-2">Studio Control</h1>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-border shadow-sm flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-accent font-semibold uppercase">System Live</span>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white p-6 rounded-2xl border border-border shadow-card hover:shadow-hover transition-all group"
            >
              <div className="flex justify-between items-start">
                <div className="h-12 w-12 rounded-xl bg-primary-soft flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <s.icon className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-accent text-success bg-success/10 px-2 py-1 rounded-md font-bold">
                  {s.trend}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-muted-foreground text-xs font-accent uppercase tracking-tighter">
                  {s.label}
                </p>
                <p className="font-display text-3xl mt-1">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white rounded-2xl border border-border p-8 shadow-card">
          <h3 className="font-display text-xl mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New collection drop scheduled</p>
                    <p className="text-[10px] text-muted-foreground font-accent">2 hours ago</p>
                  </div>
                </div>
                <button className="text-[10px] font-accent font-bold text-primary hover:underline">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({
  icon: Icon,
  label,
  active = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${active ? "bg-primary text-white shadow-glow" : "text-muted-foreground hover:bg-primary-soft hover:text-primary"}`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-accent text-xs font-semibold">{label}</span>
    </a>
  );
}
