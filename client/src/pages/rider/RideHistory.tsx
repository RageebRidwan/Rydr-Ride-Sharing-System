import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetRideHistoryQuery } from "@/features/rides/ridesApi";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import {
  formatCurrency,
  formatDate,
  getRideStatusColor,
  formatRideStatus,
} from "@/lib/utils";
import {
  History,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function RideHistory() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [fareMin, setFareMin] = useState("");
  const [fareMax, setFareMax] = useState("");

  const { data, isLoading, error } = useGetRideHistoryQuery({
    page,
    limit: 10,
    ...(status && { status }),
    ...(fareMin && { fareMin: parseFloat(fareMin) }),
    ...(fareMax && { fareMax: parseFloat(fareMax) }),
  });

  const rides = data?.data || [];
  const pagination = data?.pagination;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Ride History</h1>
          <p className="text-muted-foreground">
            View and manage your past rides
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="requested">Requested</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Min Fare
                </label>
                <Input
                  type="number"
                  placeholder="Min fare"
                  value={fareMin}
                  onChange={(e) => setFareMin(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Max Fare
                </label>
                <Input
                  type="number"
                  placeholder="Max fare"
                  value={fareMax}
                  onChange={(e) => setFareMax(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setStatus("");
                  setFareMin("");
                  setFareMax("");
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
                description="You haven't taken any rides yet or no rides match your filters"
                action={{
                  label: "Request a Ride",
                  onClick: () => (window.location.href = "/rider/request-ride"),
                }}
              />
            ) : (
              <>
                <div className="space-y-4">
                  {rides.map((ride) => (
                    <div
                      key={ride._id}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getRideStatusColor(ride.status)}>
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
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary mb-2">
                            {formatCurrency(ride.fare)}
                          </p>
                          <Link to={`/rider/rides/${ride._id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
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
