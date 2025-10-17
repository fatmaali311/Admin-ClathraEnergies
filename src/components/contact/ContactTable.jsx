import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext"; // Import useAuth to get token
import { updateContactReadStatus } from "../../services/contactService"; // Import update API
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog,
  DialogTitle, DialogContent, DialogActions, IconButton, Button, Typography, Box,
  CircularProgress, 
} from "@mui/material";
import { Visibility, Close as CloseIcon, MarkEmailRead, MarkEmailUnread, Refresh as RefreshIcon } from "@mui/icons-material"; // Import RefreshIcon

// --- Constants (Matching UserManagement.jsx) ---
const PRIMARY_COLOR = "#ADD0B3";
const HOVER_COLOR = "#8CB190";

// Reusable component to apply styling based on read status (No change)
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

  // Helper function to render a detail row in the modal (No change)
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

  // Handler for marking read/unread status (No change)
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
  
  // Handler for opening the modal. Should mark as read if currently unread. (No change)
  const handleViewContact = async (contact) => {
      setSelectedContact(contact);
      
      if (!contact.isRead) {
          await handleToggleReadStatus(contact._id, false);
      }
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
      {/* --- Contact Table --- */}
      <TableContainer 
        component={Paper} 
        elevation={3} 
        sx={{ borderRadius: "12px" }}
      >
        {/* --- Refresh Button --- */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
            <Button
              onClick={refetchContacts}
              startIcon={<RefreshIcon />}
              variant="outlined"
              disabled={loading} // Disable refresh while loading data
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
        
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: PRIMARY_COLOR,
                "& th": { color: "white", fontWeight: "bold" },
              }}
            >
              <TableCell>Status</TableCell> 
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell className="hidden sm:table-cell">Organization</TableCell>
              <TableCell className="hidden md:table-cell">Interest</TableCell>
              <TableCell className="hidden sm:table-cell">Submitted At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((row) => {
              const rowUpdateLoading = updateLoadingId === row._id;
              
              return (
                <TableRow 
                  key={row._id} 
                  hover 
                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                  sx={{ backgroundColor: row.isRead ? 'inherit' : '#FFFBE6' }}
                >
                  {/* Status Cell */}
                  <TableCell>
                    {rowUpdateLoading ? (
                      <CircularProgress size={20} color="primary" />
                    ) : (
                      <IconButton
                          size="small"
                          onClick={() => handleToggleReadStatus(row._id, row.isRead)}
                          disabled={rowUpdateLoading}
                          aria-label={row.isRead ? 'Mark as unread' : 'Mark as read'}
                      >
                          {row.isRead ? 
                            <MarkEmailRead color="success" fontSize="small" /> : 
                            <MarkEmailUnread color="error" fontSize="small" />
                          }
                      </IconButton>
                    )}
                  </TableCell>
                  
                  <TableCell className="font-medium text-gray-900">{row.fullName}</TableCell>
                  <TableCell className="text-gray-600">{row.email}</TableCell>
                  <TableCell className="text-gray-600 hidden sm:table-cell">{row.organization || 'N/A'}</TableCell>
                  <TableCell className="text-gray-600 hidden md:table-cell">{row.areaOfInterest || 'N/A'}</TableCell>
                  <TableCell className="text-gray-600 text-xs hidden sm:table-cell">
                    {new Date(row.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleViewContact(row)} 
                      aria-label={`View details for ${row.fullName}`}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {contacts.length === 0 && (
          <div className="text-center py-8 text-lg text-gray-500 bg-white rounded-b-xl">
            <p>No submissions found 😔</p>
          </div>
        )}
      </TableContainer>

      {/* --- Modal (Dialog) - No Change --- */}
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