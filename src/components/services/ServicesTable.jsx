import React from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box,
  IconButton, Button, Typography, CircularProgress
} from "@mui/material";
import { ManagedTable } from '../Common';
import { Visibility, Edit, Delete, Refresh as RefreshIcon } from "@mui/icons-material";
import { PRIMARY_COLOR, HOVER_COLOR } from '../Common/styles';
import ConfirmDialog from '../Common/ConfirmDialog';
import { useState } from 'react';

export default function ServicesTable({
  services,
  loading,
  error,
  onView,
  onEdit,
  onDelete,
  onRefresh
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const handleDeleteClick = (title) => {
    setToDelete(title);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setConfirmOpen(false);
    if (toDelete) onDelete(toDelete);
    setToDelete(null);
  };
  const getServiceField = (service, path, defaultValue = 'N/A') => {
    return path.split('.').reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : null, service) || defaultValue;
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
              src={imageUrl}
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
    { key: 'title', label: 'Title' },
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
    <ManagedTable
      columns={columns}
      rows={services}
      loading={loading}
      error={error}
      onRefresh={onRefresh}
      onAdd={null}
      addLabel={null}
      renderRow={(row) => (
        <>
          <IconButton color="primary" size="small" onClick={() => onView(row)} aria-label={`View ${row.title}`} sx={{ mx: 0.5 }}>
            <Visibility fontSize="small" />
          </IconButton>
          <IconButton color="secondary" size="small" onClick={() => onEdit(row)} aria-label={`Edit ${row.title}`} sx={{ mx: 0.5 }}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton color="error" size="small" onClick={() => handleDeleteClick(row.title)} aria-label={`Delete ${row.title}`} sx={{ mx: 0.5 }}>
            <Delete fontSize="small" />
          </IconButton>
        </>
      )}
      primaryColor={PRIMARY_COLOR}
    />

    <ConfirmDialog
      open={confirmOpen}
      onClose={() => setConfirmOpen(false)}
      onConfirm={handleConfirmDelete}
      title="Delete Service"
      message={toDelete ? `Are you sure you want to delete "${toDelete}"? This action cannot be undone.` : 'Are you sure?'}
      confirmLabel="Delete"
      loading={false}
    />
    </>
  );
}