import { AuthState } from "@/auth";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

interface MyRouterContext {
  auth: AuthState;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </>
  ),
});
