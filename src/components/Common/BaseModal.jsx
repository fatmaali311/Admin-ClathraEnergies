import React from 'react';

// Lightweight BaseModal using Tailwind for styling. Keeps API compatible with existing modals.
const BaseModal = ({ open, onClose, title, children, actions = null, maxWidth = 'md' }) => {
  if (!open) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }[maxWidth] || 'max-w-md';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => onClose && onClose(false)}>
      <div className={`bg-white rounded-xl shadow-xl w-full ${maxWidthClass} p-6`} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal>
        {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
        <div className="mb-4">{children}</div>
        {actions && <div className="flex justify-end gap-3">{actions}</div>}
      </div>
    </div>
  );
};

export default React.memo(BaseModal);
