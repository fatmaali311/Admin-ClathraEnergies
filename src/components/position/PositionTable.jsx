import React from 'react';
import { ManagedTable } from '../Common';
import { IconButton, Box, CircularProgress, Typography } from '@mui/material';
import { PRIMARY_COLOR, HOVER_COLOR } from '../Common/styles';
import { Visibility, Edit, Delete, Refresh as RefreshIcon } from '@mui/icons-material';
import ConfirmDialog from '../Common/ConfirmDialog';
import { useState } from 'react';

export default function PositionTable({ positions = [], loading = false, onView, onEdit, onDelete, onRefresh }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteRow, setToDeleteRow] = useState(null);

  if (loading) {
    return (
      <Box className="text-center p-10 bg-white rounded-xl shadow-md" sx={{ color: PRIMARY_COLOR, borderRadius: '12px' }}>
        <CircularProgress color="inherit" size={24} sx={{ mr: 2 }} />
        <Typography component="span">Loading job positions...</Typography>
      </Box>
    );
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'location', label: 'Location' },
    { key: 'type', label: 'Type' },
    { key: 'skills', label: 'Skills' },
  ];

  const actions = (row) => (
    <div className="flex items-center justify-center gap-2">
      <IconButton color="primary" size="small" onClick={() => onView(row)} aria-label={`View ${row.name}`}>
        <Visibility fontSize="small" />
      </IconButton>
      <IconButton color="secondary" size="small" onClick={() => onEdit(row)} aria-label={`Edit ${row.name}`}>
        <Edit fontSize="small" />
      </IconButton>
      <IconButton color="error" size="small" onClick={() => { setToDeleteRow(row); setConfirmOpen(true); }} aria-label={`Delete ${row.name}`}>
        <Delete fontSize="small" />
      </IconButton>
    </div>
  );

  return (
    <>
    <ManagedTable
      columns={columns}
      rows={positions}
      loading={loading}
      onRefresh={onRefresh}
      onAdd={() => onEdit(null)}
      addLabel="Add New Position"
      renderRow={(row) => (
        <>
          {actions(row)}
        </>
      )}
    />
    <ConfirmDialog
      open={confirmOpen}
      onClose={() => setConfirmOpen(false)}
      onConfirm={() => { setConfirmOpen(false); if (toDeleteRow) onDelete(toDeleteRow); setToDeleteRow(null); }}
      title="Delete Position"
      message={toDeleteRow ? `Are you sure you want to delete "${toDeleteRow.name}"?` : 'Are you sure?'}
      confirmLabel="Delete"
      loading={false}
    />
    </>
  );
}