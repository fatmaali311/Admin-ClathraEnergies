import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    Button,
    useTheme,
    useMediaQuery,
    Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { PRIMARY_COLOR, HOVER_COLOR } from '../Common/styles';

/**
 * ReusableModal
 * A standardized modal component for the application.
 * 
 * Props:
 * - open: boolean
 * - onClose: function
 * - title: string
 * - children: node (content)
 * - actions: node (buttons) or null to hide actions area
 * - maxWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl' (default 'sm')
 * - fullWidth: boolean (default true)
 * - showCloseIcon: boolean (default true)
 * - loading: boolean (if true, disables actions)
 */
const ReusableModal = ({
    open,
    onClose,
    title,
    children,
    actions,
    maxWidth = 'sm',
    fullWidth = true,
    showCloseIcon = true,
    loading = false,
}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={fullScreen}
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            PaperProps={{
                sx: {
                    borderRadius: fullScreen ? 0 : '16px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    borderTop: `6px solid ${PRIMARY_COLOR}`
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    pb: 1,
                    pt: 3,
                    px: 3
                }}
            >
                <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: 'gray.800' }}>
                    {title}
                </Typography>
                {showCloseIcon && (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            color: 'gray.400',
                            '&:hover': { color: 'gray.600', bgcolor: 'gray.100' }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                )}
            </DialogTitle>

            <DialogContent dividers sx={{ p: 3, borderColor: 'gray.100' }}>
                <Box sx={{ mt: 1 }}>
                    {children}
                </Box>
            </DialogContent>

            {actions && (
                <DialogActions sx={{ p: 3, backgroundColor: 'gray.50', justifyContent: 'flex-end', gap: 1 }}>
                    {actions}
                </DialogActions>
            )}
        </Dialog>
    );
};

export default ReusableModal;

// Helper sub-components for standardized buttons
export const ModalButton = ({ children, variant = "contained", color = "primary", onClick, ...props }) => {
    const isPrimary = variant === "contained" && (color === "primary" || !color);

    const sx = isPrimary ? {
        bgcolor: PRIMARY_COLOR,
        '&:hover': { bgcolor: HOVER_COLOR },
        color: 'white',
        fontWeight: 600,
        px: 3,
        py: 1,
        borderRadius: '8px',
        textTransform: 'none',
        boxShadow: '0 4px 6px rgba(173, 208, 179, 0.4)'
    } : {
        borderColor: 'gray.300',
        color: 'gray.600',
        '&:hover': { borderColor: 'gray.400', bgcolor: 'gray.50' },
        fontWeight: 600,
        px: 3,
        py: 1,
        borderRadius: '8px',
        textTransform: 'none'
    };

    return (
        <Button variant={variant} onClick={onClick} sx={sx} {...props}>
            {children}
        </Button>
    );
};
