import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  MessageSquare,
  Ticket,
  Home,
  Mail,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useAuth } from "@/auth";
import { toast } from "sonner";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/admin/dashboard" },
  { icon: ShoppingBag, label: "Products", to: "/admin/products" },
  { icon: Package, label: "Inventory", to: "/admin/inventory" },
  { icon: ShoppingBag, label: "Orders", to: "/admin/orders" },
  { icon: Users, label: "Customers", to: "/admin/customers" },
  { icon: MessageSquare, label: "Messages", to: "/admin/messages" },
  { icon: Ticket, label: "Promotions", to: "/admin/promotions" },
  { icon: Home, label: "Homepage", to: "/admin/homepage" },
  { icon: Mail, label: "Subscribers", to: "/admin/subscribers" },
  { icon: Settings, label: "Settings", to: "/admin/settings" },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { pathname } = location;

  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!(target instanceof Node)) return;
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target))
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out successfully.");
      void navigate({ to: "/" });
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <aside
      ref={sidebar}
      id="sidebar"
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72 flex-col overflow-y-hidden bg-foreground duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5 lg:py-6">
        <Link to="/admin" className="flex items-center">
          <span className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
            Ranny's
          </span>
          <span className="font-accent ml-1 text-[10px] text-primary-glow">Vintage Clothing</span>
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          aria-label="Toggle sidebar"
          className="block lg:hidden text-white"
        >
          <ChevronLeft
            className={`h-6 w-6 transition-transform ${sidebarOpen ? "" : "rotate-180"}`}
          />
        </button>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 flex-1 px-4 py-4 lg:mt-9 lg:px-6">
          <ul className="flex flex-col gap-1.5">
            {menuItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium text-background/70 duration-300 ease-in-out hover:bg-primary-soft/20 hover:text-white ${
                    pathname.includes(item.to) ? "bg-primary-soft/20 text-white" : ""
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto px-4 py-4 lg:px-6">
          <ul className="flex flex-col gap-1.5">
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium text-background/70 duration-300 ease-in-out hover:bg-primary-soft/20 hover:text-white"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
