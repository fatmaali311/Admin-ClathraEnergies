import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { PRIMARY_COLOR } from './styles'; // Assuming styles exports PRIMARY_COLOR
import { getLocalizedValue } from '../../lib/apiUtils';

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirm',
  message = '',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  isDanger = false
}) {
  const handleClose = () => {
    if (!loading && onClose) {
      onClose(false);
    }
  };

  const safeTitle = getLocalizedValue(title);
  const safeMessage = getLocalizedValue(message);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          padding: 1,
          minWidth: '320px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: isDanger ? 'error.main' : 'text.primary' }}>
        {isDanger && <WarningIcon color="error" />}
        {safeTitle}
      </DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        <Typography variant="body1" color="text.secondary">
          {safeMessage}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          color="inherit"
          sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          color={isDanger ? "error" : "primary"}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            boxShadow: 'none',
            bgcolor: !isDanger ? PRIMARY_COLOR : undefined,
            '&:hover': {
              bgcolor: !isDanger ? PRIMARY_COLOR : undefined,
              opacity: 0.9
            }
          }}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? 'Processing...' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
