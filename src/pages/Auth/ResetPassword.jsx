import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Lock } from "lucide-react";
import logo from "../../assets/images/logo.png"; 
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: (values) => {
      console.log("New password set:", values.password);
      toast.success("Password has been reset successfully ✅");
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
          Reset Password
        </h2>
        <p className="text-base text-gray-500 text-center mt-2 mb-8">
          Enter your new password below.
        </p>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="password"
              name="password"
              placeholder="New Password"
              className={`w-full rounded-lg border pl-11 pr-3 py-3 text-base outline-none ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-300 focus:border-green-500"
              }`}
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className={`w-full rounded-lg border pl-11 pr-3 py-3 text-base outline-none ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300 focus:border-green-500"
              }`}
              {...formik.getFieldProps("confirmPassword")}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {formik.errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={() => navigate("/login")}
            className="w-full rounded-lg bg-green-600 py-3 text-base font-semibold text-white transition hover:bg-green-700"
          >
            Reset Password
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
