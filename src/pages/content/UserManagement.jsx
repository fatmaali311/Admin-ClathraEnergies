import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { hasPermission } from "../../Auth/utils/authHelpers";
import DashboardLayout from "../../layout/DashboardLayout";
import {
  getAdmins,
  resendCompleteProfile,
  removeAdmin,
} from "../../Auth/services/userService";

// --- MUI Imports ---
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import Pagination from "@mui/material/Pagination";
// -----------------------------------------------------

import InviteAdminModal from "../../components/modals/InviteAdminModal";
import ResendInvitationModal from "../../components/modals/ResendInvitationModal";
import DeleteConfirmationModal from "../../components/modals/DeleteConfirmationModal";
import Toast from "../../components/ui/Toast";

// --- Constants ---
const PRIMARY_COLOR = "#ADD0B3";
const HOVER_COLOR = "#8CB190";

// --- Main Component ---
const UserManagement = () => {
  const { user: authUser, loading: authLoading } = useAuth(); 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalAdmins, setTotalAdmins] = useState(0);

  // Modals
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isResendModalOpen, setIsResendModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Loading for actions
  const [resendLoading, setResendLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast helper
  const displayToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Fetch users
  const fetchUsers = useCallback(async (page = 1, itemsPerPage = 10) => {
    setLoading(true);
    setError(null);
    try {
      const { ok, data } = await getAdmins(page, itemsPerPage);
      if (ok) {
        const rawUsers = data?.data || [];
        const metadata = data?.meta || {};

        const mappedUsers = rawUsers.map((u) => ({
          id: u._id,
          email: u.email,
          fullName: u.fullName,
          userName: u.userName,
          role: u.role || "admin",
          isSetupComplete: u.isProfileCompleted,
        }));
        setUsers(mappedUsers);

        setTotalAdmins(metadata.totalAdmins || 0);
        setCurrentPage(Number(metadata.page) || 1);
        setTotalPages(Number(metadata.totalPages) || 1);
        setLimit(Number(metadata.limit) || 10);
      } else {
        setError(data?.message || "Failed to fetch admin users.");
      }
    } catch (err) {
      console.error("Fetch Users Error:", err);
      setError(err.message || "Error fetching admin users.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Page change
  const handlePageChange = (event, page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      fetchUsers(page, limit);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (hasPermission(authUser?.role, "superadmin")) {
      fetchUsers(currentPage, limit);
    }
  }, [authUser, fetchUsers, currentPage, limit]);

  // --- Invite Handlers ---
  const handleInviteSuccess = (message) => {
    displayToast(message, "success");
    fetchUsers(1, limit);
  };

  const handleInviteError = (message) => {
    displayToast(message, "error");
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
      const { ok, data } = await resendCompleteProfile(selectedUser.email);
      if (ok) {
        displayToast(
          `Invitation successfully resent to ${selectedUser.email}.`,
          "success"
        );
        handleResendCancel();
      } else {
        displayToast(data?.message || "Failed to resend invitation.", "error");
      }
    } catch (err) {
      console.error("Resend Error:", err);
      displayToast(
        err.message || "An unexpected error occurred during resend.",
        "error"
      );
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
      const { ok, data } = await removeAdmin(selectedUser.id);
      if (ok) {
        displayToast(
          `Admin account for ${selectedUser.email} successfully removed.`,
          "success"
        );
        fetchUsers(currentPage, limit);
        handleDeleteCancel();
      } else {
        displayToast(data?.message || "Failed to remove admin.", "error");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      displayToast(
        err.message || "An unexpected error occurred during deletion.",
        "error"
      );
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
            List of all registered admin accounts ({totalAdmins} accounts)
          </p>
        </div>

        {/* Invite Button */}
        <div className="mb-8 flex justify-end">
          <Button
            variant="contained"
            onClick={() => setIsInviteModalOpen(true)}
            sx={{
              backgroundColor: PRIMARY_COLOR,
              "&:hover": { backgroundColor: HOVER_COLOR },
              padding: "12px 24px",
              borderRadius: "12px",
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            + Invite New Admin
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <Box
            className="text-center p-10 bg-white rounded-xl shadow-md"
            sx={{ color: PRIMARY_COLOR }}
          >
            <CircularProgress color="inherit" size={24} sx={{ mr: 2 }} />
            <Typography component="span">Loading admin list...</Typography>
          </Box>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Table */}
        {!loading && !error && users.length > 0 && (
          <>
            <TableContainer
              component={Paper}
              elevation={3}
              sx={{ borderRadius: "12px" }}
            >
              <Table aria-label="admin users table">
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: PRIMARY_COLOR,
                      "& th": { color: "white", fontWeight: "bold" },
                    }}
                  >
                    <TableCell>Email</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell align="center">Setup Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        {user.email}
                        {user.id === authUser?.id && (
                          <span className="text-xs text-gray-500 ml-2">
                            (You)
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{user.fullName || "N/A"}</TableCell>
                      <TableCell>{user.userName || "N/A"}</TableCell>
                      <TableCell align="center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.isSetupComplete
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isSetupComplete ? "Complete" : "Pending"}
                        </span>
                      </TableCell>

                      <TableCell align="right">
                        {/* Resend only if profile not complete */}
                        {!user.isSetupComplete && (
                          <Tooltip title="Resend Invitation">
                            <IconButton
                              onClick={() => handleResendClick(user)}
                              color="primary"
                              disabled={resendLoading}
                            >
                              <SendIcon />
                            </IconButton>
                          </Tooltip>
                        )}

                        {/* Delete only if not current user */}
                        {user.id !== authUser?.id && (
                          <Tooltip title="Delete Admin">
                            <IconButton
                              onClick={() => handleDeleteClick(user)}
                              sx={{ color: "#E53935" }}
                              disabled={deleteLoading}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                disabled={loading}
                sx={{
                  "& .MuiPaginationItem-root": {
                    "&.Mui-selected": {
                      backgroundColor: PRIMARY_COLOR,
                      color: "white",
                      "&:hover": {
                        backgroundColor: HOVER_COLOR,
                      },
                    },
                  },
                }}
              />
            </Box>
          </>
        )}

        {/* No users */}
        {!loading && !error && users.length === 0 && (
          <div className="text-center p-10 bg-white rounded-lg shadow-md text-gray-500">
            No admin users registered yet. Click "Invite New Admin" to add one.
          </div>
        )}

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

        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
