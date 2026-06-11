import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, Heart, Menu, X, Instagram, Send, User, LogIn } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "Home", to: "/" as const },
  { label: "Shop", to: "/shop" as const },
  { label: "Dresses", to: "/shop" as const },
  { label: "Shoes", to: "/shop" as const },
  { label: "Jewelry", to: "/shop" as const },
  { label: "Chains", to: "/shop" as const },
  { label: "About", to: "/#about" as const },
  { label: "Contact", to: "/contact" as const },
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
          <span className="font-accent ml-1 text-[10px] text-primary">Vintage Clothing</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l, i) => (
            <Link
              key={`${l.label}-${i}`}
              to={l.to}
              activeProps={{ className: "text-primary" }}
              className="font-accent text-[11px] font-medium text-foreground/80 transition hover:text-primary uppercase tracking-wider"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden items-center gap-4 border-r border-border pr-4 md:flex">
            <a
              href="https://www.instagram.com/shop_rannys"
              target="_blank"
              rel="noreferrer"
              className="text-foreground/60 hover:text-primary transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://www.tiktok.com/@shop_rannys_new"
              target="_blank"
              rel="noreferrer"
              className="text-foreground/60 hover:text-primary transition-colors"
            >
              <Send className="h-4 w-4" />
            </a>
          </div>

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
          <Link
            to="/login"
            className="hidden items-center gap-2 rounded-full bg-foreground px-4 py-2 text-[10px] font-semibold text-background transition hover:bg-primary md:flex"
          >
            <LogIn className="h-3.5 w-3.5" />
            Login
          </Link>
        </div>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 top-16 z-40 md:hidden bg-foreground/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <nav
            ref={menuRef}
            id="mobile-menu"
            className="fixed left-0 right-0 top-16 bottom-0 z-50 md:hidden bg-background overflow-y-auto overscroll-contain will-change-transform"
            style={{ touchAction: "pan-y" }}
          >
            <div className="flex flex-col gap-0 px-6 py-6">
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
              <Link
                to="/login"
                onClick={closeMenu}
                className="font-display border-b border-border py-4 text-2xl text-foreground transition-colors duration-200 hover:text-primary"
              >
                Login / Account
              </Link>

              <div className="mt-8 flex gap-4">
                <a
                  href="https://www.instagram.com/shop_rannys"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 font-accent text-xs text-muted-foreground"
                >
                  <Instagram className="h-5 w-5" /> Instagram
                </a>
                <a
                  href="https://www.tiktok.com/@shop_rannys_new"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 font-accent text-xs text-muted-foreground"
                >
                  <Send className="h-5 w-5" /> TikTok
                </a>
              </div>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
