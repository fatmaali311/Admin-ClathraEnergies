import React from 'react';
import { motion } from 'framer-motion';

import { AUTH_ANIMATION_VARIANTS } from '../../utils/authConstants';

/**
 * Auth Layout Component
 * Shared layout for authentication pages 
 */
const AuthLayout = ({
  leftContent,
  rightContent,
  leftTitle,
  leftDescription,
  backgroundImage
}) => {
  return (
    <motion.div
      className="flex flex-col md:flex-row items-stretch bg-white rounded-3xl shadow-2xl overflow-hidden mx-auto w-full max-w-4xl min-h-[500px] border border-[#e0e7ff]"
      variants={AUTH_ANIMATION_VARIANTS.item}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="md:w-1/2 flex-1 relative flex items-center justify-center bg-gray-100 p-0"
        variants={AUTH_ANIMATION_VARIANTS.item}
      >
        {backgroundImage && (
          <img
            src={backgroundImage}
            alt="ClathraEnergies Background"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 0 }}
          />
        )}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-black/30 to-transparent p-10">

          <h2 className="text-3xl font-extrabold text-white text-center drop-shadow-lg mb-2">
            {leftTitle}
          </h2>
          <p className="text-gray-100 text-center text-lg drop-shadow mb-2">
            {leftDescription}
          </p>
          {leftContent}
        </div>
      </motion.div>
      <motion.div
        className="md:w-1/2 flex-1 flex flex-col justify-center p-10 bg-white"
        variants={AUTH_ANIMATION_VARIANTS.item}
      >
        {rightContent}
      </motion.div>
    </motion.div>
  );
};

export default AuthLayout;