import React from 'react';
import { useResetPassword } from '../../hooks/useResetPassword';
import AuthFormHeader from '../ui/AuthFormHeader';
import AuthInputField from '../ui/AuthInputField';
import AuthButton from '../ui/AuthButton';
import Alert from '../../../components/ui/Alert'; 
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.7 } }
};

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password is too long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'
    )
    .required('New Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const ResetPasswordForm = () => {
  const { submitResetPassword } = useResetPassword();

  const formik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values, formikBag) => {
      await submitResetPassword(values, formikBag);
    },
  });

  const { values, errors, touched, status, handleChange, handleBlur, handleSubmit, isSubmitting, isValid } = formik;
  
  const reset = status?.reset;
  const message = status?.success;
  const apiError = status?.error;

  // 🟢 Updated success state to use Alert
  if (reset) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100"
      >
        <AuthFormHeader
          title="Password Reset Complete! 🎉"
          description="Your password has been reset successfully. You can now use your new credentials to log in."
          showLogo={true}
        />
        <motion.div variants={itemVariants} className="mt-8">
          <Alert
            show={true}
            type="success"
            message={message || 'You can now safely return to the login page.'}
            persistent={true}
          />
          <a
            href="/login"
            className="text-[#388E3C] font-medium hover:text-[#ADD0B3] transition-colors text-sm underline"
          >
            Return to Login
          </a>
        </motion.div>
      </motion.div>
    );
  }

  // Form state render
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <AuthFormHeader
        title="Set New Password"
        description="Please enter and confirm your new password to regain access to your account."
      />

      <Alert
        show={!!apiError}
        type="error"
        message={apiError}
        onClose={() => formik.setStatus(null)}
      />

      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        <AuthInputField
          id="password"
          name="password"
          type="password"
          label="New Password"
          placeholder="Enter a secure new password"
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
          placeholder="Re-enter your new password"
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
                <span className="animate-spin inline-block mr-2">⏳</span> Resetting...
              </>
            ) : (
              "Save New Password"
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

      {/* 🟢 Replaced inline error div with Alert component */}
      <motion.div variants={itemVariants} className="mt-6">
        <Alert
          show={!!apiError}
          type="error"
          message={apiError}
          onClose={() => formik.setStatus({})}
        />
      </motion.div>
    </motion.div>
  );
};

export default ResetPasswordForm;