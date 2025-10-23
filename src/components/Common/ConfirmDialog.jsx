import React from 'react';
import { PRIMARY_COLOR, HOVER_COLOR } from './styles';

export function ConfirmDialog({ open, onClose, onConfirm, title = 'Confirm', message = '', confirmLabel = 'Confirm', cancelLabel = 'Cancel', loading = false }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => onClose(false)}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => onClose(false)} className="px-4 py-2 rounded-lg" style={{ background: '#F3F4F6', color: '#374151' }}>{cancelLabel}</button>
          <button onClick={onConfirm} disabled={loading} className="px-4 py-2 rounded-lg" style={{ background: PRIMARY_COLOR, color: 'white' }}>
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
