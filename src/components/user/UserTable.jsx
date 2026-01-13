import React, { useState } from 'react';
import ResourceTable from '../Common/ResourceTable';
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "../../contexts/AuthContext";
import DeleteConfirmationModal from "../../components/modals/DeleteConfirmationModal";
import ResendInvitationModal from "../../components/modals/ResendInvitationModal";

/**
 * UserTable
 * Uses ResourceTable to display admin users.
 * Handles row actions (Delete, Resend Invite).
 */
export default function UserTable({ resource, onResendInvite, onDeleteUser, onInviteNew }) {
    const { user: authUser } = useAuth();

    // Local state for modals handling is better kept in the page if generic, 
    // but if specific to table actions, can be here. 
    // However, UserManagement.jsx has the modals. Let's pass actions up.
    // Actually, UserManagement.jsx has the modals logic coupled with state.
    // We can let UserTable render the buttons and call the handlers passed from Page.

    const columns = [
        {
            key: 'email', label: 'Email', render: (u) => (
                <span>
                    {u.email}
                    {u.id === authUser?.id && <span className="text-xs text-gray-500 ml-2">(You)</span>}
                </span>
            )
        },
        { key: 'fullName', label: 'Name', render: (u) => u.fullName || 'N/A' },
        { key: 'userName', label: 'Username', render: (u) => u.userName || 'N/A' },
        {
            key: 'isSetupComplete', label: 'Setup Status', align: 'center', render: (u) => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${u.isSetupComplete ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                    {u.isSetupComplete ? "Complete" : "Pending"}
                </span>
            )
        },
    ];

    return (
        <ResourceTable
            resource={resource}
            columns={columns}
            onAdd={onInviteNew}
            addLabel="Invite New Admin"
            renderRow={(user) => (
                <>
                    {!user.isSetupComplete && (
                        <Tooltip title="Resend Invitation">
                            <IconButton onClick={() => onResendInvite(user)} color="primary" size="small">
                                <SendIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}

                    {user.id !== authUser?.id && (
                        <Tooltip title="Delete Admin">
                            <IconButton onClick={() => onDeleteUser(user)} sx={{ color: "#E53935" }} size="small">
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </>
            )}
        />
    );
}
