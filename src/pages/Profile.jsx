import React, { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import Card from "../components/ui/Card";
import Alert from "../components/ui/Alert";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { fetchUserProfile } from "../Auth/services/authService";
import { updateProfile } from "../Auth/services/userService";
import { useAuth } from "../contexts/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";

// ✅ Validation schema
const ProfileSchema = Yup.object().shape({
  fullName: Yup.string()
    .max(100, "Full name is too long")
    .required("Full name is required"),
  userName: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be 20 characters or less")
    .matches(
      /^[a-zA-Z0-9._-]+$/,
      "Username can only contain letters, numbers, dots, underscores, or hyphens"
    )
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .nullable()
    .notRequired()
    .test(
      "password-strength",
      "Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
      (value) =>
        !value ||
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value
        )
    ),
});

const Profile = () => {
  const { token, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [originalEmail, setOriginalEmail] = useState("");

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: {
      fullName: "",
      userName: "",
      email: "",
      password: "",
    },
    validationSchema: ProfileSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      const isEmailChange = values.email !== originalEmail;
      if (isEmailChange) {
        sessionStorage.setItem("pendingEmailChange", originalEmail);
      }

      const updatedData = { ...values };
      if (!updatedData.password.trim()) delete updatedData.password;

      const { ok, data } = await updateProfile(updatedData);
      setLoading(false);

      if (ok) {
        if (isEmailChange) {
          setAlert({
            show: true,
            type: "info",
            message:
              "A verification link has been sent to your new email address. Please verify it to complete the change. You'll need to login again with your new email after verification.",
          });
        } else {
          setAlert({
            show: true,
            type: "success",
            message: data?.message || "Profile updated successfully!",
          });
          const { ok: profileOk, data: newData } = await fetchUserProfile();
          if (profileOk && newData?.user) {
            login(newData.user, token);
          }
        }
        resetForm({ values: { ...values, password: "" } });
      } else {
        setAlert({
          show: true,
          type: "error",
          message: data?.message || "Failed to update profile.",
        });
      }
    },
  });

  // ✅ Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { ok, data } = await fetchUserProfile();
      if (ok && data?.user) {
        formik.setValues({
          fullName: data.user.fullName || "",
          userName: data.user.userName || "",
          email: data.user.email || "",
          password: "",
        });
        setOriginalEmail(data.user.email || "");
      } else {
        setAlert({
          show: true,
          type: "error",
          message: data?.message || "Failed to load user data.",
        });
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    formik;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 text-left">
        {/* Header */}
        <div className="mb-6">
          <h1
            className="text-4xl font-extrabold text-gray-800 border-l-4 pl-4 mb-8"
            style={{ borderLeftColor: "#ADD0B3" }}
          >
            Profile Settings
          </h1>
          <p className="text-gray-600">
            Manage your personal information and update your account details.
          </p>
        </div>

        {/* Alert */}
        <Alert
          show={alert.show}
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false })}
        />

        {/* Profile Card */}
        <Card title="Edit Profile" color="#ADD0B3">
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner color="gray" />
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={values.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border rounded-lg p-2 focus:ring-[#ADD0B3] focus:border-[#ADD0B3] ${
                    touched.fullName && errors.fullName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your full name"
                />
                {touched.fullName && errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="userName"
                  value={values.userName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border rounded-lg p-2 focus:ring-[#ADD0B3] focus:border-[#ADD0B3] ${
                    touched.userName && errors.userName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your username"
                />
                {touched.userName && errors.userName && (
                  <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border rounded-lg p-2 focus:ring-[#ADD0B3] focus:border-[#ADD0B3] ${
                    touched.email && errors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border rounded-lg p-2 focus:ring-[#ADD0B3] focus:border-[#ADD0B3] ${
                    touched.password && errors.password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter new password"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank if you don’t want to change your password.
                </p>
                {touched.password && errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Submit */}
              <div className="pt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !formik.isValid}
                  className={`flex justify-center items-center gap-3 text-white px-8 py-3 rounded-2xl font-semibold text-lg hover:opacity-90 transition-all duration-300 shadow-xl ${
                    loading || !formik.isValid
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                  style={{ backgroundColor: "#ADD0B3" }}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner color="white" /> Saving Changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
