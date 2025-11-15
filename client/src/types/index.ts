export type UserRole = "admin" | "rider" | "driver";
export type UserStatus = "active" | "blocked" | "suspended";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type RideStatus =
  | "requested"
  | "accepted"
  | "picked_up"
  | "in_transit"
  | "completed"
  | "cancelled";

export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  status: UserStatus;
  currentLocation?: string;
  vehicleInfo?: string;
  isOnline?: boolean;
  approvalStatus?: ApprovalStatus;
  ratings?: number[];
  averageRating?: number;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface Ride {
  _id: string;
  riderId: string | User;
  driverId?: string | User;
  pickup: Location;
  destination: Location;
  status: RideStatus;
  fare: number;
  driverRating?: number;
  riderFeedback?: string;
  cancellationReason?: string;
  timestamps: {
    requestedAt: string;
    acceptedAt?: string;
    pickedUpAt?: string;
    inTransitAt?: string;
    completedAt?: string;
    cancelledAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: UserRole;
  vehicleInfo?: string;
  currentLocation?: string;
}

export interface RideRequest {
  pickup: Location;
  destination: Location;
}

export interface Earnings {
  totalEarnings: number;
  dailyEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  totalRides: number;
  rides: Ride[];
}

export interface UserStats {
  totalUsers: number;
  totalAdmins: number;
  totalRiders: number;
  totalDrivers: number;
  activeUsers: number;
  blockedUsers: number;
  suspendedUsers: number;
  pendingDrivers: number;
  approvedDrivers: number;
}

export interface RideStats {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  inProgressRides: number;
  requestedRides: number;
  totalRevenue: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}
