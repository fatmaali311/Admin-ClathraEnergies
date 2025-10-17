import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, Box } from '@mui/material';
import { DeleteForever, Close as CloseIcon } from '@mui/icons-material';

const PRIMARY_COLOR = "#ADD0B3";
const DANGER_COLOR = "#DC2626"; // Red-600

export default function ConfirmDeleteModal({ open, onClose, onConfirm, itemType, itemName, isDeleting }) {
  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ 
          backgroundColor: DANGER_COLOR, 
          color: 'white', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
      }}>
        <Box display="flex" alignItems="center" gap={1}>
            <DeleteForever />
            Confirm Deletion
        </Box>
        <IconButton onClick={() => onClose(false)} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" component="p" gutterBottom>
          Are you absolutely sure you want to delete this {itemType}?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          **{itemName}** will be permanently removed. This action cannot be undone.
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
        <Button 
          onClick={() => onClose(false)} 
          variant="outlined" 
          disabled={isDeleting}
          sx={{ color: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="error" 
          startIcon={<DeleteForever />}
          disabled={isDeleting}
          sx={{ 
            backgroundColor: DANGER_COLOR, 
            '&:hover': { backgroundColor: '#B91C1C' },
            position: 'relative'
          }}
        >
          {isDeleting ? 'Deleting...' : `Delete ${itemType}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}