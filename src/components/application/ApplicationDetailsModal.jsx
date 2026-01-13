import React from 'react';
import { Box, Typography, Chip, Button, Link } from '@mui/material';
import { Person as PersonIcon, FileDownload as FileDownloadIcon } from '@mui/icons-material';
import ReusableModal, { ModalButton } from '../ui/ReusableModal';
import { PRIMARY_COLOR } from '../Common/styles';
import { getLocalizedValue } from '../../lib/apiUtils';

// Map status to color
const statusColors = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
    contacted: 'info',
};

// Helper component for detail rows
const DetailRow = ({ label, value }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #eee' }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: PRIMARY_COLOR, minWidth: '150px' }}>
            {label}:
        </Typography>
        <Typography variant="body1" sx={{ color: '#4A4A4A', textAlign: 'right', flexGrow: 1 }}>
            {value || 'N/A'}
        </Typography>
    </Box>
);

export default function ApplicationDetailsModal({ open, onClose, application }) {
    if (!application) return null;

    const files = application.files || {};
    const fileFields = [
        { key: 'cv', label: 'CV' },
        { key: 'coverLetter', label: 'Cover Letter' },
        { key: 'employeeReference', label: 'Reference' },
        { key: 'certificate', label: 'Certificate' },
        { key: 'other', label: 'Other File' },
    ];

    const actions = (
        <ModalButton onClick={onClose} variant="contained" size="large">
            Close
        </ModalButton>
    );

    return (
        <ReusableModal
            open={open}
            onClose={onClose}
            title={
                <Box display="flex" alignItems="center" gap={1}>
                    <PersonIcon />
                    <Typography variant="h5" fontWeight="bold" component="span">
                        {application.firstName} {application.lastName}
                    </Typography>
                </Box>
            }
            actions={actions}
            maxWidth="md"
        >
            <Box sx={{ bgcolor: 'white', p: 4, borderRadius: '12px', boxShadow: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" sx={{ color: PRIMARY_COLOR }}>Application Info</Typography>
                    <Chip
                        label={application.status.toUpperCase()}
                        color={statusColors[application.status]}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                    />
                </Box>

                <DetailRow label="Email" value={application.email} />
                <DetailRow label="Phone" value={application.phone} />
                <DetailRow label="Location" value={getLocalizedValue(application.location)} />
                <DetailRow
                    label="Position"
                    value={application.position ? `${getLocalizedValue(application.position.name)}${application.position.location ? ` (${getLocalizedValue(application.position.location)})` : ''}${application.position.type ? ` — ${getLocalizedValue(application.position.type)}` : ''}` : (application.positionId ? application.positionId : 'No Position')}
                />
                <DetailRow label="Expected Salary" value={application.expectedSalary ? `$${application.expectedSalary.toLocaleString()}` : 'N/A'} />
                <DetailRow label="Available From" value={application.availableFrom ? new Date(application.availableFrom).toLocaleDateString() : 'N/A'} />
                <DetailRow label="Submitted On" value={new Date(application.createdAt).toLocaleString()} />
            </Box>

            <Box sx={{ mt: 3, bgcolor: 'white', p: 4, borderRadius: '12px', boxShadow: 3 }}>
                <Typography variant="h6" sx={{ color: PRIMARY_COLOR, mb: 2, borderBottom: '2px solid #eee' }}>
                    Application Files
                </Typography>

                <Box display="grid" gap={2} gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))">
                    {fileFields.map(field => (
                        <Box key={field.key}>
                            <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>{field.label}</Typography>
                            {files[field.key] ? (
                                <Button
                                    component={Link}
                                    href={files[field.key]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    startIcon={<FileDownloadIcon />}
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    sx={{
                                        borderColor: PRIMARY_COLOR,
                                        color: PRIMARY_COLOR,
                                        '&:hover': { opacity: 0.8 }
                                    }}
                                >
                                    Download
                                </Button>
                            ) : (
                                <Chip label="Not Provided" size="small" variant="outlined" />
                            )}
                        </Box>
                    ))}
                </Box>
            </Box>
        </ReusableModal>
    );
}
