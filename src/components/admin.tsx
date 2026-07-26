import { AdminLayout } from "@/components/admin/AdminLayout";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: AdminComponent,
  beforeLoad: ({ location }) => {
    if (location.pathname === "/admin" || location.pathname === "/admin/") {
      throw redirect({ to: "/admin/dashboard" });
    }
  },
});

function AdminComponent() {
  return <AdminLayout>{<Outlet />}</AdminLayout>;
}