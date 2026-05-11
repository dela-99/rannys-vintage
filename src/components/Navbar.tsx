import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, Heart, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "New", to: "/" },
  { label: "Dresses", to: "/" },
  { label: "Shoes", to: "/" },
  { label: "Jewelry", to: "/" },
  { label: "Chains", to: "/" },
  { label: "About", to: "/" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-card" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-8">
        <button
          className="md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <Link to="/" className="flex items-center">
          <span className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Ranny&apos;s
          </span>
          <span className="font-accent ml-1 text-[10px] text-primary">Clothing</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="font-accent text-xs font-medium text-foreground/80 transition hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-5">
          <button aria-label="Search" className="hidden md:block text-foreground/80 hover:text-primary">
            <Search className="h-5 w-5" />
          </button>
          <button aria-label="Wishlist" className="hidden md:block text-foreground/80 hover:text-primary">
            <Heart className="h-5 w-5" />
          </button>
          <button aria-label="Cart" className="relative text-foreground/80 hover:text-primary">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              0
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-background animate-[fade-in_0.3s_ease-out_both] md:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="font-display text-2xl font-bold">Ranny&apos;s</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col gap-2 px-6 pt-8">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                className="font-display border-b border-border py-4 text-2xl text-foreground hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
