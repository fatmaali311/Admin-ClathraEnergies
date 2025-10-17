import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './Auth/pages/LoginPage';
import ForgotPassword from './Auth/pages/ForgotPasswordPage';
import ResetPassword from './Auth/pages/ResetPasswordPage';
import SetupAccount from './Auth/pages/SetupAccountPage';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/content/UserManagement';
import Profile from './pages/Profile';
import ConfigurationSettings from './pages/ConfigurationSettings';
import PageEditor from './pages/PageEditor';
import PositionManagementPage from './pages/PositionManagementPage';


import ContactUsPage from './pages/ContactUsPage';
import ServicesDashboard from './pages/ServicesDashboard';

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/page-editor" element={<PageEditor />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/setup/:token" element={<SetupAccount />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/content/:pageTitle" element={<PageEditor />} />
            <Route path="/dashboard/users" element={<UserManagement />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/configuration" element={<ConfigurationSettings />} />
         <Route path="/dashboard/services-test" element={< ServicesDashboard/>}/>
            <Route path="/dashboard/contact-us" element={<ContactUsPage />} />
             <Route path="/dashboard/position" element={<PositionManagementPage />} />
            
            <Route path="*" element={<h1 className="text-center mt-20">404 Not Found</h1>} />
        </Routes>
    );
}

export default App;