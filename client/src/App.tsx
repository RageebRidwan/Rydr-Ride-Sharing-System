import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { RequireAuth } from "@/features/auth/RequireAuth";
import { ROUTES } from "@/lib/constants";

// Lazy load pages for better performance
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

// Public pages
const HomePage = lazy(() => import("@/pages/public/HomePage"));
const AboutPage = lazy(() => import("@/pages/public/AboutPage"));
const FeaturesPage = lazy(() => import("@/pages/public/FeaturesPage"));
const ContactPage = lazy(() => import("@/pages/public/ContactPage"));
const FAQPage = lazy(() => import("@/pages/public/FAQPage"));
const LoginPage = lazy(() => import("@/pages/public/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/public/RegisterPage"));

// Rider pages
const RiderDashboard = lazy(() => import("@/pages/rider/RiderDashboard"));
const RequestRide = lazy(() => import("@/pages/rider/RequestRide"));
const RideHistory = lazy(() => import("@/pages/rider/RideHistory"));
const RideDetails = lazy(() => import("@/pages/rider/RideDetails"));
const RiderProfile = lazy(() => import("@/pages/rider/RiderProfile"));
const RiderActiveRide = lazy(() => import("@/pages/rider/ActiveRide"));

// Driver pages
const DriverDashboard = lazy(() => import("@/pages/driver/DriverDashboard"));
const IncomingRequests = lazy(() => import("@/pages/driver/IncomingRequests"));
const DriverHistory = lazy(() => import("@/pages/driver/DriverHistory"));
const Earnings = lazy(() => import("@/pages/driver/Earnings"));
const DriverProfile = lazy(() => import("@/pages/driver/DriverProfile"));
const DriverActiveRide = lazy(() => import("@/pages/driver/ActiveRide"));

// Admin pages
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const UserManagement = lazy(() => import("@/pages/admin/UserManagement"));
const DriverApproval = lazy(() => import("@/pages/admin/DriverApproval"));
const RideManagement = lazy(() => import("@/pages/admin/RideManagement"));
const Analytics = lazy(() => import("@/pages/admin/Analytics"));
const AdminProfile = lazy(() => import("@/pages/admin/AdminProfile"));

// Error pages
const NotFound = lazy(() => import("@/pages/error/NotFound"));
const Unauthorized = lazy(() => import("@/pages/error/Unauthorized"));
const AccountStatus = lazy(() => import("@/pages/error/AccountStatus"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes */}
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          <Route path={ROUTES.FEATURES} element={<FeaturesPage />} />
          <Route path={ROUTES.CONTACT} element={<ContactPage />} />
          <Route path={ROUTES.FAQ} element={<FAQPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

          {/* Rider routes */}
          <Route
            path={ROUTES.RIDER_DASHBOARD}
            element={
              <RequireAuth allowedRoles={["rider"]}>
                <RiderDashboard />
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.REQUEST_RIDE}
            element={
              <RequireAuth allowedRoles={["rider"]}>
                <RequestRide />
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.RIDE_HISTORY}
            element={
              <RequireAuth allowedRoles={["rider"]}>
                <RideHistory />
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.RIDE_DETAILS}
            element={
              <RequireAuth allowedRoles={["rider"]}>
                <RideDetails />
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.ACTIVE_RIDE}
            element={
              <RequireAuth allowedRoles={["rider"]}>
                <RiderActiveRide />
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.RIDER_PROFILE}
            element={
              <RequireAuth allowedRoles={["rider"]}>
                <RiderProfile />
              </RequireAuth>
            }
          />

          {/* Driver routes */}
          <Route
            path={ROUTES.DRIVER_DASHBOARD}
            element={
              <RequireAuth allowedRoles={["driver"]}>
                <DriverDashboard />
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.INCOMING_REQUESTS}
            element={
              <RequireAuth allowedRoles={["driver"]}>
                <IncomingRequests />
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.DRIVER_HISTORY}
            element={
              <RequireAuth allowedRoles={["driver"]}>
                <DriverHistory />
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.DRIVER_ACTIVE_RIDE}
            element={
              <RequireAuth allowedRoles={["driver"]}>
                <DriverActiveRide />
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.EARNINGS}
            element={
              <RequireAuth allowedRoles={["driver"]}>
                <Earnings />
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.DRIVER_PROFILE}
            element={
              <RequireAuth allowedRoles={["driver"]}>
                <DriverProfile />
              </RequireAuth>
            }
          />

          {/* Admin routes */}
          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={
              <RequireAuth allowedRoles={["admin"]}>
                <AdminDashboard />
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.USER_MANAGEMENT}
            element={
              <RequireAuth allowedRoles={["admin"]}>
                <UserManagement />
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.DRIVER_APPROVAL}
            element={
              <RequireAuth allowedRoles={["admin"]}>
                <DriverApproval />
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.RIDE_MANAGEMENT}
            element={
              <RequireAuth allowedRoles={["admin"]}>
                <RideManagement />
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.ANALYTICS}
            element={
              <RequireAuth allowedRoles={["admin"]}>
                <Analytics />
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.ADMIN_PROFILE}
            element={
              <RequireAuth allowedRoles={["admin"]}>
                <AdminProfile />
              </RequireAuth>
            }
          />

          {/* Error routes */}
          <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
          <Route path={ROUTES.ACCOUNT_STATUS} element={<AccountStatus />} />
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Routes>
      </Suspense>

      {/* Toast notifications */}
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}

export default App;
