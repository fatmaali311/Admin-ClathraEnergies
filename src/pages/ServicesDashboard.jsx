import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useServices } from "../hooks/useServices";
import ServicesTable from "../components/services/ServicesTable";
import ServiceForm from "../components/services/ServiceForm";
import ServiceDetailsModal from "../components/services/ServiceDetailsModal";
import { Box, Typography, Button, Pagination, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Add as AddIcon, Refresh as RefreshIcon, DeleteForever as DeleteForeverIcon } from "@mui/icons-material";

// --- Constants ---
const PRIMARY_COLOR = "#ADD0B3";
const HOVER_COLOR = "#8CB190";

export default function ServicesDashboard() {
  const { token, loading: authLoading, user } = useAuth();
  
  const { 
    services, 
    loading: servicesLoading, 
    error: servicesError, 
    fetchServices, 
    removeService, 
    pagination 
  } = useServices(); 

  const [view, setView] = useState('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentService, setCurrentService] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (token) {
      fetchServices(currentPage, 10);
    }
  }, [token, currentPage, fetchServices]);

  const handleViewDetails = (service) => setCurrentService(service);
  const handleEdit = (service) => {
    setCurrentService(service);
    setView('form');
  };
  const handleDeleteAttempt = (serviceTitle) => setDeleteConfirm(serviceTitle);
  const handleConfirmDelete = async () => {
    if (deleteConfirm) {
      await removeService(deleteConfirm);
      setDeleteConfirm(null);
      fetchServices(currentPage, 10);
    }
  };
  const handleCreateNew = () => {
    setCurrentService(null);
    setView('form');
  };
  const handleFormClose = () => {
    setCurrentService(null);
    setView('table');
    fetchServices(currentPage, 10);
  };

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
        <CircularProgress sx={{ color: PRIMARY_COLOR }} />
        <Typography variant="h6" sx={{ ml: 2, color: 'gray.700' }}>
          Checking session...
        </Typography>
      </Box>
    );
  }

  if (!token) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h6" color="error">
          Unauthorized. Please login.
        </Typography>
      </Box>
    );
  }

  if (view === 'form') {
    return (
      <ServiceForm 
        service={currentService} 
        onClose={handleFormClose} 
      />
    );
  }

  return (
    <Box sx={{ maxWidth: '7xl', mx: 'auto', py: 8, px: 4 }}>
      <Box sx={{ mb: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'extrabold',
              color: 'gray.800',
              borderLeft: `4px solid ${PRIMARY_COLOR}`,
              pl: 2,
              mb: 2,
            }}
          >
            Services Management
          </Typography>
          <Typography variant="body1" sx={{ color: 'gray.600' }}>
            Manage all available services, including creation, editing, and deletion.
            ({pagination.total || 0} services found)
          </Typography>
        </Box>
        <Button
          onClick={handleCreateNew}
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          sx={{ 
            backgroundColor: PRIMARY_COLOR, 
            "&:hover": { backgroundColor: HOVER_COLOR },
            borderRadius: '9999px',
            px: 4,
            py: 1.5,
            fontWeight: 'bold',
          }}
        >
          Create New
        </Button>
      </Box>
      
      <ServicesTable 
        services={services} 
        loading={servicesLoading} 
        onView={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDeleteAttempt}
        onRefresh={() => fetchServices(currentPage, 10)}
        error={servicesError}
      />

      {!servicesLoading && pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Pagination
            count={pagination.totalPages || 0}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            color="primary"
            disabled={servicesLoading}
            sx={{
              "& .MuiPaginationItem-root": {
                "&.Mui-selected": {
                  backgroundColor: PRIMARY_COLOR,
                  color: "white",
                  "&:hover": { backgroundColor: HOVER_COLOR },
                },
              },
            }}
          />
        </Box>
      )}

      <ServiceDetailsModal 
        service={currentService} 
        onClose={() => setCurrentService(null)} 
        primaryColor={PRIMARY_COLOR}
      />
      
      <Dialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        PaperProps={{ sx: { borderRadius: '16px', p: 2 } }}
      >
        <DialogTitle sx={{ bgcolor: 'red.500', color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          <DeleteForeverIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="body1">
            Are you sure you want to delete this service? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 3 }}>
          <Button 
            onClick={() => setDeleteConfirm(null)} 
            variant="outlined" 
            sx={{ color: 'gray.600', borderColor: 'gray.300', mr: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            variant="contained" 
            sx={{ 
              backgroundColor: 'red.600', 
              "&:hover": { backgroundColor: 'red.700' },
              px: 4,
            }}
            startIcon={<DeleteForeverIcon />}
          >
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}