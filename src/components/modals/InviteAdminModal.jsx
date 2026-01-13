import React, { useState } from 'react';
import ReusableModal, { ModalButton } from '../ui/ReusableModal';
import { addAdmin } from '../../Auth/services/userService';
import { TextField } from '@mui/material';

const InviteAdminModal = ({ isOpen, onClose, onSuccess, onError }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      // userService.addAdmin returns { ok, status, data }
      const response = await addAdmin(email);
      const { ok, status, data } = response;

      if (ok) {
        onSuccess(data?.message || `Admin invitation sent to ${email}`);
        setEmail('');
        onClose();
      } else {
        if (status === 409) {
          onError('An admin with this email already exists.');
        } else {
          onError(data?.message || 'Failed to invite admin. Please try again.');
        }
      }
    } catch (err) {
      // use console here; logger can be used if desired
      console.error('Invite Admin Error:', err);
      onError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const actions = (
    <>
      <ModalButton onClick={() => onClose(false)} disabled={loading} color="secondary" variant="outlined">
        Cancel
      </ModalButton>
      <ModalButton
        onClick={handleSubmit}
        disabled={loading || !email}
        variant="contained"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Sending...
          </>
        ) : 'Send Invitation'}
      </ModalButton>
    </>
  );

  return (
    <ReusableModal open={!!isOpen} onClose={() => onClose(false)} title="Invite New Admin" actions={actions}>
      <form id="invite-admin-form" onSubmit={handleSubmit}>
        <TextField
          label="Admin Email"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          placeholder="Enter admin email"
          disabled={loading}
          variant="outlined"
          margin="normal"
        />
      </form>
    </ReusableModal>
  );
};

export default InviteAdminModal;
