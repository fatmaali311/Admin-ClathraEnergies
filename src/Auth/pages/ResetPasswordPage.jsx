import React from 'react';
import AuthLayout from '../components/ui/AuthLayout';
import ResetPasswordForm from '../components/forms/ResetPasswordForm';
import leftImg from '../../assets/images/image.jpeg';

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50" role="main" aria-labelledby="reset-password-title">
      <AuthLayout
        leftTitle="Reset Password"
        leftDescription="Please enter your new password for the ClathraEnergies Admin Dashboard."
        backgroundImage={leftImg}
        rightContent={<ResetPasswordForm />}
      />
    </div>
  );
};

export default ResetPasswordPage;