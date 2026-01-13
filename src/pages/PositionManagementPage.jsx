import React, { useState } from "react";
import DashboardLayout from '../layout/DashboardLayout';
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { usePositions } from "../hooks/usePositions";
import PositionTable from "../components/position/PositionTable";
import PositionFormModal from "../components/position/PositionFormModal";
import PositionDetailsModal from "../components/position/PositionDetailsModal";
import { ConfirmDialog } from "../components/Common/ConfirmDialog";
import { deletePosition } from "../services/positionService";
import { Pagination, Box } from "@mui/material";
import { getLocalizedValue } from "../lib/apiUtils";

const PRIMARY_COLOR = "#ADD0B3";

export default function PositionManagementPage() {
  const { loading: authLoading } = useAuth();
  // const { toastLegacy, showToastLegacy, closeToastLegacy } = useToast(); // Removed legacy toast hook

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [viewingPosition, setViewingPosition] = useState(null);

  // Delete state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Use autonomous pagination
  const { resource, refetchPositions, positions, totalPositions } = usePositions();
  const { loading } = resource;

  // --- Delete Handlers (using Modal) ---

  const handleDeleteClick = (position) => {
    setPositionToDelete(position);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!positionToDelete) return;

    setIsDeleting(true);
    try {
      await deletePosition(positionToDelete._id);
      toast.success('Position deleted successfully!');
      refetchPositions();
    } catch (error) {
      toast.error(`Failed to delete position: ${error.message}`);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setPositionToDelete(null);
    }
  };

  // --- Other Handlers ---

  const handleEdit = (position) => {
    setEditingPosition(position);
    setIsFormModalOpen(true);
  };

  const handleView = (position) => {
    setViewingPosition(position);
  };

  const handleCloseFormModal = (needsRefresh = false) => {
    setIsFormModalOpen(false);
    setEditingPosition(null);
    if (needsRefresh) {
      refetchPositions();
      toast.success('Position saved successfully!');
    }
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
            Job Positions Management
          </h1>
          <p className="text-gray-600">
            Manage all open job positions ({totalPositions || '...'} total)
          </p>
        </div>

        {/* --- Position Table --- */}
        <PositionTable
          resource={resource}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteClick} // Use the modal handler
        />

        {/* --- Pagination Removed (Handled by ResourceTable) --- */}
      </div>

      {/* --- Modals and Toast --- */}
      <PositionFormModal
        open={isFormModalOpen}
        onClose={handleCloseFormModal}
        position={editingPosition}
      // token removed
      />

      <PositionDetailsModal
        open={!!viewingPosition}
        onClose={() => setViewingPosition(null)}
        position={viewingPosition}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={(v) => setDeleteConfirmOpen(!!v)}
        onConfirm={handleConfirmDelete}
        title={`Confirm Deletion`}
        message={`Are you sure you want to delete the Position: ${getLocalizedValue(positionToDelete?.name) || ''}?`}
        confirmLabel={`Delete Position`}
        cancelLabel={`Cancel`}
        loading={isDeleting}
      />

    </DashboardLayout>
  );
}
