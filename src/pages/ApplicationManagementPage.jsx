import React, { useState } from "react";
import DashboardLayout from '../layout/DashboardLayout'; // From your layout
import Toast from '../components/ui/Toast'; // From your layout
import { useAuth } from "../contexts/AuthContext";
import { useApplications } from "../hooks/useApplications";
import { useToast } from "../hooks/useToast"; // NEW
import ApplicationTable from "../components/application/ApplicationTable";
import ApplicationDetailsModal from "../components/application/ApplicationDetailsModal";
import ConfirmDeleteModal from "../components/ui/ConfirmDeleteModal"; // NEW
import { deleteApplication } from "../services/applicationService";
import { Pagination, Box, Typography } from "@mui/material";

const PRIMARY_COLOR = "#ADD0B3";

export default function ApplicationManagementPage() {
  const { token, loading: authLoading } = useAuth();
  const { toast, showToast, closeToast } = useToast(); // NEW TOAST HOOK

  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [viewingApplication, setViewingApplication] = useState(null);
  
  // Delete state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { applications, loading, totalPages, totalApplications, refetchApplications } =
    useApplications(token, page, 10, filterStatus);

  // --- Delete Handlers (using Modal) ---

  const handleDeleteClick = (application) => {
    setApplicationToDelete(application);
    setDeleteConfirmOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!applicationToDelete) return;

    setIsDeleting(true);
    try {
      await deleteApplication(token, applicationToDelete._id);
      showToast('Application deleted successfully!', 'success'); // SUCCESS TOAST
      refetchApplications();
    } catch (error) {
      showToast(`Failed to delete application: ${error.message}`, 'error'); // ERROR TOAST
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setApplicationToDelete(null);
    }
  };

  // --- Other Handlers ---

  const handleView = (application) => {
    setViewingApplication(application);
  };
  
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setPage(1);
  };

  if (authLoading) {
    return <div className="flex justify-center py-10 text-xl text-gray-700">🔄 Checking session...</div>;
  }

  if (!token) {
    return <div className="text-center py-10 text-red-500 font-semibold">🚫 Unauthorized. Please login.</div>;
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 text-left">
        {/* --- Header --- */}
        <div className="mb-8">
          <h1
            className="text-4xl font-extrabold text-gray-800 border-l-4 pl-4 mb-4"
            style={{ borderLeftColor: PRIMARY_COLOR }}
          >
            Job Applications Management
          </h1>
          <p className="text-gray-600">
            Review and manage all submitted job applications ({totalApplications || '...'} total)
          </p>
        </div>

        {/* --- Application Table --- */}
        <ApplicationTable
          applications={applications}
          loading={loading}
          onView={handleView}
          onDelete={handleDeleteClick} // Use the modal handler
          onRefresh={refetchApplications}
          filterStatus={filterStatus}
          onFilterChange={handleFilterChange}
        />

        {/* --- Pagination --- */}
        {!loading && totalPages > 0 && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              disabled={loading}
              sx={{
                "& .MuiPaginationItem-root": {
                  "&.Mui-selected": {
                    backgroundColor: PRIMARY_COLOR,
                    color: "white",
                    "&:hover": { backgroundColor: '#8CB190' },
                  },
                },
              }}
            />
          </Box>
        )}
      </div>

      {/* --- Modals and Toast --- */}
      <ApplicationDetailsModal
        open={!!viewingApplication}
        onClose={() => setViewingApplication(null)}
        application={viewingApplication}
      /> 

      <ConfirmDeleteModal
        open={deleteConfirmOpen}
        onClose={setDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        itemType="Application"
        itemName={applicationToDelete ? `${applicationToDelete.firstName} ${applicationToDelete.lastName}` : ''}
        isDeleting={isDeleting}
      />
      
      {/* Your custom Toast component */}
      <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
      />
    </DashboardLayout>
  );
}