// src/components/modals/DeleteConfirmationModal.jsx

import ActionModal from '../../components/Common/ActionModal';

const DeleteConfirmationModal = ({ user, onConfirm, onCancel, isLoading }) => {
  if (!user) return null;

  return (
    <ActionModal
      open={!!user}
      onClose={onCancel}
      onConfirm={onConfirm}
      title="Confirm Deletion"
      message={`Are you absolutely sure you want to delete the admin account for: ${user.email}. This action cannot be undone.`}
      confirmLabel="Yes, Delete"
      loading={isLoading}
      confirmColor="red"
    />
  );
};

export default DeleteConfirmationModal;