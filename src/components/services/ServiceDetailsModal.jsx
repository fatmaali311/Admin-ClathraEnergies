import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import { Close as CloseIcon, MiscellaneousServices as ServiceIcon } from '@mui/icons-material';

const PRIMARY_COLOR = '#ADD0B3';
const HOVER_COLOR = '#8CB190';

// Reusable Row Component
const DetailRow = ({ label, value, isFullWidth = false, isContent = false }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: isFullWidth || isContent ? 'column' : 'row',
      justifyContent: isFullWidth ? 'flex-start' : 'space-between',
      py: 1.5,
      borderBottom: '1px solid #eee',
    }}
  >
    <Typography variant="body1" sx={{ fontWeight: 'bold', color: PRIMARY_COLOR, minWidth: '150px' }}>
      {label}:
    </Typography>
    <Typography
      variant="body1"
      sx={{
        color: '#4A4A4A',
        mt: isFullWidth || isContent ? 1 : 0,
        whiteSpace: isContent ? 'pre-wrap' : 'normal',
      }}
    >
      {value || 'N/A'}
    </Typography>
  </Box>
);

// Button Info Section
const ButtonDetails = ({ button, label }) => (
  <Box
    sx={{
      p: 2,
      mb: 2,
      bgcolor: '#F7F7F7',
      borderRadius: '8px',
      border: '1px solid #E0E0E0',
    }}
  >
    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: PRIMARY_COLOR, mb: 1 }}>
      {label}
    </Typography>
    <Typography variant="body2">
      <strong>Name:</strong> {button?.name || 'N/A'}
    </Typography>
    <Typography variant="body2">
      <strong>Link:</strong> {button?.link || 'N/A'}
    </Typography>
  </Box>
);

// Image Section
const ImagesSection = ({ images }) => (
  <Box sx={{ mt: 2 }}>
    <Typography variant="h6" sx={{ color: PRIMARY_COLOR, mb: 2 }}>
      Images
    </Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {Object.entries(images || {}).map(([key, url]) =>
        url ? (
          <Box key={key} sx={{ textAlign: 'center', width: { xs: '100%', sm: '200px' } }}>
            <img
              src={url}
              alt={key}
              style={{
                width: '100%',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            />
            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#666' }}>
              {key}
            </Typography>
          </Box>
        ) : null
      )}
      {Object.keys(images || {}).length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No images available
        </Typography>
      )}
    </Box>
  </Box>
);

// Main Component
export default function ServiceDetailsModal({ service, onClose }) {
  if (!service) return null;

  const {
    data: { serviceObj, images } = {},
    title,
    _id
  } = service;

  const { main_color, sub_title, paragraph, details, main_button} = serviceObj || {};

  return (
    <Dialog
      open={!!service}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderTop: `4px solid ${PRIMARY_COLOR}`,
          borderRadius: '12px',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          backgroundColor: PRIMARY_COLOR,
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <ServiceIcon />
          <Typography variant="h5" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="medium" sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Body */}
      <DialogContent dividers sx={{ backgroundColor: '#F9F9F9', p: 4 }}>
        {/* Basic Info */}
        <Box sx={{ bgcolor: 'white', p: 4, borderRadius: '12px', boxShadow: 3 }}>
          <Typography
            variant="h6"
            sx={{
              color: PRIMARY_COLOR,
              mb: 2,
              borderBottom: '2px solid #eee',
              pb: 1,
            }}
          >
            Basic Information
          </Typography>
          <DetailRow label="ID" value={_id} />
          <DetailRow label="Title/Slug" value={title} />
          <DetailRow label="Main Color" value={main_color} />
          <DetailRow label="Sub Title" value={sub_title} />
      
        </Box>

        {/* Paragraph */}
        {paragraph && (
          <Box sx={{ mt: 3, bgcolor: 'white', p: 4, borderRadius: '12px', boxShadow: 3 }}>
            <Typography
              variant="h6"
              sx={{ color: PRIMARY_COLOR, mb: 2, borderBottom: '2px solid #eee', pb: 1 }}
            >
              Main Paragraph
            </Typography>
            <DetailRow label="Content" value={paragraph} isFullWidth isContent />
          </Box>
        )}

        {/* Details Section */}
        <Box sx={{ mt: 3, bgcolor: 'white', p: 4, borderRadius: '12px', boxShadow: 3 }}>
          <Typography
            variant="h6"
            sx={{ color: PRIMARY_COLOR, mb: 2, borderBottom: '2px solid #eee', pb: 1 }}
          >
            Details Sections ({details?.length || 0})
          </Typography>

          {details?.length > 0 ? (
            details.map((item, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: '#F7F7F7',
                  borderRadius: '8px',
                  border: '1px solid #E0E0E0',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: PRIMARY_COLOR }}>
                  Detail {index + 1}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  <strong>Title:</strong> {item.title || 'N/A'}
                </Typography>
                {item.icon && (
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    <strong>Icon:</strong> {item.icon}
                  </Typography>
                )}
                {Object.values(item.points || {}).map(
                  (point, i) =>
                    point && (
                      <Typography key={i} variant="body2" sx={{ ml: 2, mt: 0.5 }}>
                        • {point}
                      </Typography>
                    )
                )}
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No details available
            </Typography>
          )}
        </Box>

        {/* Buttons */}
        <Box sx={{ mt: 3, bgcolor: 'white', p: 4, borderRadius: '12px', boxShadow: 3 }}>
          <Typography
            variant="h6"
            sx={{ color: PRIMARY_COLOR, mb: 2, borderBottom: '2px solid #eee', pb: 1 }}
          >
            Action Buttons
          </Typography>
          <ButtonDetails button={main_button} label="Main Service Button" />
         =
        </Box>

        {/* Images */}
        <Box sx={{ mt: 3, bgcolor: 'white', p: 4, borderRadius: '12px', boxShadow: 3 }}>
          <ImagesSection images={images} />
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ p: 3, justifyContent: 'center', backgroundColor: 'white' }}>
        <Button
          onClick={onClose}
          variant="contained"
          size="large"
          sx={{
            backgroundColor: PRIMARY_COLOR,
            '&:hover': { backgroundColor: HOVER_COLOR },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
