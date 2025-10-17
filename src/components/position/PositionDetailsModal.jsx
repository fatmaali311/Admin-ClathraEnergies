import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, IconButton, Typography
} from '@mui/material';
import { Close as CloseIcon, Work as WorkIcon } from '@mui/icons-material';

const PRIMARY_COLOR = "#ADD0B3";
const HOVER_COLOR = "#8CB190";

// Helper component for detail rows
const DetailRow = ({ label, value, isFullWidth = false }) => (
    <Box sx={{ 
        display: 'flex', 
        flexDirection: isFullWidth ? 'column' : 'row', 
        justifyContent: isFullWidth ? 'flex-start' : 'space-between',
        py: 1.5, 
        borderBottom: '1px solid #eee' 
    }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: PRIMARY_COLOR, minWidth: '150px' }}>
            {label}:
        </Typography>
        <Typography variant="body1" sx={{ color: '#4A4A4A', mt: isFullWidth ? 1 : 0 }}>
            {value || 'N/A'}
        </Typography>
    </Box>
);

export default function PositionDetailsModal({ open, onClose, position }) {
  if (!position) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md"
        PaperProps={{ sx: { borderTop: `4px solid ${PRIMARY_COLOR}`, borderRadius: '12px' } }}>
      
      <DialogTitle sx={{ backgroundColor: PRIMARY_COLOR, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box display="flex" alignItems="center" gap={1}>
            <WorkIcon />
            <Typography variant="h5" fontWeight="bold">{position.name} ({position.type})</Typography>
        </Box>
        <IconButton onClick={onClose} size="medium" sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ backgroundColor: '#F9F9F9', p: 4 }}>
        <Box sx={{ bgcolor: 'white', p: 4, borderRadius: '12px', boxShadow: 3 }}>
            <DetailRow label="Location" value={position.location} />
            <DetailRow label="Date Posted" value={position.createdAt ? new Date(position.createdAt).toLocaleDateString() : 'N/A'} />
        </Box>

        <Box sx={{ mt: 3, bgcolor: 'white', p: 4, borderRadius: '12px', boxShadow: 3 }}>
            <Typography variant="h6" sx={{ color: PRIMARY_COLOR, mb: 2, borderBottom: '2px solid #eee' }}>Details</Typography>
            
            <DetailRow label="What We Offer" value={position.whatWeOffer} isFullWidth />
            <DetailRow label="Why We're Looking" value={position.whyWeAreLooking} isFullWidth />
            <DetailRow label="Responsibilities" value={position.responsibilities} isFullWidth />
            <DetailRow label="Skills Required" value={position.skills} isFullWidth />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: 'center', backgroundColor: 'white' }}>
        <Button onClick={onClose} variant="contained" size="large"
          sx={{ backgroundColor: PRIMARY_COLOR, '&:hover': { backgroundColor: HOVER_COLOR } }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}