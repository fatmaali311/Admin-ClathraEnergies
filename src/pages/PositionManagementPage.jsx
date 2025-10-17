import React, { useState } from "react";
import DashboardLayout from '../layout/DashboardLayout'; // From your layout
import Toast from '../components/ui/Toast'; // From your layout
import { useAuth } from "../contexts/AuthContext";
import { usePositions } from "../hooks/usePositions";
import { useToast } from "../hooks/useToast"; // NEW
import PositionTable from "../components/position/PositionTable";
import PositionFormModal from "../components/position/PositionFormModal";
import PositionDetailsModal from "../components/position/PositionDetailsModal";
import ConfirmDeleteModal from "../components/ui/ConfirmDeleteModal"; // NEW
import { deletePosition } from "../services/positionService";
import { Pagination, Box, Typography } from "@mui/material";

const PRIMARY_COLOR = "#ADD0B3";

export default function PositionManagementPage() {
  const { token, loading: authLoading } = useAuth();
  const { toast, showToast, closeToast } = useToast(); // NEW TOAST HOOK

  const [page, setPage] = useState(1);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [viewingPosition, setViewingPosition] = useState(null);
  
  // Delete state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { positions, loading, totalPages, totalPositions, refetchPositions } =
    usePositions(token, page, 10);

  // --- Delete Handlers (using Modal) ---

  const handleDeleteClick = (position) => {
    setPositionToDelete(position);
    setDeleteConfirmOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!positionToDelete) return;

    setIsDeleting(true);
    try {
      await deletePosition(token, positionToDelete._id);
      showToast('Position deleted successfully!', 'success'); // SUCCESS TOAST
      refetchPositions();
    } catch (error) {
      showToast(`Failed to delete position: ${error.message}`, 'error'); // ERROR TOAST
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
      showToast('Position saved successfully!', 'success'); // SUCCESS TOAST
    }
  };

  if (authLoading) {
    // Using a simpler spinner for this example, you'd use your custom LoadingSpinner
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
            Job Positions Management
          </h1>
          <p className="text-gray-600">
            Manage all open job positions ({totalPositions || '...'} total)
          </p>
        </div>

        {/* --- Position Table --- */}
        <PositionTable
          positions={positions}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteClick} // Use the modal handler
          onRefresh={refetchPositions}
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
      <PositionFormModal 
        open={isFormModalOpen}
        onClose={handleCloseFormModal}
        position={editingPosition} 
        token={token}
      />
      
      <PositionDetailsModal
        open={!!viewingPosition}
        onClose={() => setViewingPosition(null)}
        position={viewingPosition}
      /> 

      <ConfirmDeleteModal
        open={deleteConfirmOpen}
        onClose={setDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        itemType="Position"
        itemName={positionToDelete?.name || ''}
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