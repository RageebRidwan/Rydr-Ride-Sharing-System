import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useGetUserStatsQuery,
  useGetRideStatsQuery,
  useGetDriverRatingsQuery,
} from "@/features/admin/adminApi";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { formatCurrency } from "@/lib/utils";
import {
  Users,
  Car,
  DollarSign,
  TrendingUp,
  Star,
  UserCheck,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export default function Analytics() {
  const { data: userStats, isLoading: userLoading } = useGetUserStatsQuery();
  const { data: rideStats, isLoading: rideLoading } = useGetRideStatsQuery();
  const { data: driverRatings, isLoading: ratingsLoading } =
    useGetDriverRatingsQuery();

  const users = userStats?.data;
  const rides = rideStats?.data;
  const ratings = driverRatings?.data;

  if (userLoading || rideLoading || ratingsLoading) {
    return <LoadingSpinner fullScreen />;
  }

  // Prepare data for charts
  const userDistributionData = [
    { name: "Riders", value: users?.totalRiders || 0 },
    { name: "Drivers", value: users?.totalDrivers || 0 },
    { name: "Admins", value: users?.totalAdmins || 0 },
  ];

  const userStatusData = [
    { name: "Active", value: users?.activeUsers || 0 },
    { name: "Blocked", value: users?.blockedUsers || 0 },
    { name: "Suspended", value: users?.suspendedUsers || 0 },
  ];

  const rideStatusData = [
    { name: "Completed", count: rides?.completedRides || 0 },
    { name: "Cancelled", count: rides?.cancelledRides || 0 },
    { name: "In Progress", count: rides?.inProgressRides || 0 },
    { name: "Requested", count: rides?.requestedRides || 0 },
  ];

  const driverApprovalData = [
    { name: "Approved", value: users?.approvedDrivers || 0 },
    { name: "Pending", value: users?.pendingDrivers || 0 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Platform insights and statistics
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                {users?.activeUsers || 0} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rides?.totalRides || 0}</div>
              <p className="text-xs text-muted-foreground">
                {rides?.completedRides || 0} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(rides?.totalRevenue || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                From {rides?.completedRides || 0} rides
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Driver Rating
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {ratings?.avgRating?.toFixed(1) || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {ratings?.totalDrivers || 0} drivers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* User Distribution */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Distribution by Role</CardTitle>
              <CardDescription>
                Breakdown of users by their role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent! * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userDistributionData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Status Distribution</CardTitle>
              <CardDescription>
                Active, blocked, and suspended users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent! * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userStatusData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Ride Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Ride Status Overview</CardTitle>
            <CardDescription>Distribution of rides by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rideStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Number of Rides" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Driver Approval Status */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Driver Approval Status</CardTitle>
              <CardDescription>Approved vs pending drivers</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={driverApprovalData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {driverApprovalData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
              <CardDescription>Important platform statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Pending Driver Approvals
                  </span>
                </div>
                <span className="text-2xl font-bold">
                  {users?.pendingDrivers || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Active Rides</span>
                </div>
                <span className="text-2xl font-bold">
                  {rides?.inProgressRides || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Completion Rate</span>
                </div>
                <span className="text-2xl font-bold">
                  {rides?.totalRides
                    ? ((rides.completedRides / rides.totalRides) * 100).toFixed(
                        1
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Avg Fare per Ride</span>
                </div>
                <span className="text-2xl font-bold">
                  {rides?.completedRides
                    ? formatCurrency(
                        (rides.totalRevenue || 0) / rides.completedRides
                      )
                    : "৳0.00"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Drivers */}
        {ratings?.topDrivers && ratings.topDrivers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Top Rated Drivers</CardTitle>
              <CardDescription>
                Highest rated drivers on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ratings.topDrivers
                  .slice(0, 10)
                  .map((driver: any, index: number) => (
                    <div
                      key={driver._id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{driver.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {driver.vehicleInfo}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold">
                            {driver.averageRating.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {driver.ratings.length} ratings
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
