import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/shared/protected-route";
import AdminLayout from "@/layouts/admin-layout";
import UserLayout from "@/layouts/user-layout";
import { Toaster } from "@/components/ui/sonner";

// Pages
import LoginPage from "./pages/auth/login-page";
import SignupPage from "./pages/auth/signup-page";
import DashboardPage from "./pages/user/dashboard-page";
import AdminDashboardPage from "./pages/admin/admin-dashboard-page";
import CampaignsPage from "./pages/user/campaigns-page";
import MyDonationsPage from "./pages/user/my-donations-page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* User Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserLayout>
                <DashboardPage />
              </UserLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/campaigns"
          element={
            <ProtectedRoute>
              <UserLayout>
                <CampaignsPage />
              </UserLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-donations"
          element={
            <ProtectedRoute>
              <UserLayout>
                <MyDonationsPage />
              </UserLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminDashboardPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/campaigns"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminDashboardPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/donations"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminDashboardPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/donors"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminDashboardPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirect Root to Login */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
