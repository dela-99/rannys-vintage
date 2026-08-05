import { Link } from "@tanstack/react-router";
import { Search, Bell, Menu, UserCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { operationsService } from "@/services/operationsService";

interface TopBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

type SearchResults = Awaited<ReturnType<typeof operationsService.globalSearch>>["results"];
type SearchResultItem = SearchResults[keyof SearchResults][number];

function getResultKey(item: SearchResultItem) {
  if ("$id" in item && item.$id) {
    return item.$id;
  }

  if ("id" in item && item.id) {
    return item.id;
  }

  if ("name" in item && item.name) {
    return item.name;
  }

  return crypto.randomUUID();
}

function getResultTitle(item: SearchResultItem) {
  if ("orderNumber" in item && item.orderNumber) {
    return item.orderNumber;
  }

  if ("subject" in item && item.subject) {
    return item.subject;
  }

  if ("name" in item && item.name) {
    return item.name;
  }

  return "Untitled";
}

function getResultMeta(item: SearchResultItem) {
  if ("email" in item && item.email) {
    return item.email;
  }

  if ("category" in item && item.category) {
    return item.category;
  }

  return "";
}

export function TopBar({ sidebarOpen, setSidebarOpen }: TopBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null);
      return;
    }

    const timeout = window.setTimeout(() => {
      operationsService
        .globalSearch(query.trim())
        .then((result) => {
          setResults(result.results);
          setOpen(true);
        })
        .catch(() => {
          setResults(null);
        });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [query]);

  const groupedResults = useMemo(() => {
    if (!results) {
      return [];
    }

    return [
      { label: "Products", path: "/admin/products", items: results.products },
      { label: "Orders", path: "/admin/orders", items: results.orders },
      { label: "Customers", path: "/admin/customers", items: results.customers },
      { label: "Messages", path: "/admin/messages", items: results.messages },
      { label: "Inventory", path: "/admin/inventory", items: results.products },
    ].filter((group) => group.items.length > 0);
  }, [results]);

  return (
    <header className="sticky top-0 z-999 flex w-full bg-background/80 shadow-sm backdrop-blur-sm">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-border bg-white p-1.5 shadow-sm lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/admin" className="flex items-center lg:hidden">
            <span className="font-display text-xl font-bold tracking-tight text-foreground">
              Ranny's
            </span>
          </Link>
        </div>

        <div className="hidden sm:block">
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Welcome back, Ranny 👋
          </h1>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setOpen(true)}
              onBlur={() => window.setTimeout(() => setOpen(false), 150)}
              placeholder="Search products, orders, customers..."
              className="w-full rounded-full border border-border bg-primary-soft/40 py-2 pl-11 pr-4 focus:outline-none"
            />
            {open && groupedResults.length > 0 && (
              <div className="absolute right-0 top-12 z-50 w-96 rounded-2xl border border-border bg-white p-3 shadow-hover">
                {groupedResults.map((group) => (
                  <div key={group.label} className="border-b border-border/70 py-2 last:border-b-0">
                    <p className="font-accent px-2 text-[10px] text-muted-foreground">
                      {group.label}
                    </p>
                    {group.items.slice(0, 4).map((item) => (
                      <Link
                        key={getResultKey(item)}
                        to={group.path as "/admin/products"}
                        onClick={() => {
                          setOpen(false);
                          setQuery("");
                        }}
                        className="block rounded-lg px-2 py-2 text-sm hover:bg-primary-soft"
                      >
                        {getResultTitle(item)}
                        <span className="ml-2 text-xs text-muted-foreground">
                          {getResultMeta(item)}
                        </span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="relative text-muted-foreground hover:text-primary">
            <Bell className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
              2
            </span>
          </button>
          <div
            aria-label="Ranny profile"
            className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-primary"
          >
            <UserCircle className="h-6 w-6" />
          </div>
        </div>
      </div>
    </header>
  );
}
