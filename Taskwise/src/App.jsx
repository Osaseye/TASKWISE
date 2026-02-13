import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { UIProvider } from './context/UIContext';
import AIAssistantSidebar from './components/dashboard/AIAssistantSidebar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import OnboardingStep1 from './pages/onboarding/OnboardingStep1';
import OnboardingStep2 from './pages/onboarding/OnboardingStep2';
import OnboardingStep3 from './pages/onboarding/OnboardingStep3';
import OnboardingStep4 from './pages/onboarding/OnboardingStep4';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import MyTasksPage from './pages/MyTasksPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotificationsPage from './pages/NotificationsPage';
import ChangePasswordPage from './pages/settings/ChangePasswordPage';
import ActiveSessionsPage from './pages/settings/ActiveSessionsPage';
import ContactSupportPage from './pages/settings/ContactSupportPage';
import FAQPage from './pages/settings/FAQPage';
import EditProfilePage from './pages/settings/EditProfilePage';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected Routes */}
        <Route path="/onboarding/step1" element={<ProtectedRoute><OnboardingStep1 /></ProtectedRoute>} />
        <Route path="/onboarding/step2" element={<ProtectedRoute><OnboardingStep2 /></ProtectedRoute>} />
        <Route path="/onboarding/step3" element={<ProtectedRoute><OnboardingStep3 /></ProtectedRoute>} />
        <Route path="/onboarding/step4" element={<ProtectedRoute><OnboardingStep4 /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><MyTasksPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/settings/password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
        <Route path="/settings/sessions" element={<ProtectedRoute><ActiveSessionsPage /></ProtectedRoute>} />
        <Route path="/settings/support" element={<ProtectedRoute><ContactSupportPage /></ProtectedRoute>} />
        <Route path="/settings/faq" element={<ProtectedRoute><FAQPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <UIProvider>
      <Router>
        <AIAssistantSidebar />
        <AnimatedRoutes />
      </Router>
    </UIProvider>
  );
}

export default App;
