// src/pages/driver/ActiveRide.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useCancelRideMutation,
  useGetDriverHistoryQuery,
  useUpdateRideStatusMutation,
} from "@/features/driver/driverApi";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import {
  formatCurrency,
  getRideStatusColor,
  formatRideStatus,
} from "@/lib/utils";
import {
  MapPin,
  User,
  Phone,
  CheckCircle,
  Navigation,
  Flag,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { ROUTES } from "@/lib/constants";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

export default function DriverActiveRide() {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetDriverHistoryQuery(
    { limit: 10 },
    { refetchOnMountOrArgChange: true }
  );
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateRideStatusMutation();
  const [cancelRide] = useCancelRideMutation();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const rides = data?.data || [];
  const activeRide = rides.find((ride) =>
    ["accepted", "picked_up", "in_transit"].includes(ride.status)
  );

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 2000);
    return () => clearInterval(interval);
  }, [refetch]);

  const handleUpdateStatus = async (
    status: "picked_up" | "in_transit" | "completed"
  ) => {
    if (!activeRide) return;
    try {
      await updateStatus({ id: activeRide._id, status }).unwrap();
      toast.success(`Ride status updated to ${formatRideStatus(status)}`);
      refetch();
      if (status === "completed") {
        navigate(ROUTES.DRIVER_DASHBOARD);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update ride status");
    }
  };
  const handleCancelRide = async () => {
    if (!activeRide) return;
    try {
      await cancelRide({
        id: activeRide._id,
      }).unwrap();
      toast.success("Ride cancelled successfully");
      setShowCancelDialog(false);
      navigate(ROUTES.DRIVER_DASHBOARD);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to cancel ride");
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  if (!activeRide) {
    return (
      <DashboardLayout>
        <EmptyState
          icon={Navigation}
          title="No Active Ride"
          description="You don't have any active rides. Accept a ride request to get started."
          action={{
            label: "View Ride Requests",
            onClick: () => navigate(ROUTES.INCOMING_REQUESTS),
          }}
        />
      </DashboardLayout>
    );
  }

  const rider =
    typeof activeRide.riderId === "object" ? activeRide.riderId : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Active Ride</h1>
            <p className="text-muted-foreground">Manage your current trip</p>
          </div>
          <Badge
            className={`${getRideStatusColor(activeRide.status)}
            text-lg px-4 py-2`}
          >
            {formatRideStatus(activeRide.status)}
          </Badge>
        </div>

        {/* Status Update Actions */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Update Ride Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {activeRide.status === "accepted" && (
                <Button
                  onClick={() => handleUpdateStatus("picked_up")}
                  disabled={isUpdating}
                  className="flex-1 sm:flex-none"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Picked Up
                </Button>
              )}
              {activeRide.status === "picked_up" && (
                <Button
                  onClick={() => handleUpdateStatus("in_transit")}
                  disabled={isUpdating}
                  className="flex-1 sm:flex-none"
                >
                  <Navigation className="mr-2 h-4 w-4" />
                  Start Trip
                </Button>
              )}
              {activeRide.status === "in_transit" && (
                <Button
                  onClick={() => handleUpdateStatus("completed")}
                  disabled={isUpdating}
                  className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                >
                  <Flag className="mr-2 h-4 w-4" />
                  Complete Trip
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        {/* Cancel Option for Accepted Rides */}
        {activeRide.status === "accepted" && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Cancel Ride</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                You can cancel this ride before picking up the rider.
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

        {/* Ride Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Trip Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`h-3 w-3 rounded-full bg-green-500`} />
                <div className="flex-1">
                  <p className="font-medium">Ride Accepted</p>
                  <p className="text-sm text-muted-foreground">
                    You accepted this ride request
                  </p>
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
                  <p className="font-medium">Picked Up Rider</p>
                  <p className="text-sm text-muted-foreground">
                    Rider is in the vehicle
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
                    Heading to destination
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`h-3 w-3 rounded-full bg-gray-300`} />
                <div className="flex-1">
                  <p className="font-medium">Complete Trip</p>
                  <p className="text-sm text-muted-foreground">
                    Arrive at destination
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
                <p className="text-sm font-medium mb-1">Pickup Location</p>
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
                  <span className="font-medium">You'll Earn</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(activeRide.fare)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rider Info */}
          {rider && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Rider Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Name</p>
                  <p className="text-lg font-semibold">{rider.name}</p>
                </div>
                {rider.phoneNumber && (
                  <div>
                    <p className="text-sm font-medium mb-1">Contact</p>
                    <a
                      href={`tel:${rider.phoneNumber}`}
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Phone className="h-4 w-4" />
                      {rider.phoneNumber}
                    </a>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium mb-1">Pickup Location</p>
                  <p className="text-sm text-muted-foreground">
                    {activeRide.pickup.address}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Instructions */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="space-y-2 text-sm">
              <p className="font-medium">📍 Navigation Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Use your preferred GPS app for navigation</li>
                <li>
                  Contact rider if you need clarification on pickup location
                </li>
                <li>Update status at each stage of the trip</li>
                <li>Ensure rider's safety throughout the journey</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Cancel Ride?"
        description="Are you sure you want to cancel this ride? The rider will be notified and the ride will be available for other drivers."
        onConfirm={handleCancelRide}
        confirmText="Yes, Cancel Ride"
        variant="destructive"
      />
    </DashboardLayout>
  );
}
