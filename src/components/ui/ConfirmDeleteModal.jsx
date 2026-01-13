import React from 'react';
import { Typography } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
import ReusableModal, { ModalButton } from '../ui/ReusableModal';
import { PRIMARY_COLOR } from '../Common/styles';

const DANGER_COLOR = "#DC2626";

export default function ConfirmDeleteModal({ open, onClose, onConfirm, itemType, itemName, isDeleting }) {
  const actions = (
    <>
      <ModalButton
        onClick={() => onClose(false)}
        variant="outlined"
        disabled={isDeleting}
        color="secondary"
      >
        Cancel
      </ModalButton>
      <ModalButton
        onClick={onConfirm}
        variant="contained"
        color="error" // Mui color prop but we override style
        startIcon={<DeleteForever />}
        disabled={isDeleting}
        sx={{
          bgcolor: DANGER_COLOR,
          '&:hover': { bgcolor: '#B91C1C' },
        }}
      >
        {isDeleting ? 'Deleting...' : `Delete ${itemType}`}
      </ModalButton>
    </>
  );

  return (
    <ReusableModal
      open={open}
      onClose={() => onClose(false)}
      maxWidth="sm"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DeleteForever />
          Confirm Deletion
        </div>
      }
      actions={actions}
    >
      <div style={{ textAlign: 'center', padding: '16px' }}>
        <Typography variant="h6" component="p" gutterBottom>
          Are you absolutely sure you want to delete this {itemType}?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          **{itemName}** will be permanently removed. This action cannot be undone.
        </Typography>
      </div>
    </ReusableModal>
  );
}
