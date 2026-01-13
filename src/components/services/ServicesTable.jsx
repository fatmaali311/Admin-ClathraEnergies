import React from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box,
  IconButton, Button, Typography, CircularProgress
} from "@mui/material";
import ResourceTable from '../Common/ResourceTable';
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { getAdminImageUrl } from '../../lib/mediaUtils';
import { PRIMARY_COLOR } from '../Common/styles';
import ConfirmDialog from '../Common/ConfirmDialog';
import { useState } from 'react';
import { getLocalizedValue } from "../../lib/apiUtils";

export default function ServicesTable({
  resource,
  onView,
  onEdit,
  onDelete,
  onAdd,
  addLabel = "Create New Service"
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const handleDeleteClick = (svc) => {
    setToDelete(svc);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setConfirmOpen(false);
    if (toDelete) onDelete(toDelete.title);
    setToDelete(null);
  };
  const getServiceField = (service, path, defaultValue = 'N/A') => {
    const val = path.split('.').reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : null, service);
    return getLocalizedValue(val) || defaultValue;
  };

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (r) => {
        const imageUrl = getServiceField(r, 'data.images.service-image', '');
        return imageUrl ? (
          <div style={{ width: '60px', height: '60px', position: 'relative' }}>
            <img
              src={getAdminImageUrl(imageUrl)}
              alt={`${r.title} service`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}
            />
          </div>
        ) : (
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '8px',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #e0e0e0'
            }}
          >
            <Typography variant="caption" color="textSecondary">
              No Image
            </Typography>
          </div>
        );
      }
    },
    {
      key: 'title',
      label: 'Title',
      render: (r) => getLocalizedValue(r.title)
    },
    {
      key: 'subtitle',
      label: 'Sub Title',
      render: (r) => getServiceField(r, 'data.serviceObj.sub_title', 'N/A'),
      className: 'hide-xs-sm'
    },
    {
      key: 'color',
      label: 'Theme Color',
      className: 'hide-xs-lg',
      render: (r) => {
        const color = getServiceField(r, 'data.serviceObj.main_color', '#ADD0B3');
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '4px',
              backgroundColor: color,
              border: '1px solid #e0e0e0'
            }} />
            <span>{color}</span>
          </div>
        );
      }
    },
  ];

  return (
    <>
      <ResourceTable
        resource={resource}
        columns={columns}
        onAdd={onAdd}
        addLabel={addLabel}
        renderRow={(row) => (
          <>
            <IconButton color="primary" size="small" onClick={() => onView(row)} aria-label={`View ${getLocalizedValue(row.title)}`} sx={{ mx: 0.5 }}>
              <Visibility fontSize="small" />
            </IconButton>
            <IconButton color="secondary" size="small" onClick={() => onEdit(row)} aria-label={`Edit ${getLocalizedValue(row.title)}`} sx={{ mx: 0.5 }}>
              <Edit fontSize="small" />
            </IconButton>
            <IconButton color="error" size="small" onClick={() => handleDeleteClick(row)} aria-label={`Delete ${getLocalizedValue(row.title)}`} sx={{ mx: 0.5 }}>
              <Delete fontSize="small" />
            </IconButton>
          </>
        )}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Service"
        message={toDelete ? `Are you sure you want to delete "${getLocalizedValue(toDelete.title)}"? This action cannot be undone.` : 'Are you sure?'}
        confirmLabel="Delete"
        loading={false}
        isDanger={true}
      />
    </>
  );
}