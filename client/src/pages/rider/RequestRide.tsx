import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRequestRideMutation } from "@/features/rides/ridesApi";
import { ROUTES } from "@/lib/constants";
import { toast } from "sonner";
import { Loader2, MapPin, Loader } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getCoordinatesFromAddress } from "@/lib/geocode";
import { useState } from "react";

const rideSchema = z.object({
  pickupAddress: z.string().min(1, "Pickup address is required"),
  destAddress: z.string().min(1, "Destination address is required"),
});

type RideForm = z.infer<typeof rideSchema>;

export default function RequestRide() {
  const navigate = useNavigate();
  const [requestRide, { isLoading }] = useRequestRideMutation();
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [pickupCoords, setPickupCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [destCoords, setDestCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RideForm>({
    resolver: zodResolver(rideSchema),
  });

  const pickupAddress = watch("pickupAddress");
  const destAddress = watch("destAddress");

  const handleGeocodeAndEstimate = async () => {
    const pickup = watch("pickupAddress");
    const dest = watch("destAddress");

    if (!pickup || !dest) {
      toast.error("Please enter both pickup and destination addresses");
      return;
    }

    setIsGeocoding(true);
    try {
      // Geocode both addresses
      const [pickupLocation, destLocation] = await Promise.all([
        getCoordinatesFromAddress(pickup),
        getCoordinatesFromAddress(dest),
      ]);

      setPickupCoords(pickupLocation);
      setDestCoords(destLocation);

      // Calculate estimated fare using Haversine formula
      const R = 6371; // Earth's radius in km
      const dLat = ((destLocation.lat - pickupLocation.lat) * Math.PI) / 180;
      const dLng = ((destLocation.lng - pickupLocation.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((pickupLocation.lat * Math.PI) / 180) *
          Math.cos((destLocation.lat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      const baseFare = 50;
      const perKm = 20;
      const fare = baseFare + distance * perKm;
      setEstimatedFare(Math.round(fare * 100) / 100);

      toast.success("Locations found! Fare estimated.");
    } catch (error: any) {
      toast.error(error.message || "Failed to find locations");
      setEstimatedFare(null);
    } finally {
      setIsGeocoding(false);
    }
  };

  const onSubmit = async (data: RideForm) => {
    // Validate we have coordinates
    if (!pickupCoords || !destCoords) {
      toast.error("Please calculate fare first to verify locations");
      return;
    }

    try {
      await requestRide({
        pickup: {
          address: data.pickupAddress,
          lat: pickupCoords.lat,
          lng: pickupCoords.lng,
        },
        destination: {
          address: data.destAddress,
          lat: destCoords.lat,
          lng: destCoords.lng,
        },
      }).unwrap();

      toast.success("Ride requested successfully! Finding a driver...");
      navigate(ROUTES.ACTIVE_RIDE);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to request ride");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Request a Ride</h1>
          <p className="text-muted-foreground">
            Enter your pickup and destination details
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ride Details</CardTitle>
            <CardDescription>Fill in your journey information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Pickup Location */}
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="pickupAddress"
                    className="flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    Pickup Address
                  </Label>
                  <Input
                    id="pickupAddress"
                    placeholder="e.g., Mirpur 10, Dhaka"
                    {...register("pickupAddress")}
                  />
                  {errors.pickupAddress && (
                    <p className="text-sm text-destructive">
                      {errors.pickupAddress.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter your pickup location (e.g., "Mirpur, Dhaka" or "Uttara
                    Sector 7")
                  </p>
                </div>
              </div>

              {/* Destination */}
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="destAddress"
                    className="flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    Destination Address
                  </Label>
                  <Input
                    id="destAddress"
                    placeholder="e.g., Gulshan 2, Dhaka"
                    {...register("destAddress")}
                  />
                  {errors.destAddress && (
                    <p className="text-sm text-destructive">
                      {errors.destAddress.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter your destination (e.g., "Gulshan 2, Dhaka" or
                    "Dhanmondi 27")
                  </p>
                </div>
              </div>

              {/* Calculate Fare Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGeocodeAndEstimate}
                disabled={isGeocoding || !pickupAddress || !destAddress}
              >
                {isGeocoding ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Finding locations & calculating fare...
                  </>
                ) : (
                  "Calculate Fare"
                )}
              </Button>

              {/* Estimated Fare */}
              {estimatedFare && pickupCoords && destCoords && (
                <Card className="bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Estimated Fare:
                        </span>
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(estimatedFare)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>✓ Pickup location verified</p>
                        <p>✓ Destination location verified</p>
                        <p className="text-green-600 font-medium">
                          Ready to request ride!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading || !estimatedFare}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Request Ride
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(ROUTES.RIDER_DASHBOARD)}
                >
                  Cancel
                </Button>
              </div>

              {!estimatedFare && (
                <p className="text-sm text-muted-foreground text-center">
                  Click "Calculate Fare" to verify locations and see estimated
                  price
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
