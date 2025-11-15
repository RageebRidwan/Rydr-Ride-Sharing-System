import { useNavigate, Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegisterMutation } from "@/features/auth/authApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setCredentials } from "@/features/auth/authSlice";
import { ROUTES } from "@/lib/constants";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phoneNumber: z.string().optional(),
    role: z.enum(["rider", "driver"]).refine((val) => val, {
      message: "Please select a role",
    }),
    currentLocation: z.string().min(1, "Current location is required"),
    vehicleInfo: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === "driver") {
        return !!data.vehicleInfo && data.vehicleInfo.length > 0;
      }
      return true;
    },
    {
      message: "Vehicle information is required for drivers",
      path: ["vehicleInfo"],
    }
  );

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [register, { isLoading }] = useRegisterMutation();

  const {
    register: registerField,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const selectedRole = watch("role");

  // Redirect if already logged in
  if (isAuthenticated && user) {
    const dashboardRoute =
      user.role === "rider"
        ? ROUTES.RIDER_DASHBOARD
        : user.role === "driver"
        ? ROUTES.DRIVER_DASHBOARD
        : ROUTES.ADMIN_DASHBOARD;
    return <Navigate to={dashboardRoute} replace />;
  }

  const onSubmit = async (data: RegisterForm) => {
    try {
      const response = await register(data).unwrap();
      dispatch(
        setCredentials({ user: response.data!.user, token: response.data!.token })
      );
      toast.success("Registration successful!");

      // Navigate based on role
      const dashboardRoute =
        response.data!.user.role === "rider"
          ? ROUTES.RIDER_DASHBOARD
          : response.data!.user.role === "driver"
          ? ROUTES.DRIVER_DASHBOARD
          : ROUTES.ADMIN_DASHBOARD;
      navigate(dashboardRoute);
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Create an account
            </CardTitle>
            <CardDescription>
              Enter your information to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  {...registerField("name")}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...registerField("email")}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...registerField("password")}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+8801712345678"
                  {...registerField("phoneNumber")}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">I want to</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("role", value as "rider" | "driver")
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rider">Book Rides (Rider)</SelectItem>
                    <SelectItem value="driver">Offer Rides (Driver)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-destructive">
                    {errors.role.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentLocation">Current Location</Label>
                <Input
                  id="currentLocation"
                  placeholder="Dhaka, Bangladesh"
                  {...registerField("currentLocation")}
                  disabled={isLoading}
                />
                {errors.currentLocation && (
                  <p className="text-sm text-destructive">
                    {errors.currentLocation.message}
                  </p>
                )}
              </div>

              {selectedRole === "driver" && (
                <div className="space-y-2">
                  <Label htmlFor="vehicleInfo">Vehicle Information</Label>
                  <Input
                    id="vehicleInfo"
                    placeholder="Toyota Corolla - DHA-1234"
                    {...registerField("vehicleInfo")}
                    disabled={isLoading}
                  />
                  {errors.vehicleInfo && (
                    <p className="text-sm text-destructive">
                      {errors.vehicleInfo.message}
                    </p>
                  )}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to={ROUTES.LOGIN}
                  className="text-primary hover:underline font-medium"
                >
                  Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
