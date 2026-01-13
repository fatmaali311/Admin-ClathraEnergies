import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { hasPermission } from "../../Auth/utils/authHelpers";
import DashboardLayout from "../../layout/DashboardLayout";
import { useUsers } from "../../hooks/useUsers";
import UserTable from "../../components/user/UserTable";
import { CircularProgress } from "@mui/material";

import InviteAdminModal from "../../components/modals/InviteAdminModal";
import ResendInvitationModal from "../../components/modals/ResendInvitationModal";
import DeleteConfirmationModal from "../../components/modals/DeleteConfirmationModal";
import { toast } from "react-toastify";

// --- Constants ---
const PRIMARY_COLOR = "#ADD0B3";
const HOVER_COLOR = "#8CB190";

// --- Main Component ---
const UserManagement = () => {
  const { user: authUser, loading: authLoading } = useAuth();

  // Use autonomous pagination via useUsers (which uses useResource)
  const { resource, removeUser, resendInvite, refresh } = useUsers();

  // Modals
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isResendModalOpen, setIsResendModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Loading for actions (resource.loading handles fetch loading)
  const [resendLoading, setResendLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // --- Invite Handlers ---
  const handleInviteSuccess = (message) => {
    toast.success(message);
    refresh();
  };

  const handleInviteError = (message) => {
    toast.error(message);
  };

  // --- Resend Invitation Handlers ---
  const handleResendClick = (userToResend) => {
    setSelectedUser(userToResend);
    setIsResendModalOpen(true);
  };

  const handleResendCancel = () => {
    setIsResendModalOpen(false);
    setSelectedUser(null);
  };

  const handleResendConfirm = async () => {
    if (!selectedUser) return;
    setResendLoading(true);
    try {
      const { ok } = await resendInvite(selectedUser.email);
      if (ok) {
        toast.success(`Invitation successfully resent to ${selectedUser.email}.`);
        handleResendCancel();
      }
    } catch (err) {
      console.error("Resend Error:", err);
      toast.error(err.message || "An unexpected error occurred during resend.");
    } finally {
      setResendLoading(false);
    }
  };

  // --- Delete Handlers ---
  const handleDeleteClick = (userToDelete) => {
    setSelectedUser(userToDelete);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    setDeleteLoading(true);
    try {
      const { ok } = await removeUser(selectedUser.id);
      if (ok) {
        toast.success(`Admin account for ${selectedUser.email} successfully removed.`);
        handleDeleteCancel();
      }
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error(err.message || "An unexpected error occurred during deletion.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // While we are restoring the user profile from the token, show a loader.
  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center bg-white rounded-xl shadow-md m-10">
          <CircularProgress color="inherit" size={32} sx={{ mr: 2 }} />
          <p className="mt-4 text-gray-600">Restoring session...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Permission Check: only after loading completed, evaluate role.
  if (!hasPermission(authUser?.role, "superadmin")) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center text-red-600 bg-white rounded-xl shadow-md m-10">
          Access Denied: Only Super Admins can manage users.
        </div>
      </DashboardLayout>
    );
  }

  // --- Render ---
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 text-left">
        {/* Header */}
        <div className="mb-6">
          <h1
            className="text-4xl font-extrabold text-gray-800 border-l-4 pl-4 mb-8"
            style={{ borderLeftColor: PRIMARY_COLOR }}
          >
            Admin User Management
          </h1>
          <p className="text-gray-600">
            List of all registered admin accounts ({resource.pagination?.totalItems || 0} accounts)
          </p>
        </div>

        {/* User Table (Handles Table specific UI like Invite Button via props or we can keep it here) */}
        {/* UserTable supports onAdd, so we use it to show the button via Table header if desired. 
            However, UserManagement Design had button above table. 
            ResourceTable supports `onAdd` and `addLabel` which puts it in the header.
            I will use that for consistency.
         */}

        <UserTable
          resource={resource}
          onResendInvite={handleResendClick}
          onDeleteUser={handleDeleteClick}
          onInviteNew={() => setIsInviteModalOpen(true)}
        />

        {/* Modals */}
        <InviteAdminModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          onSuccess={handleInviteSuccess}
          onError={handleInviteError}
        />

        {isResendModalOpen && (
          <ResendInvitationModal
            user={selectedUser}
            onConfirm={handleResendConfirm}
            onCancel={handleResendCancel}
            isLoading={resendLoading}
          />
        )}

        {isDeleteModalOpen && (
          <DeleteConfirmationModal
            user={selectedUser}
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
            isLoading={deleteLoading}
          />
        )}

      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
