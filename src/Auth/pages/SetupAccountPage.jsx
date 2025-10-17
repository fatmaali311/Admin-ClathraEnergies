import React from 'react';
import { motion } from 'framer-motion';
import AuthLayout from '../components/ui/AuthLayout';
import SetupAccountForm from '../components/forms/SetupAccountForm';
import leftImg from '../../assets/images/image.jpeg';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.25 } }
};

const SetupAccountPage = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      role="main"
      aria-labelledby="setup-account-title"
    >
      <AuthLayout
        leftTitle="Set Up Your Account"
        leftDescription="Complete your ClathraEnergies Admin Dashboard account setup."
        backgroundImage={leftImg}
        rightContent={<SetupAccountForm />}
      />
    </motion.div>
  );
};

export default SetupAccountPage;