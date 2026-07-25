import { RouterProvider } from "@tanstack/react-router";
import { AuthProvider, useAuth } from "./auth";
import { router } from "./router";
import { CartProvider } from "./context/CartContext";

function InnerApp() {
  const auth = useAuth();
  // context prop injects live auth state WITHOUT recreating the router
  return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <InnerApp />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
