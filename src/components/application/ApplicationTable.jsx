import React, { useState } from "react";
import { useToast } from '../../hooks/useToast';
import {
  FormControl, InputLabel, Select, MenuItem, Chip,
  IconButton, Typography, CircularProgress, Box
} from "@mui/material";
import { ManagedTable } from '../Common';
import { Visibility, Delete } from "@mui/icons-material";
import ConfirmDialog from '../Common/ConfirmDialog';
import { updateApplicationStatus } from "../../services/applicationService";
import { useAuth } from "../../contexts/AuthContext";
import { PRIMARY_COLOR } from '../Common/styles';

const statusColors = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  contacted: 'info',
};

// Component for Status change (handles PATCH request directly)
const StatusSelector = ({ applicationId, currentStatus, refetchApplications }) => {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setLoading(true);
    try {
      await updateApplicationStatus(token, applicationId, newStatus);
      setStatus(newStatus);
      refetchApplications();
    } catch (error) {
      showToast(`Failed to update status: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
      <InputLabel>Status</InputLabel>
      <Select
        value={status}
        onChange={handleStatusChange}
        label="Status"
        disabled={loading}
        sx={{ bgcolor: 'white' }}
      >
        {['pending', 'approved', 'rejected', 'contacted'].map((s) => (
          <MenuItem key={s} value={s}>
            <Chip label={s.toUpperCase()} size="small" color={statusColors[s]} />
          </MenuItem>
        ))}
      </Select>
      {loading && (
        <CircularProgress size={24} sx={{ color: PRIMARY_COLOR, position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px', zIndex: 10 }} />
      )}
    </FormControl>
  );
};

export default function ApplicationTable({
  applications,
  loading,
  onView,
  onDelete,
  onRefresh,
  filterStatus,
  onFilterChange
  , positions = [], filterPositionId = '', onPositionFilterChange = () => {}
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteApp, setToDeleteApp] = useState(null);

  const handleDeleteClick = (app) => {
    setToDeleteApp(app);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setConfirmOpen(false);
    if (toDeleteApp) onDelete(toDeleteApp);
    setToDeleteApp(null);
  };

  const columns = [
    { key: 'applicant', label: 'Applicant', render: (r) => `${r.firstName} ${r.lastName}` },
    { key: 'email', label: 'Email', render: (r) => r.email },
    { key: 'location', label: 'Location', className: 'hidden sm:table-cell', render: (r) => r.location || 'N/A' },
    { key: 'submitted', label: 'Submitted', className: 'hidden md:table-cell', render: (r) => new Date(r.createdAt).toLocaleDateString() },
    { key: 'status', label: 'Status', render: (r) => (<StatusSelector applicationId={r._id} currentStatus={r.status} refetchApplications={onRefresh} />) },
  ];

  return (
    <>
    <ManagedTable
      columns={columns}
      rows={applications}
      loading={loading}
      onRefresh={onRefresh}
      leftHeader={(
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => onFilterChange(e.target.value)}
              label="Filter by Status"
            >
              <MenuItem value="">All Applications</MenuItem>
              {['pending', 'approved', 'rejected', 'contacted'].map((s) => (
                <MenuItem key={s} value={s}>
                  <Chip label={s.toUpperCase()} size="small" color={statusColors[s]} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="outlined" size="small" sx={{ minWidth: 220 }}>
            <InputLabel>Filter by Position</InputLabel>
            <Select
              value={filterPositionId}
              onChange={(e) => onPositionFilterChange(e.target.value)}
              label="Filter by Position"
            >
              <MenuItem value="">All Positions</MenuItem>
              <MenuItem value="none">No Position</MenuItem>
              {positions.map((p) => (
                <MenuItem key={p._id} value={p._id}>{p.name} {p.location ? `(${p.location})` : ''}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      )}
      renderRow={(row) => (
        <>
          <IconButton color="primary" size="small" onClick={() => onView(row)} aria-label={`View ${row.firstName}`}>
            <Visibility fontSize="small" />
          </IconButton>
          <IconButton color="error" size="small" onClick={() => handleDeleteClick(row)} aria-label={`Delete ${row.firstName}`}>
            <Delete fontSize="small" />
          </IconButton>
        </>
      )}
    />
    <ConfirmDialog
      open={confirmOpen}
      onClose={() => setConfirmOpen(false)}
      onConfirm={handleConfirmDelete}
      title="Delete Application"
      message={toDeleteApp ? `Are you sure you want to delete the application from ${toDeleteApp.firstName} ${toDeleteApp.lastName}?` : 'Are you sure?'}
      confirmLabel="Delete"
      loading={false}
    />
    </>
  );
}