import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Menu } from "lucide-react";
import Logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";
import { useLogoutMutation } from "@/features/auth/authApi";
import { ROUTES } from "@/lib/constants";
import { toast } from "sonner";
import { useState } from "react";

export function Navbar() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate(ROUTES.HOME);
    } catch (error) {
      dispatch(logout());
      navigate(ROUTES.HOME);
    }
  };

  const getDashboardRoute = () => {
    if (user?.role === "rider") return ROUTES.RIDER_DASHBOARD;
    if (user?.role === "driver") return ROUTES.DRIVER_DASHBOARD;
    if (user?.role === "admin") return ROUTES.ADMIN_DASHBOARD;
    return ROUTES.HOME;
  };

  const getProfileRoute = () => {
    if (user?.role === "rider") return ROUTES.RIDER_PROFILE;
    if (user?.role === "driver") return ROUTES.DRIVER_PROFILE;
    if (user?.role === "admin") return ROUTES.ADMIN_PROFILE;
    return ROUTES.HOME;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2 font-bold text-xl"
          >
            {/* <Car className="h-6 w-6 text-primary" /> */}
            <img src={Logo} alt="logo" className="h-6 w-6" />
            <span>Rydr</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to={ROUTES.HOME}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to={ROUTES.ABOUT}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              to={ROUTES.FEATURES}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              to={ROUTES.CONTACT}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <Link
              to={ROUTES.FAQ}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              FAQ
            </Link>
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize mt-1">
                      Role: {user.role}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate(getDashboardRoute())}
                  >
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(getProfileRoute())}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate(ROUTES.LOGIN)}>
                  Login
                </Button>
                <Button onClick={() => navigate(ROUTES.REGISTER)}>
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link
              to={ROUTES.HOME}
              className="block px-4 py-2 text-sm hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to={ROUTES.ABOUT}
              className="block px-4 py-2 text-sm hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to={ROUTES.FEATURES}
              className="block px-4 py-2 text-sm hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to={ROUTES.CONTACT}
              className="block px-4 py-2 text-sm hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to={ROUTES.FAQ}
              className="block px-4 py-2 text-sm hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            {!isAuthenticated && (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate(ROUTES.LOGIN);
                    setMobileMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button
                  className="w-full"
                  onClick={() => {
                    navigate(ROUTES.REGISTER);
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
