import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/ui/AuthLayout';
import LoginForm from '../components/forms/LoginForm';
import { useAuth } from '../../contexts/AuthContext';
import leftImg from '../../assets/images/image.jpeg';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.25 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const from = location.state?.from?.pathname;
  const wasRedirected = from && from !== '/login';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      role="main"
      aria-labelledby="login-page-title"
    >
      {wasRedirected && (
        <motion.div className="mb-4 max-w-md mx-auto" variants={itemVariants}>
          <div className="bg-[#ADD0B3] text-white p-4 rounded-lg text-center">
            <p className="text-sm font-medium">
              🔒 You must login to access {from === '/' ? 'the dashboard' : 'this page'}
            </p>
          </div>
        </motion.div>
      )}
      <AuthLayout
        leftTitle="Welcome Back!"
        leftDescription="Please login to your ClathraEnergies Admin Dashboard."
        backgroundImage={leftImg}
        rightContent={
          <>
            <LoginForm />
            {token && (
              <motion.div variants={itemVariants} className="text-center mt-4">
                <button
                  onClick={handleLogout}
                  className="text-sm text-[#ADD0B3] font-medium hover:text-[#388E3C] transition-colors"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </>
        }
      />
    </motion.div>
  );
};

export default LoginPage;