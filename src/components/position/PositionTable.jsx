import React, { useState } from 'react';
import ResourceTable from '../Common/ResourceTable'; // Updated import
import { IconButton, Box, CircularProgress, Typography } from '@mui/material';
import { PRIMARY_COLOR } from '../Common/styles';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import ConfirmDialog from '../Common/ConfirmDialog';
import { getLocalizedValue } from '../../lib/apiUtils';

export default function PositionTable({ resource, onView, onEdit, onDelete }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteRow, setToDeleteRow] = useState(null);

  const { loading } = resource || {};

  if (loading && !resource?.data?.length) {
    // Optional: ResourceTable handles loading too, but we can keep specific loading UI if desired.
    // ResourceTable's loading is inside the table usually.
    // If we return early here, we lose the table shell.
    // Better to let ResourceTable handle it.
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'location', label: 'Location' },
    { key: 'type', label: 'Type' },
    { key: 'skills', label: 'Skills' },
  ];

  const actions = (row) => (
    <div className="flex items-center justify-center gap-2">
      <IconButton color="primary" size="small" onClick={() => onView(row)} aria-label={`View ${getLocalizedValue(row.name)}`}>
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
      <ResourceTable
        resource={resource}
        columns={columns}
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
        message={toDeleteRow ? `Are you sure you want to delete "${getLocalizedValue(toDeleteRow.name)}"?` : 'Are you sure?'}
        confirmLabel="Delete"
        loading={false}
      />
    </>
  );
}