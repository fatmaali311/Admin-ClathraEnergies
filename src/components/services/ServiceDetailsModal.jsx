import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button, Typography, Box, Chip } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const DetailRow = ({ label, value, isContent = false, isArray = false }) => (
  <Box sx={{ 
    display: 'flex', 
    py: 2, 
    borderBottom: '1px solid', 
    borderColor: 'gray.200', 
    '&:last-child': { borderBottom: 'none' }, 
    flexDirection: isContent || isArray ? 'column' : 'row', 
    gap: 2 
  }}>
    <Typography variant="body1" sx={{ fontWeight: 'semibold', color: 'gray.600', width: { xs: '100%', sm: '30%' }, minWidth: '120px' }}>
      {label}:
    </Typography>
    <Box sx={{ 
      color: 'gray.800', 
      width: isContent || isArray ? '100%' : { xs: '100%', sm: '70%' }, 
      bgcolor: isContent ? 'gray.100' : 'transparent', 
      p: isContent ? 2 : 0, 
      borderRadius: isContent ? '8px' : 0, 
      boxShadow: isContent ? 'inset 0 1px 3px rgba(0,0,0,0.1)' : 'none',
      whiteSpace: isContent ? 'pre-wrap' : 'normal',
      textAlign: isContent ? 'left' : { xs: 'left', sm: 'right' },
    }}>
      {isArray ? (
        value?.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {value.map((item, index) => (
              <Box key={index} sx={{ p: 2, bgcolor: 'white', borderRadius: '4px', border: '1px solid', borderColor: 'gray.200' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Detail {index + 1}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Title: {item.title || 'N/A'}
                </Typography>
                {item.icon && (
                  <Typography variant="body2" sx={{ mb: 1, color: 'gray.600' }}>
                    Icon: {item.icon}
                  </Typography>
                )}
                {Object.entries(item.points || {}).map(([pointKey, pointValue]) => (
                  pointValue && (
                    <Typography key={pointKey} variant="body2" sx={{ ml: 2, color: 'gray.700' }}>
                      • {pointValue}
                    </Typography>
                  )
                ))}
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">No details available</Typography>
        )
      ) : (
        <Typography variant="body1" component={isContent ? 'div' : 'span'}>
          {value || 'N/A'}
        </Typography>
      )}
    </Box>
  </Box>
);

const ButtonDetails = ({ button, label }) => (
  <Box sx={{ p: 2, bgcolor: 'gray.50', borderRadius: '8px', border: '1px solid', borderColor: 'gray.200', mb: 2 }}>
    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'gray.800' }}>
      {label}
    </Typography>
    <Typography variant="body2"><strong>Name:</strong> {button?.name || 'N/A'}</Typography>
    <Typography variant="body2"><strong>Link:</strong> {button?.link || 'N/A'}</Typography>
  </Box>
);

const ImagesSection = ({ images, title }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'gray.800' }}>
      Images
    </Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {Object.entries(images || {}).map(([key, url]) => (
        url ? (
          <Box key={key} sx={{ textAlign: 'center', width: { xs: '100%', sm: '200px' } }}>
            <img 
              src={url} 
              alt={`${title} ${key}`} 
              style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'gray.600' }}>
              {key}
            </Typography>
          </Box>
        ) : null
      ))}
    </Box>
    {Object.keys(images || {}).length === 0 && (
      <Typography variant="body2" color="text.secondary">No images available</Typography>
    )}
  </Box>
);

export default function ServiceDetailsModal({ service, onClose, primaryColor }) {
  const open = !!service;

  if (!service) return null;

  const { data: { serviceObj, images } = {}, title, _id, createdAt, updatedAt } = service;
  const { main_color, sub_title, paragraph, details, main_button, home_button } = serviceObj || {};

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: { 
          borderRadius: '16px', 
          borderTop: `6px solid ${primaryColor}`, 
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle sx={{ bgcolor: primaryColor, display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, py: 3 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'white' }}>
          Service Details: {title}
        </Typography>
        <IconButton 
          aria-label="close"
          onClick={onClose}
          sx={{ color: 'white', '&:hover': { color: 'gray.200' } }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ bgcolor: 'gray.50', p: 6, maxHeight: '80vh', overflow: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Images Section */}
          <ImagesSection images={images} title={title} />
          
          {/* Main Image Highlight */}
          {images?.['service-image'] && (
            <Box sx={{ bgcolor: 'white', borderRadius: '12px', p: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid', borderColor: 'gray.100' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'gray.800' }}>
                Main Service Image
              </Typography>
              <img 
                src={images['service-image']} 
                alt={`${title} main image`} 
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </Box>
          )}

          {/* Basic Info */}
          <Box sx={{ bgcolor: 'white', borderRadius: '12px', p: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid', borderColor: 'gray.100' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'gray.800' }}>
              Basic Information
            </Typography>
            <DetailRow label="ID" value={_id} />
            <DetailRow label="Title/Slug" value={title} />
            <DetailRow label="Main Color" value={main_color} />
            <DetailRow label="Sub Title" value={sub_title} />
            <DetailRow label="Created At" value={createdAt ? new Date(createdAt).toLocaleString() : 'N/A'} />
            <DetailRow label="Last Updated" value={updatedAt ? new Date(updatedAt).toLocaleString() : 'N/A'} />
          </Box>

          {/* Paragraph */}
          {paragraph && (
            <Box sx={{ bgcolor: 'white', borderRadius: '12px', p: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid', borderColor: 'gray.100' }}>
              <DetailRow label="Main Paragraph" value={paragraph} isContent={true} />
            </Box>
          )}

          {/* Details Sections */}
          <Box sx={{ bgcolor: 'white', borderRadius: '12px', p: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid', borderColor: 'gray.100' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'gray.800' }}>
              Details Sections ({details?.length || 0})
            </Typography>
            <DetailRow label="All Details" value={details} isArray={true} />
          </Box>

          {/* Buttons */}
          <Box sx={{ bgcolor: 'white', borderRadius: '12px', p: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid', borderColor: 'gray.100' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'gray.800' }}>
              Action Buttons
            </Typography>
            <ButtonDetails button={main_button} label="Main Service Button" />
            <ButtonDetails button={home_button} label="Home Page Button" />
          </Box>

          {/* All Images (including detail icons) */}
          <ImagesSection images={images} title={title} />
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 4, borderTop: '1px solid', borderColor: 'gray.200', justifyContent: 'center', bgcolor: 'white' }}>
        <Button
          onClick={onClose}
          variant="contained"
          size="large"
          sx={{
            backgroundColor: primaryColor,
            "&:hover": { backgroundColor: primaryColor },
            borderRadius: '9999px',
            px: 6,
            py: 1.5,
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}