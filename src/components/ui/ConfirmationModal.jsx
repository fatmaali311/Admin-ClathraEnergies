// src/components/ui/ConfirmationModal.jsx
import React from 'react';
import Button from './Button'; // Assuming you have a Button component

const ConfirmationModal = ({ open, onClose, onConfirm, title, message }) => {
  if (!open) return null;

  return (
    // Simple overlay styling - you may need to adjust your Tailwind setup
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-end space-x-3">
          <Button 
            onClick={onClose} 
            className="bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;