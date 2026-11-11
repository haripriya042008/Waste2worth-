import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import HowItWorks from './pages/public/HowItWorks';
import Features from './pages/public/Features';
import Contact from './pages/public/Contact';
import NotFound from './pages/public/NotFound';

// Auth Pages
import Login from './pages/auth/Login';
import RegisterDonor from './pages/auth/RegisterDonor';
import RegisterCharity from './pages/auth/RegisterCharity';

// Shared Pages
import DonationDetails from './pages/donor/DonationDetails';
import NotificationsPage from './pages/common/NotificationsPage';

// Donor Pages
import DonorDashboard from './pages/donor/DonorDashboard';
import CreateDonation from './pages/donor/CreateDonation';
import MyDonations from './pages/donor/MyDonations';
import DonorHistory from './pages/donor/DonorHistory';
import NearbyCharities from './pages/donor/NearbyCharities';
import DonorCalculatorPage from './pages/donor/DonorCalculatorPage';
import DonorProfile from './pages/donor/DonorProfile';

// Charity Pages
import CharityDashboard from './pages/charity/CharityDashboard';
import AvailableDonations from './pages/charity/AvailableDonations';
import AcceptedDonations from './pages/charity/AcceptedDonations';
import CollectionManagement from './pages/charity/CollectionManagement';
import CharityHistory from './pages/charity/CharityHistory';
import GPSRecommendations from './pages/charity/GPSRecommendations';
import CharityProfile from './pages/charity/CharityProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import CharityVerification from './pages/admin/CharityVerification';
import DonationManagement from './pages/admin/DonationManagement';
import PublicPlacesManagement from './pages/admin/PublicPlacesManagement';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import ActivityMonitoring from './pages/admin/ActivityMonitoring';

function App() {
  return (
    <Routes>
      {/* Public Pages with Standard Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-donor" element={<RegisterDonor />} />
        <Route path="/register-charity" element={<RegisterCharity />} />

        {/* Donation Details View */}
        <Route path="/donations/:id" element={<DonationDetails />} />
      </Route>

      {/* Protected Donor Dashboard Routes */}
      <Route element={<ProtectedRoute allowedRoles={['donor']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/donor" element={<DonorDashboard />} />
          <Route path="/donor/create-donation" element={<CreateDonation />} />
          <Route path="/donor/my-donations" element={<MyDonations />} />
          <Route path="/donor/history" element={<DonorHistory />} />
          <Route path="/donor/nearby-charities" element={<NearbyCharities />} />
          <Route path="/donor/calculator" element={<DonorCalculatorPage />} />
          <Route path="/donor/notifications" element={<NotificationsPage />} />
          <Route path="/donor/profile" element={<DonorProfile />} />
        </Route>
      </Route>

      {/* Protected Charity Dashboard Routes */}
      <Route element={<ProtectedRoute allowedRoles={['charity']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/charity" element={<CharityDashboard />} />
          <Route path="/charity/available-donations" element={<AvailableDonations />} />
          <Route path="/charity/accepted-donations" element={<AcceptedDonations />} />
          <Route path="/charity/collections" element={<CollectionManagement />} />
          <Route path="/charity/history" element={<CharityHistory />} />
          <Route path="/charity/recommendations" element={<GPSRecommendations />} />
          <Route path="/charity/notifications" element={<NotificationsPage />} />
          <Route path="/charity/profile" element={<CharityProfile />} />
        </Route>
      </Route>

      {/* Protected Admin Dashboard Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/charities" element={<CharityVerification />} />
          <Route path="/admin/donations" element={<DonationManagement />} />
          <Route path="/admin/public-places" element={<PublicPlacesManagement />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/activities" element={<ActivityMonitoring />} />
        </Route>
      </Route>

      {/* 404 Fallback Route */}
      <Route element={<MainLayout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
