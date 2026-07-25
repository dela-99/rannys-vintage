import { createFileRoute } from "@tanstack/react-router";
import { LoginRoute } from "./login";

export const Route = createFileRoute("/admin")({
  component: AdminLogin,
});

function AdminLogin() {
  const Login = LoginRoute.component;
  return <Login fromAdmin />;
}