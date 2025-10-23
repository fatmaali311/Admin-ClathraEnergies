import { Routes, Route } from 'react-router-dom';

// Contexts
import { useAuth } from './contexts/AuthContext';
// Protected Route
import ProtectedRoute from './routes/ProtectedRoute';

// Authentication Pages
import Login from './Auth/pages/LoginPage';
import ForgotPassword from './Auth/pages/ForgotPasswordPage';
import ResetPassword from './Auth/pages/ResetPasswordPage';
import SetupAccount from './Auth/pages/SetupAccountPage';
import VerifyEmailChangePage from './Auth/pages/VerifyEmailChangePage';

// Main Application Pages
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/content/UserManagement';
import Profile from './pages/Profile';
import ConfigurationSettings from './pages/ConfigurationSettings';
import PageEditor from './pages/PageEditor';

// Auxiliary Pages 
import PositionManagementPage from './pages/PositionManagementPage';
import ContactUsPage from './pages/ContactUsPage';
import ServicesDashboard from './pages/ServicesDashboard';


function App() {
    // Initializes authentication state and listeners
    useAuth();

    return (
        <Routes>
            {/* PUBLIC/UNPROTECTED ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Token-based routes must use the path parameter :token */}
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/setup" element={<SetupAccount />} />
           <Route path="/verify-email" element={<VerifyEmailChangePage />} />


            {/* PROTECTED ROUTES - Wrapped with ProtectedRoute */}

            {/* Root/Default Dashboard */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            {/* Direct access to Page Editor is also protected */}
            <Route path="/page-editor" element={<ProtectedRoute><PageEditor /></ProtectedRoute>} />

            {/* Dashboard Navigation Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/content/:pageTitle" element={<ProtectedRoute><PageEditor /></ProtectedRoute>} />
            <Route path="/dashboard/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
            <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/dashboard/configuration" element={<ProtectedRoute><ConfigurationSettings /></ProtectedRoute>} />
            <Route path="/dashboard/services-test" element={<ProtectedRoute><ServicesDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/contact-us" element={<ProtectedRoute><ContactUsPage /></ProtectedRoute>} />
            <Route path="/dashboard/position" element={<ProtectedRoute><PositionManagementPage /></ProtectedRoute>} />

            {/* FALLBACK 404 */}
            <Route path="*" element={<h1 className="text-center mt-20">404 Not Found</h1>} />
        </Routes>
    );
}

export default App;
