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
import { useGetRideHistoryQuery } from "@/features/rides/ridesApi";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { ROUTES } from "@/lib/constants";
import {
  formatCurrency,
  formatDate,
  getRideStatusColor,
  formatRideStatus,
} from "@/lib/utils";
import { Car, History, MapPin, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RiderDashboard() {
  const {
    data: ridesData,
    isLoading,
    error,
  } = useGetRideHistoryQuery({ limit: 5 });

  const recentRides = ridesData?.data || [];
  const completedRides = recentRides.filter(
    (ride) => ride.status === "completed"
  ).length;
  const totalSpent = recentRides
    .filter((ride) => ride.status === "completed")
    .reduce((sum, ride) => sum + ride.fare, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Rider Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your ride overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {ridesData?.pagination?.total || 0}
              </div>
              <p className="text-xs text-muted-foreground">All time rides</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedRides}</div>
              <p className="text-xs text-muted-foreground">
                Successfully completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalSpent)}
              </div>
              <p className="text-xs text-muted-foreground">
                On completed rides
              </p>
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
              <Link to={ROUTES.REQUEST_RIDE}>
                <Car className="mr-2 h-4 w-4" />
                Request Ride
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={ROUTES.ACTIVE_RIDE}>
                <MapPin className="mr-2 h-4 w-4" />
                Active Ride
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={ROUTES.RIDE_HISTORY}>
                <History className="mr-2 h-4 w-4" />
                View History
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
                <Link to={ROUTES.RIDE_HISTORY}>View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <ErrorMessage message="Failed to load recent rides" />
            ) : recentRides.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No rides yet</p>
                <Button className="mt-4" asChild>
                  <Link to={ROUTES.REQUEST_RIDE}>Book Your First Ride</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentRides.map((ride) => (
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
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(ride.fare)}</p>
                      <Link
                        to={`/rider/rides/${ride._id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
