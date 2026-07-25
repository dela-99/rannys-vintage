import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin")({
  beforeLoad: ({ context }) => {
    if (context.auth.status === "loading") return;
    if (context.auth.user?.role !== "admin") {
      throw redirect({
        to: "/access-denied",
      });
    }
  },
  component: () => <Outlet />,
});
