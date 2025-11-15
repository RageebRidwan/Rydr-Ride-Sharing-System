import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useGetRideHistoryQuery,
  useCancelRideMutation,
} from "@/features/rides/ridesApi";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import {
  formatCurrency,
  getRideStatusColor,
  formatRideStatus,
} from "@/lib/utils";
import { MapPin, User, Phone, Car, X, Clock } from "lucide-react";
import { toast } from "sonner";
import { ROUTES } from "@/lib/constants";
import { useState } from "react";

export default function ActiveRide() {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetRideHistoryQuery(
    { limit: 1 },
    { refetchOnMountOrArgChange: true }
  );
  const [cancelRide] = useCancelRideMutation();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const rides = data?.data || [];
  const activeRide = rides.find((ride) =>
    ["requested", "accepted", "picked_up", "in_transit"].includes(ride.status)
  );

  // Auto-refresh every 5 seconds to get real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 2000);
    return () => clearInterval(interval);
  }, [refetch]);

  const handleCancelRide = async () => {
    if (!activeRide) return;
    try {
      await cancelRide({
        id: activeRide._id,
        reason: "",
      }).unwrap();
      toast.success("Ride cancelled successfully");
      setShowCancelDialog(false);
      navigate(ROUTES.RIDER_DASHBOARD);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to cancel ride");
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  if (!activeRide) {
    return (
      <DashboardLayout>
        <EmptyState
          icon={Car}
          title="No Active Ride"
          description="You don't have any active rides at the moment"
          action={{
            label: "Request a Ride",
            onClick: () => navigate(ROUTES.REQUEST_RIDE),
          }}
        />
      </DashboardLayout>
    );
  }

  const driver =
    typeof activeRide.driverId === "object" ? activeRide.driverId : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Active Ride</h1>
            <p className="text-muted-foreground">Track your current ride</p>
          </div>
          <Badge
            className={`${getRideStatusColor(activeRide.status)}
            text-lg px-4 py-2`}
          >
            {formatRideStatus(activeRide.status)}
          </Badge>
        </div>

        {/* Ride Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Ride Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className={`h-3 w-3 rounded-full ${
                    activeRide.status === "requested"
                      ? "bg-primary animate-pulse"
                      : "bg-green-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium">Ride Requested</p>
                  <p className="text-sm text-muted-foreground">
                    Looking for a nearby driver...
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`h-3 w-3 rounded-full ${
                    activeRide.status === "accepted"
                      ? "bg-primary animate-pulse"
                      : activeRide.status === "picked_up" ||
                        activeRide.status === "in_transit"
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium">Driver Accepted</p>
                  {driver && (
                    <p className="text-sm text-muted-foreground">
                      Driver is on the way
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`h-3 w-3 rounded-full ${
                    activeRide.status === "picked_up"
                      ? "bg-primary animate-pulse"
                      : activeRide.status === "in_transit"
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium">Picked Up</p>
                  <p className="text-sm text-muted-foreground">
                    On the way to destination
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`h-3 w-3 rounded-full ${
                    activeRide.status === "in_transit"
                      ? "bg-primary animate-pulse"
                      : "bg-gray-300"
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium">In Transit</p>
                  <p className="text-sm text-muted-foreground">
                    Arriving at destination
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Trip Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Trip Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Pickup</p>
                <p className="text-muted-foreground">
                  {activeRide.pickup.address}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Destination</p>
                <p className="text-muted-foreground">
                  {activeRide.destination.address}
                </p>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Fare</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(activeRide.fare)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Driver Info */}
          {driver ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Driver Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Name</p>
                  <p className="text-lg font-semibold">{driver.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Vehicle</p>
                  <p className="text-muted-foreground">
                    {driver.vehicleInfo || "N/A"}
                  </p>
                </div>
                {driver.phoneNumber && (
                  <div>
                    <p className="text-sm font-medium mb-1">Contact</p>
                    <a
                      href={`tel:${driver.phoneNumber}`}
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Phone className="h-4 w-4" />
                      {driver.phoneNumber}
                    </a>
                  </div>
                )}
                {driver.averageRating && (
                  <div>
                    <p className="text-sm font-medium mb-1">Rating</p>
                    <p className="text-muted-foreground">
                      ⭐ {driver.averageRating.toFixed(1)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 animate-pulse" />
                  Finding Driver...
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We're searching for a nearby driver. This usually takes less
                  than a minute.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions */}
        {activeRide.status === "requested" && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Cancel Ride</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                You can cancel this ride before a driver accepts it.
              </p>
              <Button
                variant="destructive"
                onClick={() => setShowCancelDialog(true)}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel Ride
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Cancel Ride?"
        description="Are you sure you want to cancel this ride? This action cannot be undone."
        onConfirm={handleCancelRide}
        confirmText="Yes, Cancel Ride"
        variant="destructive"
      />
    </DashboardLayout>
  );
}
