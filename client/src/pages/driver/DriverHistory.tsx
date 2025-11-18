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
import { useGetDriverHistoryQuery } from "@/features/driver/driverApi";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { EmptyState } from "@/components/common/EmptyState";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  formatCurrency,
  formatDate,
  getRideStatusColor,
  formatRideStatus,
} from "@/lib/utils";
import { History, ChevronLeft, ChevronRight } from "lucide-react";

export default function DriverHistory() {
  const [page, setPage] = useState(1);
  // const [status, setStatus] = useState("");

  const { data, isLoading,refetch, error } = useGetDriverHistoryQuery({
    page,
    limit: 10,
  });

  const rides = data?.data || [];
  const pagination = data?.pagination;
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 2000);
    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Ride History</h1>
          <p className="text-muted-foreground">View your completed rides</p>
        </div>

        {/* Filters */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" onClick={() => setStatus("")}>
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Rides List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Rides</CardTitle>
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
            ) : error ? (
              <ErrorMessage message="Failed to load ride history" />
            ) : rides.length === 0 ? (
              <EmptyState
                icon={History}
                title="No rides found"
                description="You haven't completed any rides yet"
              />
            ) : (
              <>
                <div className="space-y-4">
                  {rides.map((ride) => {
                    const rider =
                      typeof ride.riderId === "object" ? ride.riderId : null;
                    return (
                      <div
                        key={ride._id}
                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                className={getRideStatusColor(ride.status)}
                              >
                                {formatRideStatus(ride.status)}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(ride.createdAt)}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">From:</span>
                                <span className="text-muted-foreground">
                                  {ride.pickup.address}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">To:</span>
                                <span className="text-muted-foreground">
                                  {ride.destination.address}
                                </span>
                              </div>
                              {rider && (
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="font-medium">Rider:</span>
                                  <span className="text-muted-foreground">
                                    {rider.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary mb-2">
                              {formatCurrency(ride.fare)}
                            </p>
                            {ride.driverRating && (
                              <p className="text-sm text-muted-foreground">
                                Rating: ⭐ {ride.driverRating.toFixed(1)}
                              </p>
                            )}
                            {ride.riderFeedback && (
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-sm font-medium mb-1">
                                  Rider Feedback:
                                </p>
                                <p className="text-sm text-muted-foreground italic">
                                  "{ride.riderFeedback}"
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
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
