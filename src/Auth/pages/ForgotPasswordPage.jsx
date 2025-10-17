import React from 'react';
import { motion } from 'framer-motion';
import AuthLayout from '../components/ui/AuthLayout';
import ForgotPasswordForm from '../components/forms/ForgotPasswordForm';
import leftImg from '../../assets/images/image.jpeg';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.25 } }
};

const ForgotPasswordPage = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      role="main"
      aria-labelledby="forgot-password-title"
    >
      <AuthLayout
        leftTitle="Forgot Password?"
        leftDescription="Enter your email to reset your ClathraEnergies Admin Dashboard password."
        backgroundImage={leftImg}
        rightContent={<ForgotPasswordForm />}
      />
    </motion.div>
  );
};

export default ForgotPasswordPage;