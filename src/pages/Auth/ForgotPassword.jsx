import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Mail } from "lucide-react";
import logo from "../../assets/images/logo.png"; 
export default function ForgotPassword() {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: (values) => {
      console.log("Reset password email:", values.email);
      toast.success("Password reset link sent to your email 📩");
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-10 shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-20 w-20" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Forgot Password?
        </h2>
        <p className="text-base text-gray-500 text-center mt-2 mb-8">
          Enter your email and we’ll send you a reset link.
        </p>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className={`w-full rounded-lg border pl-11 pr-3 py-3 text-base outline-none ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300 focus:border-green-500"
              }`}
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {formik.errors.email}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 py-3 text-base font-semibold text-white transition hover:bg-green-700"
          >
            Send Reset Link
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <a href="/login" className="text-sm text-green-600 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
