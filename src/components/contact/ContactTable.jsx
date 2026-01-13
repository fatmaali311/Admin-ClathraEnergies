import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { updateContactReadStatus } from "../../services/contactService";
import {
  IconButton, Button, Typography, Box, CircularProgress,
} from "@mui/material";
import ResourceTable from '../Common/ResourceTable';
import { Visibility, MarkEmailRead, MarkEmailUnread } from "@mui/icons-material";
import { PRIMARY_COLOR, HOVER_COLOR } from '../Common/styles';
import ContactDetailModal from './ContactDetailModal';

export default function ContactTable({ resource }) {
  // const { token } = useAuth(); // Removed redundant token
  const { loading, refresh } = resource;
  const [selectedContact, setSelectedContact] = useState(null);
  const [updateLoadingId, setUpdateLoadingId] = useState(null);

  // Handler for marking read/unread status 
  const handleToggleReadStatus = async (contactId, currentStatus) => {
    // if (!token) return; // Removed redundant token check

    setUpdateLoadingId(contactId);
    const newStatus = !currentStatus;

    const result = await updateContactReadStatus(contactId, newStatus);

    if (result) {
      refresh();

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
      <ResourceTable
        resource={resource}
        columns={[
          {
            key: 'status', label: 'Status', render: (r) => (
              updateLoadingId === r._id ? (<CircularProgress size={20} color="primary" />) : (
                <IconButton size="small" onClick={() => handleToggleReadStatus(r._id, r.isRead)} aria-label={r.isRead ? 'Mark as unread' : 'Mark as read'}>
                  {r.isRead ? <MarkEmailRead color="success" fontSize="small" /> : <MarkEmailUnread color="error" fontSize="small" />}
                </IconButton>
              )
            )
          },
          { key: 'fullName', label: 'Full Name', render: (r) => r.fullName },
          { key: 'email', label: 'Email', render: (r) => r.email },
          { key: 'organization', label: 'Organization', className: 'hidden sm:table-cell', render: (r) => r.organization || 'N/A' },
          { key: 'interest', label: 'Interest', className: 'hidden md:table-cell', render: (r) => r.areaOfInterest || 'N/A' },
          { key: 'submitted', label: 'Submitted At', className: 'hidden sm:table-cell', render: (r) => new Date(r.createdAt).toLocaleString() },
        ]}
        renderRow={(row) => (
          <IconButton color="primary" size="small" onClick={() => handleViewContact(row)} aria-label={`View details for ${row.fullName}`}>
            <Visibility fontSize="small" />
          </IconButton>
        )}
        getRowSx={(r) => ({ backgroundColor: r.isRead ? 'inherit' : '#FFFBE6' })}
      />

      <ContactDetailModal
        contact={selectedContact}
        onClose={() => setSelectedContact(null)}
        onToggleReadStatus={handleToggleReadStatus}
        isUpdating={!!updateLoadingId}
      />
    </>
  );
}
