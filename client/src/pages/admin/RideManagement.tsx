import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useGetAllRidesQuery } from "@/features/admin/adminApi";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import {
  formatCurrency,
  formatDate,
  getRideStatusColor,
  formatRideStatus,
} from "@/lib/utils";
import { MapPin, Filter, ChevronLeft, ChevronRight, User } from "lucide-react";

export default function RideManagement() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data, isLoading } = useGetAllRidesQuery({
    page,
    limit: 10,
    ...(status && { status }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
  });

  const rides = data?.data || [];
  const pagination = data?.pagination;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Ride Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage all platform rides
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="requested">Requested</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="picked_up">Picked Up</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  From Date
                </label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  To Date
                </label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setStatus("");
                  setDateFrom("");
                  setDateTo("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rides List */}
        <Card>
          <CardHeader>
            <CardTitle>All Rides</CardTitle>
            <CardDescription>
              {pagination &&
                `Showing ${rides.length} of ${pagination.total} rides`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : rides.length === 0 ? (
              <EmptyState
                icon={MapPin}
                title="No rides found"
                description="No rides match your current filters"
              />
            ) : (
              <>
                <div className="space-y-4">
                  {rides.map((ride) => {
                    const rider =
                      typeof ride.riderId === "object" ? ride.riderId : null;
                    const driver =
                      typeof ride.driverId === "object" ? ride.driverId : null;

                    return (
                      <Card key={ride._id}>
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={getRideStatusColor(ride.status)}
                                >
                                  {formatRideStatus(ride.status)}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {formatDate(ride.createdAt)}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-primary">
                                  {formatCurrency(ride.fare)}
                                </p>
                              </div>
                            </div>

                            {/* Trip Details */}
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <div className="flex items-start gap-2 mb-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                  <div>
                                    <p className="text-sm font-medium">
                                      Pickup
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {ride.pickup.address}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                  <div>
                                    <p className="text-sm font-medium">
                                      Destination
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {ride.destination.address}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm font-medium">Rider</p>
                                    <p className="text-sm text-muted-foreground">
                                      {rider
                                        ? `${rider.name} (${rider.email})`
                                        : "N/A"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm font-medium">
                                      Driver
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {driver
                                        ? `${driver.name} (${driver.email})`
                                        : "Not assigned"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Additional Info */}
                            {ride.driverRating && (
                              <div className="pt-2 border-t">
                                <p className="text-sm">
                                  <span className="font-medium">
                                    Driver Rating:
                                  </span>{" "}
                                  <span className="text-muted-foreground">
                                    ⭐ {ride.driverRating.toFixed(1)}
                                  </span>
                                </p>
                              </div>
                            )}
                            {ride.riderFeedback && (
                              <div className="pt-2 border-t">
                                <p className="text-sm">
                                  <span className="font-medium">Feedback:</span>{" "}
                                  <span className="text-muted-foreground">
                                    {ride.riderFeedback}
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t">
                    <p className="text-sm text-muted-foreground">
                      Page {pagination.page} of {pagination.totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={pagination.page === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={pagination.page === pagination.totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
