import { useAuth } from "@/auth";
import { AccessDenied } from "@/components/AccessDenied";
import { AdminLayout } from "@/components/AdminLayout";
import { LoginComponent } from "@/routes/login";
import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/admin")({
  component: AdminRouteComponent,
});

function AdminRouteComponent() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminLogin = location.pathname === "/admin" || location.pathname === "/admin/";
  const isWelcomeScreen = location.pathname === "/admin/welcome";

  useEffect(() => {
    if (!loading && !isAdminLogin && !isAuthenticated) {
      void navigate({ to: "/admin", replace: true });
    }
  }, [isAdminLogin, isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (!loading && isAdminLogin && isAuthenticated && isAdmin) {
      void navigate({ to: "/admin/welcome", replace: true });
    }
  }, [isAdmin, isAdminLogin, isAuthenticated, loading, navigate]);

  if (isAdminLogin) {
    if (loading || (isAuthenticated && isAdmin)) {
      return <AdminAuthLoading />;
    }

    if (isAuthenticated && !isAdmin) {
      return <AccessDenied />;
    }

    return <LoginComponent fromAdmin />;
  }

  if (loading || !isAuthenticated) {
    return <AdminAuthLoading />;
  }

  if (!isAdmin) {
    return <AccessDenied />;
  }

  if (isWelcomeScreen) {
    return <Outlet />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}

function AdminAuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}
