import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  useGetRideByIdQuery,
  useRateDriverMutation,
  useLeaveFeedbackMutation,
  useCancelRideMutation,
} from "@/features/rides/ridesApi";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import {
  formatCurrency,
  formatDateTime,
  getRideStatusColor,
  formatRideStatus,
} from "@/lib/utils";
import { MapPin, User, Star, MessageSquare, X, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ROUTES } from "@/lib/constants";

export default function RideDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useGetRideByIdQuery(id!);
  const [rateDriver] = useRateDriverMutation();
  const [leaveFeedback] = useLeaveFeedbackMutation();
  const [cancelRide] = useCancelRideMutation();

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  // const [cancelReason, setCancelReason] = useState("");

  const ride = data?.data?.ride;

  const handleRateDriver = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    try {
      await rateDriver({ id: id!, rating }).unwrap();
      toast.success("Driver rated successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to rate driver");
    }
  };

  const handleLeaveFeedback = async () => {
    if (!feedback.trim()) {
      toast.error("Please enter feedback");
      return;
    }
    try {
      await leaveFeedback({ id: id!, feedback }).unwrap();
      toast.success("Feedback submitted successfully");
      setFeedback("");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit feedback");
    }
  };

  const handleCancelRide = async () => {
    try {
      await cancelRide({ id: id! }).unwrap();
      toast.success("Ride cancelled successfully");
      setShowCancelDialog(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to cancel ride");
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message="Failed to load ride details" />;
  if (!ride) return <ErrorMessage message="Ride not found" />;

  const driver = typeof ride.driverId === "object" ? ride.driverId : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(ROUTES.RIDE_HISTORY)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Ride Details</h1>
              <p className="text-muted-foreground">
                View complete ride information
              </p>
            </div>
          </div>
          <Badge className={getRideStatusColor(ride.status)}>
            {formatRideStatus(ride.status)}
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Trip Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Trip Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Pickup Location</p>
                <p className="text-muted-foreground">{ride.pickup.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Destination</p>
                <p className="text-muted-foreground">
                  {ride.destination.address}
                </p>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Fare</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(ride.fare)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Driver Information */}
          {driver && (
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
                  <p className="text-muted-foreground">{driver.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Vehicle</p>
                  <p className="text-muted-foreground">
                    {driver.vehicleInfo || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Rating</p>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {driver.averageRating?.toFixed(1) || "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Ride Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ride.timestamps.requestedAt && (
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Ride Requested</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(ride.timestamps.requestedAt)}
                    </p>
                  </div>
                </div>
              )}
              {ride.timestamps.acceptedAt && (
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Driver Accepted</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(ride.timestamps.acceptedAt)}
                    </p>
                  </div>
                </div>
              )}
              {ride.timestamps.pickedUpAt && (
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Picked Up</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(ride.timestamps.pickedUpAt)}
                    </p>
                  </div>
                </div>
              )}
              {ride.timestamps.completedAt && (
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <div className="h-3 w-3 rounded-full bg-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Completed</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(ride.timestamps.completedAt)}
                    </p>
                  </div>
                </div>
              )}
              {ride.timestamps.cancelledAt && (
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <div className="h-3 w-3 rounded-full bg-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">Cancelled</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(ride.timestamps.cancelledAt)}
                    </p>
                    {ride.cancellationReason && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Reason: {ride.cancellationReason}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rate Driver */}
        {ride.status === "completed" && !ride.driverRating && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Rate Your Driver
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <Button onClick={handleRateDriver}>Submit Rating</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Show Submitted Rating */}
        {ride.driverRating && (
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                <Star className="h-5 w-5" />
                Your Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 ${
                      star <= ride.driverRating!
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 font-semibold text-yellow-800 dark:text-yellow-200">
                  {ride.driverRating.toFixed(1)} / 5.0
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                ✓ Rating submitted successfully
              </p>
            </CardContent>
          </Card>
        )}

        {/* Leave Feedback */}
        {ride.status === "completed" && !ride.riderFeedback && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Leave Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="feedback">Your Feedback</Label>
                  <Textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your experience..."
                    rows={4}
                  />
                </div>
                <Button onClick={handleLeaveFeedback}>Submit Feedback</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Show Submitted Feedback */}
        {ride.riderFeedback && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <MessageSquare className="h-5 w-5" />
                Your Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-800 dark:text-green-200">
                {ride.riderFeedback}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                ✓ Feedback submitted successfully
              </p>
            </CardContent>
          </Card>
        )}

        {/* Cancel Ride */}
        {ride.status === "requested" && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <X className="h-5 w-5" />
                Cancel Ride
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                You can cancel this ride before it's accepted by a driver.
              </p>
              <Button
                variant="destructive"
                onClick={() => setShowCancelDialog(true)}
              >
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
