import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext"; 
import { updateContactReadStatus } from "../../services/contactService"; 
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog,
  DialogTitle, DialogContent, DialogActions, IconButton, Button, Typography, Box,
  CircularProgress, 
} from "@mui/material";
import { ManagedTable } from '../Common';
import { Visibility, Close as CloseIcon, MarkEmailRead, MarkEmailUnread, Refresh as RefreshIcon } from "@mui/icons-material"; 
import { PRIMARY_COLOR, HOVER_COLOR } from '../Common/styles';

// Reusable component to apply styling based on read status 
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


export default function ContactTable({ contacts, loading, refetchContacts }) {
  const { token } = useAuth(); 
  const [selectedContact, setSelectedContact] = useState(null);
  const [updateLoadingId, setUpdateLoadingId] = useState(null); 

  // Helper function to render a detail row in the modal 
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

  // Handler for marking read/unread status 
  const handleToggleReadStatus = async (contactId, currentStatus) => {
    if (!token) return;

    setUpdateLoadingId(contactId);
    const newStatus = !currentStatus;

    const result = await updateContactReadStatus(token, contactId, newStatus);
    
    if (result) {
      refetchContacts(); 
      
      if (selectedContact && selectedContact._id === contactId) {
          setSelectedContact(prev => ({ ...prev, isRead: newStatus }));
      }
    }
    
    setUpdateLoadingId(null);
  };
  
  // Handler for opening the modal. Should mark as read if currently unread. 
  const handleViewContact = async (contact) => {
    // Open modal to view contact details. Do NOT auto-toggle read status here.
    // The user can explicitly mark Read/Unread using the button in the modal.
    setSelectedContact(contact);
  };

  if (loading) {
    return (
      <Box 
        className="text-center p-10 bg-white rounded-xl shadow-md" 
        sx={{ color: PRIMARY_COLOR, borderRadius: "12px" }}
      >
        <CircularProgress color="inherit" size={24} sx={{ mr: 2 }} />
        <Typography component="span">Loading submissions...</Typography>
      </Box>
    );
  }

  return (
    <>
      <ManagedTable
        columns={[
          { key: 'status', label: 'Status', render: (r) => (
            updateLoadingId === r._id ? (<CircularProgress size={20} color="primary" />) : (
              <IconButton size="small" onClick={() => handleToggleReadStatus(r._id, r.isRead)} aria-label={r.isRead ? 'Mark as unread' : 'Mark as read'}>
                {r.isRead ? <MarkEmailRead color="success" fontSize="small" /> : <MarkEmailUnread color="error" fontSize="small" />}
              </IconButton>
            )
          )},
          { key: 'fullName', label: 'Full Name', render: (r) => r.fullName },
          { key: 'email', label: 'Email', render: (r) => r.email },
          { key: 'organization', label: 'Organization', className: 'hidden sm:table-cell', render: (r) => r.organization || 'N/A' },
          { key: 'interest', label: 'Interest', className: 'hidden md:table-cell', render: (r) => r.areaOfInterest || 'N/A' },
          { key: 'submitted', label: 'Submitted At', className: 'hidden sm:table-cell', render: (r) => new Date(r.createdAt).toLocaleString() },
        ]}
        rows={contacts}
        loading={loading}
        onRefresh={refetchContacts}
        customHeader={(
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
            <Button
              onClick={refetchContacts}
              startIcon={<RefreshIcon />}
              variant="outlined"
              disabled={loading}
              sx={{
                color: PRIMARY_COLOR,
                borderColor: PRIMARY_COLOR,
                "&:hover": { borderColor: HOVER_COLOR, bgcolor: 'gray.50' },
                px: 3,
                py: 1,
              }}
            >
              Refresh List
            </Button>
          </Box>
        )}
        renderRow={(row) => (
          <IconButton color="primary" size="small" onClick={() => handleViewContact(row)} aria-label={`View details for ${row.fullName}`}>
            <Visibility fontSize="small" />
          </IconButton>
        )}
        getRowSx={(r) => ({ backgroundColor: r.isRead ? 'inherit' : '#FFFBE6' })}
        renderEmpty={() => (
          <div className="text-center py-8 text-lg text-gray-500 bg-white rounded-b-xl">
            <p>No submissions found 😔</p>
          </div>
        )}
      />

  {/*  Modal (Dialog)  */}
      <Dialog
        open={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          className: "rounded-2xl shadow-2xl border-t-4 border-blue-500 overflow-hidden",
          sx: { borderTopColor: PRIMARY_COLOR }
        }}
      >
        <DialogTitle className="flex justify-between items-center p-6" sx={{ backgroundColor: PRIMARY_COLOR }}>
          <Typography variant="h5" component="div" className="font-bold text-white">
            Contact Details
          </Typography>
          <IconButton 
            aria-label="close"
            onClick={() => setSelectedContact(null)}
            size="medium"
            className="text-white hover:text-gray-200"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers className="bg-gray-50 p-6">
          {selectedContact && (
            <div className="space-y-4">
              <Box className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <DetailRow label="Status" value={<ReadStatusIndicator isRead={selectedContact.isRead} />} />
                <DetailRow label="Full Name" value={selectedContact.fullName} />
                <DetailRow label="Email" value={selectedContact.email} />
                <DetailRow label="Organization" value={selectedContact.organization} />
                <DetailRow label="Area of Interest" value={selectedContact.areaOfInterest} />
                <DetailRow label="Representation" value={selectedContact.representation} />
                <DetailRow label="Submitted At" value={new Date(selectedContact.createdAt).toLocaleString()} />
              </Box>
              <Box className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <DetailRow label="Message" value={selectedContact.message} isMessage={true} />
              </Box>
            </div>
          )}
        </DialogContent>
        <DialogActions className="p-4 border-t border-gray-200 justify-center bg-white">
            {selectedContact && (
        <Button
          onClick={() => handleToggleReadStatus(selectedContact._id, selectedContact.isRead)}
          variant="outlined"
          size="large"
          disabled={updateLoadingId === selectedContact._id}
          startIcon={selectedContact.isRead ? <MarkEmailUnread /> : <MarkEmailRead />}
          sx={{
            borderColor: PRIMARY_COLOR,
            color: PRIMARY_COLOR,
            '&:hover': { borderColor: HOVER_COLOR, color: HOVER_COLOR },
            marginRight: '1rem',
            position: 'relative',
          }}
        >
          {selectedContact.isRead ? 'Mark as Unread' : 'Mark as Read'}
          {updateLoadingId === selectedContact._id && (
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
            )}
          <Button
            onClick={() => setSelectedContact(null)}
            variant="contained"
            size="large"
            className="rounded-full px-8 py-2 text-white font-semibold shadow-md hover:shadow-lg transition duration-200"
            sx={{
              backgroundColor: PRIMARY_COLOR,
              "&:hover": { backgroundColor: HOVER_COLOR },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}