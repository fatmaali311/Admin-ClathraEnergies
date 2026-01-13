import React from 'react';
import ReusableModal, { ModalButton } from '../ui/ReusableModal';
import { PRIMARY_COLOR } from '../Common/styles';

/**
 * ActionModal - generic modal for confirm / resend / delete flows
 * props: open, onClose, onConfirm, title, message, confirmLabel, cancelLabel, loading, confirmColor
 */
export default function ActionModal({ open, onClose, onConfirm, title = '', message = '', confirmLabel = 'Confirm', cancelLabel = 'Cancel', loading = false, confirmColor = 'red' }) {
  const actions = (
    <>
      <ModalButton onClick={() => onClose(false)} disabled={loading} color="secondary" variant="outlined">
        {cancelLabel}
      </ModalButton>
      <ModalButton
        onClick={onConfirm}
        disabled={loading}
        variant="contained"
        sx={confirmColor === 'red' ? {
          bgcolor: '#ef4444',
          '&:hover': { bgcolor: '#dc2626' }
        } : {
          bgcolor: PRIMARY_COLOR,
          '&:hover': { bgcolor: '#8CB190' }
        }}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Processing...
          </>
        ) : confirmLabel}
      </ModalButton>
    </>
  );

  return (
    <ReusableModal open={!!open} onClose={() => onClose(false)} title={title} actions={actions}>
      <p className="text-gray-600 mb-6">{message}</p>
    </ReusableModal>
  );
}

