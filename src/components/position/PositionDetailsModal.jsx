import React from 'react';
import { Box, Typography } from '@mui/material';
import { Work as WorkIcon } from '@mui/icons-material';
import ReusableModal, { ModalButton } from '../ui/ReusableModal';
import { PRIMARY_COLOR } from '../Common/styles';
import { getLocalizedValue } from '../../lib/apiUtils';

// Helper component for detail rows
const DetailRow = ({ label, value, isFullWidth = false }) => (
  <Box sx={{
    display: 'flex',
    flexDirection: isFullWidth ? 'column' : 'row',
    justifyContent: isFullWidth ? 'flex-start' : 'space-between',
    py: 1.5,
    borderBottom: '1px solid #eee'
  }}>
    <Typography variant="body1" sx={{ color:PRIMARY_COLOR, fontWeight: 'bold', minWidth: '150px' }}>
      {label}:
    </Typography>
    <Typography variant="body1" sx={{ color: '#4A4A4A', mt: isFullWidth ? 1 : 0 }}>
      {getLocalizedValue(value) || 'N/A'}
    </Typography>
  </Box>
);

export default function PositionDetailsModal({ open, onClose, position }) {
  if (!position) return null;

  const actions = (
    <ModalButton onClick={onClose} variant="contained" size="large">
      Close
    </ModalButton>
  );

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      title={
        <Box display="flex" alignItems="center" gap={1}>
          <WorkIcon />
          <Typography variant="h5" fontWeight="bold" component="span">
            {getLocalizedValue(position.name)} ({getLocalizedValue(position.type)})
          </Typography>
        </Box>
      }
      actions={actions}
      maxWidth="md"
      showCloseIcon={true}
    >
      <Box sx={{ bgcolor: 'white', p: 4, borderRadius: '12px', boxShadow: 3 }}>
        <DetailRow label="Location" value={position.location} />
        <DetailRow label="Date Posted" value={position.createdAt ? new Date(position.createdAt).toLocaleDateString() : 'N/A'} />
      </Box>

      <Box sx={{ mt: 3, bgcolor: 'white', p: 4, borderRadius: '12px', boxShadow: 3 }}>
        <Typography variant="h6" sx={{ color:PRIMARY_COLOR, mb: 2, borderBottom: '2px solid #eee' }}>Details</Typography>

        <DetailRow label="What We Offer" value={position.whatWeOffer} isFullWidth />
        <DetailRow label="Why We're Looking" value={position.whyWeAreLooking} isFullWidth />
        <DetailRow label="Responsibilities" value={position.responsibilities} isFullWidth />
        <DetailRow label="Skills Required" value={position.skills} isFullWidth />
      </Box>
    </ReusableModal>
  );
}
