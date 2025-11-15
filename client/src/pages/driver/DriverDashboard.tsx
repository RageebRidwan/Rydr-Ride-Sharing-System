import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  useGetDriverHistoryQuery,
  useGetEarningsQuery,
  useSetAvailabilityMutation,
} from "@/features/driver/driverApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import {
  formatCurrency,
  formatDate,
  getRideStatusColor,
  formatRideStatus,
} from "@/lib/utils";
import { DollarSign, TrendingUp, History, Inbox, Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ROUTES } from "@/lib/constants";
import { setDriverAvailability } from "@/features/auth/authSlice";

export default function DriverDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { data: historyData, isLoading: historyLoading } =
    useGetDriverHistoryQuery({ limit: 5 });
  const { data: earningsData } = useGetEarningsQuery();
  const [setAvailability] = useSetAvailabilityMutation();

  const recentRides = historyData?.data || [];
  const earnings = earningsData?.data;

  const handleAvailabilityChange = async (isOnline: boolean) => {
    dispatch(setDriverAvailability(isOnline));
    try {
      await setAvailability({ isOnline }).unwrap();
      toast.success(`You are now ${isOnline ? "online" : "offline"}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update availability");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Driver Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
          </div>
        </div>

        {/* Availability Toggle */}
        <Card>
          <CardHeader>
            <CardTitle>Availability Status</CardTitle>
            <CardDescription>
              Control when you receive ride requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Switch
                id="availability"
                checked={user?.isOnline || false}
                onCheckedChange={handleAvailabilityChange}
              />
              <Label htmlFor="availability" className="cursor-pointer">
                {user?.isOnline ? (
                  <span className="text-green-600 font-medium">
                    You're Online - Receiving Requests
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    You're Offline - No Requests
                  </span>
                )}
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Earnings
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {earnings ? formatCurrency(earnings.totalEarnings) : "৳0.00"}
              </div>
              <p className="text-xs text-muted-foreground">All time earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {earnings ? formatCurrency(earnings.monthlyEarnings) : "৳0.00"}
              </div>
              <p className="text-xs text-muted-foreground">Monthly earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {earnings?.totalRides || 0}
              </div>
              <p className="text-xs text-muted-foreground">Completed rides</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>What would you like to do?</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button asChild>
              <Link to={ROUTES.INCOMING_REQUESTS}>
                <Inbox className="mr-2 h-4 w-4" />
                View Requests
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={ROUTES.EARNINGS}>
                <DollarSign className="mr-2 h-4 w-4" />
                View Earnings
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={ROUTES.DRIVER_HISTORY}>
                <History className="mr-2 h-4 w-4" />
                Ride History
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Rides */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Rides</CardTitle>
                <CardDescription>Your last 5 rides</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to={ROUTES.DRIVER_HISTORY}>View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : recentRides.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No rides yet</p>
                {user?.isOnline ? (
                  <p className="text-sm mt-2">Waiting for ride requests...</p>
                ) : (
                  <p className="text-sm mt-2">
                    Go online to receive ride requests
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {recentRides.map((ride) => {
                  const rider =
                    typeof ride.riderId === "object" ? ride.riderId : null;
                  return (
                    <div
                      key={ride._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{ride.pickup.address}</p>
                          <span className="text-muted-foreground">→</span>
                          <p className="font-medium">
                            {ride.destination.address}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatDate(ride.createdAt)}</span>
                          <Badge className={getRideStatusColor(ride.status)}>
                            {formatRideStatus(ride.status)}
                          </Badge>
                          {rider && <span>Rider: {rider.name}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(ride.fare)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
