import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
} from "@/features/admin/adminApi";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { getUserStatusColor } from "@/lib/utils";
import { Search, Ban, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function UserManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [actionType, setActionType] = useState<
    "block" | "suspend" | "activate"
  >("block");

  const { data, isLoading, refetch } = useGetAllUsersQuery({
    page,
    limit: 10,
    search,
    role,
    status,
  });
  const [updateStatus] = useUpdateUserStatusMutation();

  const users = data?.data || [];

  const handleStatusUpdate = async () => {
    if (!selectedUser) return;
    try {
      await updateStatus({
        id: selectedUser._id,
        status:
          actionType === "activate"
            ? "active"
            : actionType === "block"
            ? "blocked"
            : "suspended",
      }).unwrap();
      toast.success(`User ${actionType}ed successfully`);
      setSelectedUser(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update user status");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage all platform users</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="all">All roles</SelectItem> */}
                  <SelectItem value="rider">Riders</SelectItem>
                  <SelectItem value="driver">Drivers</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="all">All statuses</SelectItem> */}
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatus("");
                    setRole("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users ({data?.pagination?.total || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="space-y-4">
                {users.map((user: any) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="capitalize">
                          {user.role}
                        </Badge>
                        <Badge className={getUserStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {user.status === "active" && (
                        <>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedUser(user);
                              setActionType("block");
                            }}
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Block
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setActionType("suspend");
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Suspend
                          </Button>
                        </>
                      )}
                      {(user.status === "blocked" ||
                        user.status === "suspended") && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setActionType("activate");
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Activate
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={!!selectedUser}
        onOpenChange={(open) => !open && setSelectedUser(null)}
        title={`${
          actionType.charAt(0).toUpperCase() + actionType.slice(1)
        } User?`}
        description={`Are you sure you want to ${actionType} ${selectedUser?.name}?`}
        onConfirm={handleStatusUpdate}
        variant={actionType === "activate" ? "default" : "destructive"}
      />
    </DashboardLayout>
  );
}
