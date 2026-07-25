import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, Heart, Menu, LogIn, ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Category } from "@/data/products";
import { useAuth } from "@/auth";

type NavLink = {
  label: string;
  to: string;
  category?: Category;
  subCategories?: { label: string; to: string }[];
};

const navLinks: NavLink[] = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  {
    label: "Dresses",
    to: "/shop?category=Dresses",
    category: "Dresses",
    subCategories: [
      { label: "Dresses", to: "/shop?category=Dresses" },
      { label: "Jeans", to: "/shop?category=Jeans" },
      { label: "Tops", to: "/shop?category=Tops" },
      { label: "Skirts", to: "/shop?category=Skirts" },
    ],
  },
  {
    label: "Footwear",
    to: "/shop?category=Footwear",
    category: "Footwear",
    subCategories: [
      { label: "Heels", to: "/shop?category=Heels" },
      { label: "Easy Wear", to: "/shop?category=Easy Wear" },
      { label: "Flats", to: "/shop?category=Flats" },
      { label: "Sandals", to: "/shop?category=Sandals" },
      { label: "Sneakers", to: "/shop?category=Sneakers" },
    ],
  },
  {
    label: "Jewelry",
    to: "/shop?category=Jewelry",
    category: "Jewelry",
    subCategories: [
      { label: "Necklaces", to: "/shop?category=Necklaces" },
      { label: "Chains", to: "/shop?category=Chains" },
      { label: "Rings", to: "/shop?category=Rings" },
      { label: "Earrings", to: "/shop?category=Earrings" },
    ],
  },
  {
    label: "Bags",
    to: "/shop?category=Bags",
    category: "Bags",
    subCategories: [
      { label: "Handbags", to: "/shop?category=Handbags" },
      { label: "Shoulder Bags", to: "/shop?category=Shoulder Bags" },
      { label: "Crossbody Bags", to: "/shop?category=Crossbody Bags" },
      { label: "Tote Bags", to: "/shop?category=Tote Bags" },
    ],
  },
  {
    label: "Accessories",
    to: "/shop?category=Accessories",
    category: "Accessories",
    subCategories: [
      { label: "Body Splashes", to: "/shop?category=Body Splashes" },
      { label: "Leggings", to: "/shop?category=Leggings" },
    ],
  },
  { label: "About", to: "/#about" },
  { label: "Contact", to: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const bodyLockRef = useRef<{ overflow: string; paddingRight: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { count, openDrawer } = useCart();
  const { user, signOut } = useAuth();

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

        <Link to="/" params={{}} className="flex items-center">
          <span className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Ranny&apos;s
          </span>
          <span className="font-accent ml-1 text-[10px] text-primary">Vintage Clothing</span>
        </Link>

        <nav className="group hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavItem key={link.label} link={link} />
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <Link
            to="/login"
            params={{}}
            search={{ redirect: "/shop" }}
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
          {user ? (
            <button
              onClick={() => signOut()}
              className="hidden items-center gap-2 rounded-full bg-foreground px-4 py-2 text-[10px] font-semibold text-background transition hover:bg-primary md:flex"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              params={{}}
              search={{ redirect: "/" }}
              className="hidden items-center gap-2 rounded-full bg-foreground px-4 py-2 text-[10px] font-semibold text-background transition hover:bg-primary md:flex"
            >
              <LogIn className="h-3.5 w-3.5" />
              Login
            </Link>
          )}
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
              {navLinks.map((link) => (
                <MobileNavItem key={link.label} link={link} closeMenu={closeMenu} />
              ))}
              <Link
                to="/cart"
                params={{}}
                onClick={closeMenu}
                className="font-display border-b border-border py-4 text-2xl text-foreground transition-colors duration-200 hover:text-primary"
              >
                Cart ({count})
              </Link>
              {user ? (
                <button
                  onClick={() => {
                    signOut();
                    closeMenu();
                  }}
                  className="font-display border-b border-border py-4 text-left text-2xl text-foreground transition-colors duration-200 hover:text-primary"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  params={{}}
                  search={{ redirect: "/" }}
                  onClick={closeMenu}
                  className="font-display border-b border-border py-4 text-2xl text-foreground transition-colors duration-200 hover:text-primary"
                >
                  Login / Account
                </Link>
              )}
            </div>
          </nav>
        </>
      )}
    </header>
  );
}

function NavItem({ link }: { link: NavLink }) {
  const hasSubCategories = link.subCategories && link.subCategories.length > 0;

  return (
    <div className="group/item relative">
      <Link
        to={link.to as string}
        params={{}}
        search={{}}
        activeProps={{ className: "text-primary" }}
        className="font-accent group-hover/item:text-primary flex items-center gap-1 px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-foreground/80 transition hover:text-primary"
      >
        {link.label}
        {hasSubCategories && (
          <ChevronDown className="h-3 w-3 transition-transform duration-300 group-hover/item:rotate-180" />
        )}
      </Link>
      {hasSubCategories && (
        <div className="pointer-events-none absolute left-0 top-full z-10 w-48 rounded-xl bg-background p-2 opacity-0 shadow-lg transition-all duration-300 group-hover/item:pointer-events-auto group-hover/item:opacity-100 group-hover/item:translate-y-2">
          <div className="flex flex-col">
            {link.subCategories?.map((subLink) => (
              <Link
                key={subLink.label}
                to={subLink.to as string}
                params={{}}
                search={{}}
                className="rounded-lg px-4 py-2 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-primary"
              >
                {subLink.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileNavItem({ link, closeMenu }: { link: NavLink; closeMenu: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubCategories = link.subCategories && link.subCategories.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    if (hasSubCategories) {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else {
      if (link.to) closeMenu();
    }
  };

  return (
    <div className="border-b border-border">
      <Link
        to={link.to as string}
        params={{}}
        search={{}}
        onClick={handleToggle}
        className="flex items-center justify-between py-4 font-display text-2xl text-foreground transition-colors duration-200 hover:text-primary"
      >
        {link.label}
        {hasSubCategories && (
          <ChevronDown
            className={`h-6 w-6 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </Link>
      {hasSubCategories && (
        <div
          className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0">
            <div className="flex flex-col pb-4 pl-4">
              {link.subCategories?.map((subLink) => (
                <Link
                  key={subLink.label}
                  to={subLink.to as string}
                  params={{}}
                  search={{}}
                  onClick={closeMenu}
                  className="py-2 text-lg text-muted-foreground transition-colors hover:text-primary"
                >
                  {subLink.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
