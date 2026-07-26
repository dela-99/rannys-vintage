import { Link } from "@tanstack/react-router";
import { Search, Bell, Menu } from "lucide-react";
import avatar from "@/assets/ranny-avatar.jpg";

interface TopBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function TopBar({ sidebarOpen, setSidebarOpen }: TopBarProps) {
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
              placeholder="Search..."
              className="w-full rounded-full border border-border bg-primary-soft/40 py-2 pl-11 pr-4 focus:outline-none"
            />
          </div>
          <button className="relative text-muted-foreground hover:text-primary">
            <Bell className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
              2
            </span>
          </button>
          <img src={avatar} alt="Ranny" className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </header>
  );
}