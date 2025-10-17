import React, { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import Card from "../components/ui/Card";
import Alert from "../components/ui/Alert";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { fetchUserProfile } from "../Auth/services/authService";
import { updateProfile } from "../Auth/services/userService";
import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // ✅ Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { ok, data } = await fetchUserProfile();
      if (ok && data?.user) {
        setFormData({
          fullName: data.user.fullName || "",
          userName: data.user.userName || "",
          email: data.user.email || "",
          password: "",
        });
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

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ✨ إرسال البيانات بدون الباسورد لو كانت فاضية
    const updatedData = { ...formData };
    if (!updatedData.password.trim()) {
      delete updatedData.password;
    }

    const { ok, data } = await updateProfile(updatedData);
    setLoading(false);

    if (ok) {
      setAlert({
        show: true,
        type: "success",
        message:
          data?.message ||
          "Profile updated successfully! Please verify your new email if changed.",
      });
    } else {
      setAlert({
        show: true,
        type: "error",
        message: data?.message || "Failed to update profile.",
      });
    }
  };

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
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-[#ADD0B3] focus:border-[#ADD0B3]"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-[#ADD0B3] focus:border-[#ADD0B3]"
                  placeholder="Enter your username"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-[#ADD0B3] focus:border-[#ADD0B3]"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-[#ADD0B3] focus:border-[#ADD0B3]"
                  placeholder="Enter new password"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank if you don’t want to change your password.
                </p>
              </div>

              {/* Submit */}
              <div className="pt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex justify-center items-center gap-3 text-white px-8 py-3 rounded-2xl font-semibold text-lg hover:opacity-90 transition-all duration-300 shadow-xl ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
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
