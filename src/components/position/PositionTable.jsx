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

  }

  const stripHtml = (htmlString) => {
    if (!htmlString) return '';
    try {
      const doc = new DOMParser().parseFromString(htmlString, 'text/html');

      // Attempt to get text from block elements like li and p first
      const blocks = Array.from(doc.querySelectorAll('li, p'));

      if (blocks.length > 0) {
        return blocks
          .map(el => el.textContent.trim())
          .filter(text => text.length > 0)
          .join(', ');
      }

      // Fallback
      return doc.body.textContent || "";
    } catch {
      return "";
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'location', label: 'Location' },
    { key: 'type', label: 'Type' },
    {
      key: 'skills',
      label: 'Skills',
      render: (row) => {
        const val = row.skills;
        const localized = getLocalizedValue(val);
        const stripped = stripHtml(localized);
        // Truncate if too long (skills can be long rich text now)
        return stripped.length > 50 ? `${stripped.substring(0, 50)}...` : stripped;
      }
    },
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