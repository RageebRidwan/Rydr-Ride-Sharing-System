export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  FEATURES: "/features",
  CONTACT: "/contact",
  FAQ: "/faq",
  LOGIN: "/login",
  REGISTER: "/register",

  // Rider routes
  RIDER_DASHBOARD: "/rider/dashboard",
  REQUEST_RIDE: "/rider/request-ride",
  RIDE_HISTORY: "/rider/history",
  RIDE_DETAILS: "/rider/rides/:id",
  ACTIVE_RIDE: "/rider/active-ride",
  RIDER_PROFILE: "/rider/profile",

  // Driver routes
  DRIVER_DASHBOARD: "/driver/dashboard",
  INCOMING_REQUESTS: "/driver/requests",
  DRIVER_ACTIVE_RIDE: "/driver/active-ride",
  DRIVER_HISTORY: "/driver/history",
  EARNINGS: "/driver/earnings",
  DRIVER_PROFILE: "/driver/profile",

  // Admin routes
  ADMIN_DASHBOARD: "/admin/dashboard",
  USER_MANAGEMENT: "/admin/users",
  DRIVER_APPROVAL: "/admin/drivers",
  RIDE_MANAGEMENT: "/admin/rides",
  ANALYTICS: "/admin/analytics",
  ADMIN_PROFILE: "/admin/profile",

  // Error routes
  UNAUTHORIZED: "/unauthorized",
  ACCOUNT_STATUS: "/account-status",
  NOT_FOUND: "*",
} as const;

export const RIDE_STATUSES = [
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "picked_up", label: "Picked Up" },
  { value: "in_transit", label: "In Transit" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export const USER_ROLES = [
  { value: "rider", label: "Rider" },
  { value: "driver", label: "Driver" },
] as const;

export const PAGINATION_LIMITS = [5, 10, 20, 50] as const;

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
} as const;
