import { AdminWelcomeScreen } from "@/components/AdminWelcomeScreen";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/admin/welcome")({
  component: AdminWelcomeRoute,
});

function AdminWelcomeRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void navigate({ to: "/admin/dashboard", replace: true });
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [navigate]);

  return <AdminWelcomeScreen />;
}
