import React from 'react';
import { motion } from 'framer-motion';
import { useSetupAccount } from '../../hooks/useSetupAccount';
import AuthFormHeader from '../ui/AuthFormHeader';
import AuthInputField from '../ui/AuthInputField';
import AuthButton from '../ui/AuthButton';
import Alert from '../../../components/ui/Alert'; // 🟢 Import Alert component
import { useFormik } from 'formik';
import * as Yup from 'yup';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.7 } }
};

const SetupAccountSchema = Yup.object().shape({
  userName: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be 20 characters or less")
    .matches(/^[a-zA-Z0-9._-]+$/, 'Username must be 3-20 characters with letters, numbers, or ._-')
    .required('Username is required'),
  fullName: Yup.string()
    .max(100, "Full name is too long")
    .required('Full name is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password is too long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
    .required('Confirm Password is required'),
});

const SetupAccountForm = () => {
  const { submitSetupAccount } = useSetupAccount();

  const formik = useFormik({
    initialValues: { userName: '', fullName: '', password: '', confirmPassword: '' },
    validationSchema: SetupAccountSchema,
    onSubmit: async (values, formikBag) => {
      await submitSetupAccount(values, formikBag);
    },
  });

  const { values, errors, touched, status, handleChange, handleBlur, handleSubmit, isSubmitting, isValid } = formik;

  const setupComplete = status?.setupComplete;
  const message = status?.success;
  const apiError = status?.error;

  // 🟢 Updated success state to use Alert
  if (setupComplete) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100"
      >
        <AuthFormHeader
          title="Setup Complete! 🎉"
          description="Your ClathraEnergies Admin Dashboard account has been successfully set up."
          showLogo={true}
        />
        <motion.div variants={itemVariants} className="mt-8">
          <Alert
            show={true}
            type="success"
            message={message || 'You can now proceed to the login page.'}
            persistent={true}
          />
          <a
            href="/login"
            className="text-[#388E3C] font-medium hover:text-[#ADD0B3] transition-colors text-sm underline"
          >
            Go to Login
          </a>
        </motion.div>
      </motion.div>
    );
  }

  // Form state render
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <AuthFormHeader
        title="Set Up Your Account"
        description="Please provide your required details to complete your Admin Dashboard account setup."
      />

      <Alert
        show={!!apiError}
        type="error"
        message={apiError}
        onClose={() => formik.setStatus(null)}
      />

      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        <AuthInputField
          id="userName"
          name="userName"
          type="text"
          label="Username (Display Name)"
          placeholder="Enter your username"
          value={values.userName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.userName && errors.userName}
          autoComplete="username"
          variants={itemVariants}
          aria-invalid={touched.userName && errors.userName ? "true" : "false"}
          aria-describedby={touched.userName && errors.userName ? "userName-error" : undefined}
        />

        <AuthInputField
          id="fullName"
          name="fullName"
          type="text"
          label="Full Name"
          placeholder="Enter your full name"
          value={values.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.fullName && errors.fullName}
          autoComplete="name"
          variants={itemVariants}
          aria-invalid={touched.fullName && errors.fullName ? "true" : "false"}
          aria-describedby={touched.fullName && errors.fullName ? "fullName-error" : undefined}
        />

        <AuthInputField
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Create a secure password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password && errors.password}
          required
          autoComplete="new-password"
          variants={itemVariants}
          aria-invalid={touched.password && errors.password ? "true" : "false"}
          aria-describedby={touched.password && errors.password ? "password-error" : undefined}
        />

        <AuthInputField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.confirmPassword && errors.confirmPassword}
          required
          autoComplete="new-password"
          variants={itemVariants}
          aria-invalid={touched.confirmPassword && errors.confirmPassword ? "true" : "false"}
          aria-describedby={touched.confirmPassword && errors.confirmPassword ? "confirmPassword-error" : undefined}
        />

        <motion.div variants={itemVariants} className="pt-2">
          <AuthButton type="submit" loading={isSubmitting} disabled={isSubmitting || !isValid}>
            {isSubmitting ? (
              <>
                <span className="animate-spin inline-block mr-2">⏳</span> Finalizing Setup...
              </>
            ) : (
              "Complete Setup"
            )}
          </AuthButton>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mt-3">
          <a
            href="/login"
            className="text-sm text-[#ADD0B3] font-medium hover:text-[#388E3C] transition-colors"
          >
            Back to Login
          </a>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default SetupAccountForm;