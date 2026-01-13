import React from 'react';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useForgotPassword } from '../../hooks/useForgotPassword';
import AuthFormHeader from '../ui/AuthFormHeader';
import AuthInputField from '../ui/AuthInputField';
import AuthButton from '../ui/AuthButton';
import Alert from '../../../components/ui/Alert';
import { AUTH_ANIMATION_VARIANTS } from '../../utils/authConstants';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Please enter a valid email').required('Email is required'),
});

const ForgotPasswordForm = () => {
  const { handleForgotPassword, loading, message, error, sent } = useForgotPassword();

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: ForgotPasswordSchema,
    onSubmit: async (values, formikBag) => {
      await handleForgotPassword(values);
      formikBag.setSubmitting(false);
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, isValid } = formik;

  //  Show success message
  if (sent) {
    return (
      <motion.div
        variants={AUTH_ANIMATION_VARIANTS.container}
        initial="hidden"
        animate="visible"
        className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100"
      >
        <AuthFormHeader
          title="Password Reset Initiated"
          description="A password reset link has been successfully sent to the provided email address (if an account exists)."
          showLogo={true}
        />
        <motion.div variants={AUTH_ANIMATION_VARIANTS.item} className="mt-8">
          <Alert
            show={true}
            type="success"
            message={message || 'Please check your inbox (and spam folder) for the link.'}
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

  //  Default Form
  return (
    <motion.div variants={AUTH_ANIMATION_VARIANTS.container} initial="hidden" animate="visible">
      <AuthFormHeader
        title="Reset Password"
        description="Enter the email associated with your account to receive a password reset link."
      />

      <Alert
        show={!!error}
        type="error"
        message={error}
        onClose={() => formik.setStatus(null)}
      />

      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        <AuthInputField
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="your.email@example.com"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email && errors.email}
          required
          autoComplete="email"
          aria-invalid={touched.email && errors.email ? 'true' : 'false'}
          aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
        />

        <motion.div variants={AUTH_ANIMATION_VARIANTS.item} className="pt-2">
          <AuthButton type="submit" loading={isSubmitting || loading} disabled={isSubmitting || loading}>
            {isSubmitting || loading ? (
              <>
                <span className="animate-spin inline-block mr-2">⏳</span> Sending Request...
              </>
            ) : (
              'Send Reset Link'
            )}
          </AuthButton>
        </motion.div>

        <motion.div variants={AUTH_ANIMATION_VARIANTS.item} className="text-center mt-3">
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

export default ForgotPasswordForm;
