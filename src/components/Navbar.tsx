import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, Heart, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "Shop", to: "/shop" as const },
  { label: "Dresses", to: "/shop" as const },
  { label: "Shoes", to: "/shop" as const },
  { label: "Jewelry", to: "/shop" as const },
  { label: "Chains", to: "/shop" as const },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const bodyLockRef = useRef<{ overflow: string; paddingRight: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { count, openDrawer } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    bodyLockRef.current = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      const previousStyles = bodyLockRef.current;
      if (previousStyles) {
        document.body.style.overflow = previousStyles.overflow;
        document.body.style.paddingRight = previousStyles.paddingRight;
        bodyLockRef.current = null;
      }
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-card" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-8">
        <button
          className="md:hidden transition-transform duration-200 active:scale-90"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <Menu className="h-6 w-6 transition-transform duration-300" />
        </button>

        <Link to="/" className="flex items-center">
          <span className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Ranny&apos;s
          </span>
          <span className="font-accent ml-1 text-[10px] text-primary">Clothing</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l, i) => (
            <Link
              key={`${l.label}-${i}`}
              to={l.to}
              activeProps={{ className: "text-primary" }}
              className="font-accent text-xs font-medium text-foreground/80 transition hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-5">
          <Link
            to="/shop"
            aria-label="Search"
            className="hidden text-foreground/80 hover:text-primary md:block transition-colors"
          >
            <Search className="h-5 w-5" />
          </Link>
          <button
            aria-label="Wishlist"
            className="hidden text-foreground/80 hover:text-primary md:block transition-colors"
          >
            <Heart className="h-5 w-5" />
          </button>
          <button
            aria-label="Cart"
            onClick={openDrawer}
            className="relative text-foreground/80 hover:text-primary transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {count}
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className="fixed inset-0 top-16 z-40 md:hidden bg-background/95 shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
          style={{ touchAction: "pan-y" }}
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-md" />
          <div className="relative flex h-full w-full flex-col">
            <nav className="flex flex-1 flex-col gap-0 overflow-y-auto px-6 py-8 overscroll-contain">
              {navLinks.map((l, i) => (
                <Link
                  key={`${l.label}-${i}`}
                  to={l.to}
                  onClick={closeMenu}
                  className="font-display border-b border-border py-4 text-2xl text-foreground transition-colors duration-200 hover:text-primary"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/cart"
                onClick={closeMenu}
                className="font-display border-b border-border py-4 text-2xl text-foreground transition-colors duration-200 hover:text-primary"
              >
                Bag ({count})
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
