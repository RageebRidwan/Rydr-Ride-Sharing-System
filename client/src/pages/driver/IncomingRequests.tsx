import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useGetPendingRidesQuery,
  useAcceptRideMutation,
} from "@/features/driver/driverApi";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Inbox, MapPin, User } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/lib/constants";

export default function IncomingRequests() {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetPendingRidesQuery({});
  const [acceptRide, { isLoading: isAccepting }] = useAcceptRideMutation();

  const rides = data?.data || [];

  const handleAcceptRide = async (rideId: string) => {
    try {
      await acceptRide(rideId).unwrap();
      toast.success("Ride accepted successfully!");
      navigate(ROUTES.DRIVER_ACTIVE_RIDE);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to accept ride");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Incoming Ride Requests</h1>
          <p className="text-muted-foreground">
            Accept rides from nearby riders
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
            <CardDescription>
              {rides.length} ride requests available
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : rides.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title="No pending requests"
                description="Check back soon for new ride requests"
              />
            ) : (
              <div className="space-y-4">
                {rides.map((ride) => {
                  const rider =
                    typeof ride.riderId === "object" ? ride.riderId : null;
                  return (
                    <Card key={ride._id}>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {rider?.name || "Unknown Rider"}
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="text-sm">
                                    <span className="font-medium">From:</span>{" "}
                                    {ride.pickup.address}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">To:</span>{" "}
                                    {ride.destination.address}
                                  </p>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Requested {formatDateTime(ride.createdAt)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary mb-2">
                                {formatCurrency(ride.fare)}
                              </p>
                              <Button
                                onClick={() => handleAcceptRide(ride._id)}
                                disabled={isAccepting}
                              >
                                Accept Ride
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
