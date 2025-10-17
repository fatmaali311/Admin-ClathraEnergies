import React, { useState } from "react";
import { addAdmin } from "../../Auth/services/userService";

const InviteAdminModal = ({ isOpen, onClose, onSuccess, onError }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const { ok, data } = await addAdmin(email);
      if (ok) {
        onSuccess(data?.message || `Admin invitation sent to ${email}`);
        setEmail("");
        onClose();
      } else {
        onError(data?.message || "Failed to invite admin. Please try again.");
      }
    } catch (err) {
      console.error("Invite Admin Error:", err);
      onError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
 <div
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 "
  onClick={onClose}
>


      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-indigo-700 mb-4">
          Invite New Admin
        </h3>
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Admin Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter admin email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
            disabled={loading}
          />

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !email}
              className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center disabled:bg-indigo-400"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Send Invitation"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteAdminModal;
