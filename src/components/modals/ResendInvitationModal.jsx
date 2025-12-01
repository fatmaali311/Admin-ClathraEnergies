import ActionModal from '../../components/Common/ActionModal';

const ResendInvitationModal = ({ user, onConfirm, onCancel, isLoading }) => {
  if (!user) return null;

  return (
    <ActionModal
      open={!!user}
      onClose={onCancel}
      onConfirm={onConfirm}
      title="Resend Invitation"
      message={`Are you sure you want to resend the account setup invitation to: ${user.email}`}
      confirmLabel="Yes, Resend"
      loading={isLoading}
      confirmColor="blue"
    />
  );
};

export default ResendInvitationModal;