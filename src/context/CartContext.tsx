import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";

export interface CartItem {
  id: string;
  product: Product;
  size?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  drawerOpen: boolean;
  count: number;
  subtotal: number;
  add: (product: Product, opts?: { size?: string; quantity?: number }) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartCtx = createContext<CartState | null>(null);
const STORAGE_KEY = "rannys-cart-v1";

const lineId = (productId: string, size?: string) => `${productId}__${size ?? "_"}`;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, hydrated]);

  const add: CartState["add"] = useCallback((product, opts) => {
    const size = opts?.size;
    const quantity = opts?.quantity ?? 1;
    const id = lineId(product.id, size);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { id, product, size, quantity }];
    });
    setDrawerOpen(true);
  }, []);

  const remove: CartState["remove"] = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQuantity: CartState["setQuantity"] = useCallback((id, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const value = useMemo<CartState>(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = items.reduce((s, i) => s + i.quantity * i.product.price, 0);
    return {
      items,
      drawerOpen,
      count,
      subtotal,
      add,
      remove,
      setQuantity,
      clear,
      openDrawer,
      closeDrawer,
    };
  }, [items, drawerOpen, add, remove, setQuantity, clear, openDrawer, closeDrawer]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
