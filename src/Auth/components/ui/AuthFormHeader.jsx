import React from 'react';
import { motion } from 'framer-motion';
import Logo from '../../../components/Common/Logo';
import Alert from '../../../components/ui/Alert';
import { AUTH_ANIMATION_VARIANTS } from '../../utils/authConstants';

/**
 * Auth Form Header Component
 * Reusable header for auth forms in ClathraEnergies Admin Dashboard
 */
const AuthFormHeader = ({
  title,
  description,
  showLogo = true,
  alert = null,
  onCloseAlert = null
}) => {


  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={AUTH_ANIMATION_VARIANTS.container}
      className="mb-6 relative"
    >

      {showLogo && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
          variants={AUTH_ANIMATION_VARIANTS.item}
        >

          <Logo size="xl" center={true} marginBottom={false} />
        </motion.div>
      )}


      <div className="text-center">
        <motion.h2
          className="text-3xl font-extrabold text-[#ADD0B3] mb-2 drop-shadow-sm"
          variants={AUTH_ANIMATION_VARIANTS.item}
        >
          {title}
        </motion.h2>

        {description && (
          <motion.p
            className="text-gray-600 text-base mb-4"
            variants={AUTH_ANIMATION_VARIANTS.item}
          >
            {description}
          </motion.p>
        )}
      </div>

      <motion.div
        className="w-16 h-1 bg-[#ADD0B3] mx-auto rounded-full mt-4"
        initial={{ width: 0 }}
        animate={{ width: '4rem' }}
        transition={{ delay: 0.8, duration: 0.5 }}
      />


      {alert && alert.show && (
        <div className="mt-6">
          <Alert
            show={alert.show}
            type={alert.type}
            message={alert.message}
            persistent={alert.persistent}
            onClose={onCloseAlert}
          />
        </div>
      )}
    </motion.div>
  );
};

export default AuthFormHeader;