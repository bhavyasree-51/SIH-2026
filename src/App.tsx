import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { CommunityPage } from './pages/CommunityPage'
import { WeatherPage } from './pages/WeatherPage'
import { CropDoctorPage } from './pages/CropDoctorPage'
import { FinancePage } from './pages/FinancePage'
import { FarmerProfilePage } from './pages/FarmerProfilePage'
import { CopilotPage } from './pages/CopilotPage'
import { AlertsPage } from './pages/AlertsPage'
import { HomePage } from './pages/HomePage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { AdminCommunityPage } from './pages/AdminCommunityPage'
import { AdminCommunityCommentsPage } from './pages/AdminCommunityCommentsPage'
import { AdminCommunityReportsPage } from './pages/AdminCommunityReportsPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './hooks/useAuth'
import { FarmersPage } from './pages/AdminFarmersPage'
import { CropInfoPage } from './pages/CropInfoPage'
import { RecommendationPage } from './pages/RecommendationPage'
import { DiseaseDetectionPage } from './pages/DiseaseDetectionPage'
import { FarmPage } from './pages/FarmPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { VolunteerRegisterPage } from './pages/VolunteerRegisterPage'

function FarmerOnly() {
  return <ProtectedRoute requiredRole="FARMER" />
}

function AdminOnly() {
  return <ProtectedRoute requiredRole="ADMIN" />
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="page-loading">Loading Smart Krishi...</div>
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user && user.role === 'ADMIN' ? <Navigate to="/admin/dashboard" replace /> : user ? <Navigate to="/farmer/dashboard" replace /> : <LoginPage role="FARMER" />} />
      <Route path="/login/farmer" element={<LoginPage role="FARMER" />} />
      <Route path="/login/admin" element={<LoginPage role="ADMIN" />} />
      <Route path="/login/volunteer" element={<LoginPage role="ADMIN" />} />
      <Route path="/volunteer-login" element={<LoginPage role="ADMIN" />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/farmer/register" element={<RegisterPage />} />
      <Route path="/volunteer/register" element={<VolunteerRegisterPage />} />
      <Route path="/admin/register" element={<VolunteerRegisterPage />} />
      <Route path="/volunteer-register" element={<VolunteerRegisterPage />} />
      <Route path="/admin-login" element={<LoginPage role="ADMIN" />} />

      <Route element={<FarmerOnly />}>
        <Route element={<AppLayout />}>
          <Route path="/farmer" element={<Navigate to="/farmer/dashboard" replace />} />
          <Route path="/farmer/dashboard" element={<HomePage />} />
          <Route path="/farmer/weather" element={<WeatherPage />} />
          <Route path="/farmer/recommendation" element={<RecommendationPage />} />
          <Route path="/farmer/disease" element={<DiseaseDetectionPage />} />
          <Route path="/farmer/crops" element={<CropInfoPage />} />
          <Route path="/farmer/profit" element={<FinancePage />} />
          <Route path="/farmer/farm" element={<FarmPage />} />
          <Route path="/farmer/community" element={<CommunityPage />} />
          <Route path="/farmer/notifications" element={<NotificationsPage />} />
          <Route path="/farmer/voice" element={<CopilotPage />} />
          <Route path="/farmer/profile" element={<FarmerProfilePage />} />
        </Route>
      </Route>

      <Route element={<AdminOnly />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/farmers" element={<FarmersPage />} />
          <Route path="/admin/farms" element={<FarmPage />} />
          <Route path="/admin/disease-reports" element={<DiseaseDetectionPage />} />
          <Route path="/admin/alerts" element={<AlertsPage />} />
          <Route path="/admin/analytics" element={<AdminDashboardPage />} />
          <Route path="/admin/content" element={<CropInfoPage />} />
          <Route path="/admin/community" element={<AdminCommunityPage />} />
          <Route path="/admin/community/comments" element={<AdminCommunityCommentsPage />} />
          <Route path="/admin/community/reports" element={<AdminCommunityReportsPage />} />
          <Route path="/admin/crops" element={<CropInfoPage />} />
          <Route path="/admin/notifications" element={<NotificationsPage />} />
          <Route path="/admin/reports" element={<AdminCommunityReportsPage />} />
          <Route path="/admin/settings" element={<FarmerProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
