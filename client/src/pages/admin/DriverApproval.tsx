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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAllUsersQuery,
  useApproveDriverMutation,
} from "@/features/admin/adminApi";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { getApprovalStatusColor } from "@/lib/utils";
import {
  UserCheck,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

export default function DriverApproval() {
  const [page, setPage] = useState(1);
  const [approvalStatus, setApprovalStatus] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [actionType, setActionType] = useState<"approved" | "rejected">(
    "approved"
  );

  const { data, isLoading, refetch } = useGetAllUsersQuery({
    page,
    limit: 10,
    role: "driver",
    approvalStatus,
  });

  const [approveDriver, { isLoading: isApproving }] =
    useApproveDriverMutation();

  const drivers = data?.data || [];
  const pagination = data?.pagination;

  const handleApproval = async () => {
    if (!selectedDriver) return;
    try {
      await approveDriver({
        id: selectedDriver._id,
        approvalStatus: actionType,
      }).unwrap();
      toast.success(`Driver ${actionType} successfully`);
      setSelectedDriver(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update driver status");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Driver Approval</h1>
          <p className="text-muted-foreground">
            Review and approve driver applications
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Select value={approvalStatus} onValueChange={setApprovalStatus}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setApprovalStatus("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Drivers List */}
        <Card>
          <CardHeader>
            <CardTitle>Drivers ({pagination?.total || 0})</CardTitle>
            <CardDescription>
              {approvalStatus === "pending" && "Drivers waiting for approval"}
              {approvalStatus === "approved" && "Approved drivers"}
              {approvalStatus === "rejected" && "Rejected drivers"}
              {approvalStatus === "all" && "All drivers"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : drivers.length === 0 ? (
              <EmptyState
                icon={UserCheck}
                title="No drivers found"
                description={`No ${approvalStatus} drivers at the moment`}
              />
            ) : (
              <>
                <div className="space-y-4">
                  {drivers.map((driver: any) => (
                    <Card key={driver._id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-3 flex-1">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {driver.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {driver.email}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">
                                  Phone:
                                </span>
                                <p className="font-medium">
                                  {driver.phoneNumber || "N/A"}
                                </p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Location:
                                </span>
                                <p className="font-medium">
                                  {driver.currentLocation || "N/A"}
                                </p>
                              </div>
                              <div className="col-span-2">
                                <span className="text-muted-foreground">
                                  Vehicle:
                                </span>
                                <p className="font-medium">
                                  {driver.vehicleInfo || "N/A"}
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Badge variant="outline" className="capitalize">
                                {driver.role}
                              </Badge>
                              <Badge
                                className={getApprovalStatusColor(
                                  driver.approvalStatus
                                )}
                              >
                                {driver.approvalStatus}
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {driver.status}
                              </Badge>
                            </div>

                            <p className="text-xs text-muted-foreground">
                              Registered on{" "}
                              {new Date(driver.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2 ml-4">
                            {driver.approvalStatus === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedDriver(driver);
                                    setActionType("approved");
                                  }}
                                  disabled={isApproving}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    setSelectedDriver(driver);
                                    setActionType("rejected");
                                  }}
                                  disabled={isApproving}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {driver.approvalStatus === "approved" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedDriver(driver);
                                  setActionType("rejected");
                                }}
                                disabled={isApproving}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Revoke
                              </Button>
                            )}
                            {driver.approvalStatus === "rejected" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedDriver(driver);
                                  setActionType("approved");
                                }}
                                disabled={isApproving}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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

      <ConfirmDialog
        open={!!selectedDriver}
        onOpenChange={(open) => !open && setSelectedDriver(null)}
        title={`${actionType === "approved" ? "Approve" : "Reject"} Driver?`}
        description={`Are you sure you want to ${
          actionType === "approved" ? "approve" : "reject"
        } ${selectedDriver?.name}? ${
          actionType === "approved"
            ? "They will be able to accept rides."
            : "They will not be able to accept rides."
        }`}
        onConfirm={handleApproval}
        confirmText={
          actionType === "approved" ? "Approve Driver" : "Reject Driver"
        }
        variant={actionType === "approved" ? "default" : "destructive"}
      />
    </DashboardLayout>
  );
}
