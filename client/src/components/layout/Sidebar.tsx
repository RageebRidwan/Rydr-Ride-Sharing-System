import { Link, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Car,
  History,
  User,
  Users,
  UserCheck,
  MapPin,
  BarChart3,
  DollarSign,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/app/hooks";
import { ROUTES } from "@/lib/constants";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const riderNav: NavItem[] = [
  { title: "Dashboard", href: ROUTES.RIDER_DASHBOARD, icon: LayoutDashboard },
  { title: "Request Ride", href: ROUTES.REQUEST_RIDE, icon: Car },
  { title: "Active Ride", href: ROUTES.ACTIVE_RIDE, icon: MapPin },
  { title: "Ride History", href: ROUTES.RIDE_HISTORY, icon: History },
  { title: "Profile", href: ROUTES.RIDER_PROFILE, icon: User },
];

const driverNav: NavItem[] = [
  { title: "Dashboard", href: ROUTES.DRIVER_DASHBOARD, icon: LayoutDashboard },
  { title: "Incoming Requests", href: ROUTES.INCOMING_REQUESTS, icon: Inbox },
  { title: "Active Ride", href: ROUTES.DRIVER_ACTIVE_RIDE, icon: Car },
  { title: "Ride History", href: ROUTES.DRIVER_HISTORY, icon: History },
  { title: "Earnings", href: ROUTES.EARNINGS, icon: DollarSign },
  { title: "Profile", href: ROUTES.DRIVER_PROFILE, icon: User },
];

const adminNav: NavItem[] = [
  { title: "Dashboard", href: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
  { title: "User Management", href: ROUTES.USER_MANAGEMENT, icon: Users },
  { title: "Driver Approval", href: ROUTES.DRIVER_APPROVAL, icon: UserCheck },
  { title: "Ride Management", href: ROUTES.RIDE_MANAGEMENT, icon: MapPin },
  { title: "Analytics", href: ROUTES.ANALYTICS, icon: BarChart3 },
  { title: "Profile", href: ROUTES.ADMIN_PROFILE, icon: User },
];

export function Sidebar() {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  const navItems =
    user?.role === "rider"
      ? riderNav
      : user?.role === "driver"
      ? driverNav
      : user?.role === "admin"
      ? adminNav
      : [];

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-muted/40 h-[calc(100vh-4rem)]">
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
