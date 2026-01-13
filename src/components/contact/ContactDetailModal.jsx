import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { MarkEmailRead, MarkEmailUnread } from '@mui/icons-material';
import ReusableModal, { ModalButton } from '../ui/ReusableModal';
import { PRIMARY_COLOR, HOVER_COLOR } from '../Common/styles';

const ReadStatusIndicator = ({ isRead }) => (
  <Box
    display="flex"
    alignItems="center"
    gap={0.5}
    sx={{
      color: isRead ? 'success.main' : 'error.main',
      fontWeight: 'bold',
      fontSize: '0.8rem'
    }}
  >
    {isRead ? <MarkEmailRead fontSize="inherit" /> : <MarkEmailUnread fontSize="inherit" />}
    {isRead ? 'Read' : 'Unread'}
  </Box>
);

const DetailRow = ({ label, value, isMessage = false }) => (
  <Box className={`flex ${isMessage ? 'flex-col' : 'justify-between'} py-2 border-b border-gray-200 last:border-b-0`}>
    <Typography variant="body1" className="font-semibold text-gray-600 w-1/3 min-w-max">
      {label}:
    </Typography>
    <Typography
      variant="body1"
      className={`text-gray-800 ${isMessage ? 'mt-2 bg-gray-100 p-3 rounded-lg shadow-inner w-full' : 'w-2/3 text-right break-words'}`}
      component={isMessage ? 'div' : 'span'}
    >
      {value || 'N/A'}
    </Typography>
  </Box>
);

export default function ContactDetailModal({ contact, onClose, onToggleReadStatus, isUpdating }) {
  if (!contact) return null;

  const actions = (
    <>
      <Button
        onClick={() => onToggleReadStatus(contact._id, contact.isRead)}
        variant="outlined"
        disabled={isUpdating}
        startIcon={contact.isRead ? <MarkEmailUnread /> : <MarkEmailRead />}
        sx={{
          borderColor: PRIMARY_COLOR,
          color: PRIMARY_COLOR,
          '&:hover': { borderColor: HOVER_COLOR, color: HOVER_COLOR },
          marginRight: 'auto', // Push to left
          position: 'relative',
        }}
      >
        {contact.isRead ? 'Mark as Unread' : 'Mark as Read'}
        {isUpdating && (
          <CircularProgress
            size={24}
            sx={{
              color: PRIMARY_COLOR,
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Button>
      <ModalButton onClick={onClose} variant="contained" size="large">
        Close
      </ModalButton>
    </>
  );

  return (
    <ReusableModal
      open={!!contact}
      onClose={onClose}
      title="Contact Details"
      actions={actions}
      fullWidth
      maxWidth="sm"
    >
      <div className="space-y-4">
        <Box className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <DetailRow label="Status" value={<ReadStatusIndicator isRead={contact.isRead} />} />
          <DetailRow label="Full Name" value={contact.fullName} />
          <DetailRow label="Email" value={contact.email} />
          <DetailRow label="Organization" value={contact.organization} />
          <DetailRow label="Area of Interest" value={contact.areaOfInterest} />
          <DetailRow label="Representation" value={contact.representation} />
          <DetailRow label="Submitted At" value={new Date(contact.createdAt).toLocaleString()} />
        </Box>
        <Box className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <DetailRow label="Message" value={contact.message} isMessage={true} />
        </Box>
      </div>
    </ReusableModal>
  );
}
