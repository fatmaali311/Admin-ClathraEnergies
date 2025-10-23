import React from 'react';
// animation removed for simplicity (framer-motion not required here)
import AuthLayout from '../components/ui/AuthLayout';
import ForgotPasswordForm from '../components/forms/ForgotPasswordForm';
import leftImg from '../../assets/images/image.jpeg';

// animation containerVariants removed

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50" role="main" aria-labelledby="forgot-password-title">
      <AuthLayout
        leftTitle="Forgot Password?"
        leftDescription="Enter your email to reset your ClathraEnergies Admin Dashboard password."
        backgroundImage={leftImg}
        rightContent={<ForgotPasswordForm />}
      />
  </div>
  );
};

export default ForgotPasswordPage;