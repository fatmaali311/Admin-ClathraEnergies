import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useServices } from "../hooks/useServices";
import ServicesTable from "../components/services/ServicesTable";
import ServiceForm from "../components/services/ServiceForm";
import ServiceDetailsModal from "../components/services/ServiceDetailsModal";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

// --- Constants ---
const PRIMARY_COLOR = "#ADD0B3";
const HOVER_COLOR = "#8CB190";

export default function ServicesDashboard() {
  const { token, loading: authLoading } = useAuth();

  // Use autonomous pagination
  const { resource, removeService, fetchServices, pagination } = useServices();

  const [view, setView] = useState('table');
  const [currentService, setCurrentService] = useState(null);

  const handleViewDetails = (service) => setCurrentService(service);
  const handleEdit = (service) => {
    setCurrentService(service);
    setView('form');
  };

  const handleDeleteService = async (serviceTitle) => {
    await removeService(serviceTitle);
    // fetchServices(); // Handled internally by removeService -> refresh()
  };

  const handleCreateNew = () => {
    setCurrentService(null);
    setView('form');
  };
  const handleFormClose = () => {
    setCurrentService(null);
    setView('table');
    fetchServices();
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
      </Box>

      <ServicesTable
        resource={resource}
        onView={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDeleteService}
        onAdd={handleCreateNew}
      />

      <ServiceDetailsModal
        service={currentService}
        onClose={() => setCurrentService(null)}
        primaryColor={PRIMARY_COLOR}
      />
    </Box>
  );
}