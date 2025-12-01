// src/pages/Auth/LoginForm.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useLogin } from '../../hooks/useLogin';
// Assuming these are defined elsewhere
import AuthFormHeader from '../ui/AuthFormHeader';
import AuthInputField from '../ui/AuthInputField';
import AuthButton from '../ui/AuthButton';
import Alert from '../../../components/ui/Alert';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Must be a valid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .max(50, 'Password is too long')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'
        )
        .required('Password is required'),
});

const LoginForm = () => {
    const { submitLogin } = useLogin();

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: LoginSchema,
        onSubmit: async (values, formikBag) => {
            await submitLogin(values, formikBag);
        },
    });

    const { values, errors, touched, status: apiError, handleChange, handleBlur, handleSubmit, isSubmitting, isValid } = formik;

    return (
        <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.7 } } }}
            initial="hidden"
            animate="visible"
        >
            <AuthFormHeader
                title="Admin Login"
                description="Welcome back! Please enter your credentials to access the ClathraEnergies Admin Dashboard."
            />

            <Alert
                show={!!apiError}
                type="error"
                message={apiError}
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
                    aria-invalid={touched.email && errors.email ? 'true' : 'false'}
                    aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                />

                <AuthInputField
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && errors.password}
                    required
                    aria-invalid={touched.password && errors.password ? 'true' : 'false'}
                    aria-describedby={touched.password && errors.password ? 'password-error' : undefined}
                />

                <AuthButton type="submit" loading={isSubmitting} disabled={isSubmitting || !isValid}>
                    {isSubmitting ? (
                        <>
                            <span className="animate-spin inline-block mr-2">⏳</span> Signing in...
                        </>
                    ) : (
                        "Login to Dashboard"
                    )}
                </AuthButton>

                <div className="text-center mt-3">
                    <a
                        href="/forgot-password"
                        className="text-sm text-[#ADD0B3] font-medium hover:text-[#388E3C] transition-colors"
                    >
                        Forgot your password?
                    </a>
                </div>
            </form>
        </motion.div>
    );
};

export default LoginForm;