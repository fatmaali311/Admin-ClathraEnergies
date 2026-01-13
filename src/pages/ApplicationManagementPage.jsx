import React, { useState } from "react";
import DashboardLayout from '../layout/DashboardLayout';
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { useApplications } from "../hooks/useApplications";
import { usePositions } from "../hooks/usePositions";
import ApplicationTable from "../components/application/ApplicationTable";
import ApplicationDetailsModal from "../components/application/ApplicationDetailsModal";
import { ConfirmDialog } from "../components/Common/ConfirmDialog";
import { deleteApplication } from "../services/applicationService";
import { Pagination, Box } from "@mui/material";
import { getLocalizedValue } from "../lib/apiUtils";

const PRIMARY_COLOR = "#ADD0B3";

export default function ApplicationManagementPage() {
  const { loading: authLoading } = useAuth();
  // const { toastLegacy, showToastLegacy, closeToastLegacy } = useToast(); // Removed legacy toast hook

  const [filterStatus, setFilterStatus] = useState('');
  const [filterPositionId, setFilterPositionId] = useState('');
  const [viewingApplication, setViewingApplication] = useState(null);

  // Delete state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch positions for position filter dropdown (small page, no pagination here)
  const { positions: allPositions = [] } = usePositions({ page: 1, limit: 100 });

  // Use autonomous pagination
  const { resource, refetchApplications, applications, totalApplications } =
    useApplications({ status: filterStatus, positionId: filterPositionId });

  const { loading } = resource;

  // --- Delete Handlers (using Modal) ---

  const handleDeleteClick = (application) => {
    setApplicationToDelete(application);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!applicationToDelete) return;

    setIsDeleting(true);
    try {
      await deleteApplication(applicationToDelete._id);
      toast.success('Application deleted successfully!');
      refetchApplications();
    } catch (error) {
      toast.error(`Failed to delete application: ${error.message}`);
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
    // Page reset handled by useResource internal logic (via useEffect in hook or setFilters)
  };

  if (authLoading) {
    return <div className="flex justify-center py-10 text-xl text-gray-700">🔄 Checking session...</div>;
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
          resource={resource}
          onView={handleView}
          onDelete={handleDeleteClick} // Use the modal handler
          filterStatus={filterStatus}
          onFilterChange={handleFilterChange}
          positions={allPositions}
          filterPositionId={filterPositionId}
          onPositionFilterChange={(v) => { setFilterPositionId(v); }}
        />

        {/* --- Pagination Removed (Handled by ResourceTable) --- */}
      </div>

      {/* --- Modals and Toast --- */}
      <ApplicationDetailsModal
        open={!!viewingApplication}
        onClose={() => setViewingApplication(null)}
        application={viewingApplication}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={(v) => setDeleteConfirmOpen(!!v)}
        onConfirm={handleConfirmDelete}
        title={`Confirm Deletion`}
        message={`Are you sure you want to delete the application from ${applicationToDelete ? `${getLocalizedValue(applicationToDelete.firstName)} ${getLocalizedValue(applicationToDelete.lastName)}` : ''}?`}
        confirmLabel={`Delete Application`}
        cancelLabel={`Cancel`}
        loading={isDeleting}
      />


    </DashboardLayout>
  );
}
