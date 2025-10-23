import React from 'react';
import BaseModal from './BaseModal';
import { PRIMARY_COLOR, HOVER_COLOR } from './styles';

/**
 * ActionModal - generic modal for confirm / resend / delete flows
 * props: open, onClose, onConfirm, title, message, confirmLabel, cancelLabel, loading, confirmColor
 */
export default function ActionModal({ open, onClose, onConfirm, title = '', message = '', confirmLabel = 'Confirm', cancelLabel = 'Cancel', loading = false, confirmColor = 'red' }) {
  const actions = (
    <>
      <button onClick={() => onClose(false)} disabled={loading} style={{ padding: '10px 14px', borderRadius: 8, background: '#F3F4F6', color: '#374151' }} className="disabled:opacity-50">{cancelLabel}</button>
      <button onClick={onConfirm} disabled={loading} style={{ padding: '10px 14px', borderRadius: 8, background: confirmColor === 'red' ? '#ef4444' : PRIMARY_COLOR, color: 'white', display: 'flex', alignItems: 'center' }} className="disabled:opacity-60">
        {loading ? (
          <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        ) : confirmLabel}
      </button>
    </>
  );

  return (
    <BaseModal open={!!open} onClose={() => onClose(false)} title={title} actions={actions}>
      <p className="text-gray-600 mb-6">{message}</p>
    </BaseModal>
  );
}
