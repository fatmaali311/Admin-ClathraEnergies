import React from 'react';
import { getAdminImageUrl } from '../../lib/mediaUtils';
import { Box, Typography, Grid, Chip } from '@mui/material';
import { MiscellaneousServices as ServiceIcon, Info as InfoIcon, Image as ImageIcon } from '@mui/icons-material';
import ReusableModal, { ModalButton } from '../ui/ReusableModal';
import { PRIMARY_COLOR } from '../Common/styles';
import { getLocalizedValue } from '../../lib/apiUtils';

// --- Shared Sub-components ---

const SectionHeader = ({ icon: Icon, title }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, pb: 1, borderBottom: '2px solid #f0f0f0' }}>
    {Icon && <Icon sx={{ color: PRIMARY_COLOR, mr: 1 }} />}
    <Typography variant="h6" sx={{ color: PRIMARY_COLOR, fontWeight: 600 }}>
      {title}
    </Typography>
  </Box>
);

const DetailRow = ({ label, value, isFullWidth = false, isCode = false }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: isFullWidth ? 'column' : 'row',
      justifyContent: isFullWidth ? 'flex-start' : 'space-between',
      py: 1.5,
      borderBottom: '1px border-style: dashed #eee',
      '&:last-child': { borderBottom: 'none' }
    }}
  >
    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.secondary', minWidth: '140px' }}>
      {label}:
    </Typography>
    <Typography
      variant="body2"
      component="div"
      sx={{
        color: 'text.primary',
        mt: isFullWidth ? 1 : 0,
        whiteSpace: isCode ? 'pre-wrap' : 'normal',
        fontFamily: isCode ? 'monospace' : 'inherit',
        textAlign: isFullWidth ? 'left' : 'right',
        wordBreak: 'break-word'
      }}
    >
      {value || <span style={{ color: '#ccc', fontStyle: 'italic' }}>N/A</span>}
    </Typography>
  </Box>
);

const ButtonDetails = ({ button }) => {
  if (!button) return <Typography variant="body2" color="text.secondary">No button configured</Typography>;
  return (
    <Box sx={{ p: 2, bgcolor: '#fafafa', borderRadius: 2, border: '1px solid #eee' }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary">Label</Typography>
          <Typography variant="body2" fontWeight="bold">{getLocalizedValue(button.name) || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary">Link</Typography>
          <Typography variant="body2" color="primary">{button.link || 'N/A'}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

const ImagesSection = ({ images }) => {
  const imageEntries = Object.entries(images || {});
  if (imageEntries.length === 0) {
    return <Typography variant="body2" color="text.secondary" fontStyle="italic">No images available</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {imageEntries.map(([key, url]) => (
        url ? (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <Box sx={{
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 2,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.02)' }
            }}>
              <img
                src={getAdminImageUrl(url)}
                alt={key}
                style={{ width: '100%', height: '140px', objectFit: 'cover' }}
              />
              <Box sx={{ p: 1, bgcolor: '#fff', textAlign: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {key.replace(/-/g, ' ')}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ) : null
      ))}
    </Grid>
  );
};

// --- Main Component ---

export default function ServiceDetailsModal({ service, onClose }) {
  if (!service) return null;

  const {
    data: { serviceObj, images } = {},
    title,
    _id
  } = service;

  const { main_color, sub_title, paragraph, details, main_button } = serviceObj || {};


  return (
    <ReusableModal
      open={!!service}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      title={
        <Box display="flex" alignItems="center" gap={1.5}>
          <ServiceIcon sx={{ color: PRIMARY_COLOR }} />
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            {getLocalizedValue(title)}
          </Typography>
          <Chip label="Service Details" size="small" variant="outlined" sx={{ ml: 1, borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }} />
        </Box>
      }
      actions={
        <ModalButton onClick={onClose} variant="contained" color="primary">
          Close
        </ModalButton>
      }
    >
      <Box display="flex" flexDirection="column" gap={3}>

        {/* Basic Info */}
        <Box>
          <SectionHeader icon={InfoIcon} title="Basic Information" />
          <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 2, border: '1px solid #eee' }}>
            <DetailRow label="Title / Slug" value={getLocalizedValue(title)} />
            <DetailRow label="Sub Title" value={getLocalizedValue(sub_title)} />
            <DetailRow label="Main Color" value={
              main_color ? (
                <Box component="span" display="flex" alignItems="center" gap={1} justifyContent="flex-end">
                  <Box sx={{ width: 16, height: 16, bgcolor: main_color, borderRadius: 0.5, border: '1px solid #ccc' }} />
                  {main_color}
                </Box>
              ) : null
            } />
          </Box>
        </Box>

        {/* Content */}
        {paragraph && (
          <Box>
            <Typography variant="h6" sx={{ color: PRIMARY_COLOR, mb: 1, fontSize: '1rem', fontWeight: 600 }}>Description</Typography>
            <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2, border: '1px solid #eee' }}>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                {getLocalizedValue(paragraph)}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Details List */}
        <Box>
          <SectionHeader title={`Feature Details (${details?.length || 0})`} />
          {details?.length > 0 ? (
            <Grid container spacing={2}>
              {details.map((item, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Box sx={{ p: 2, height: '100%', bgcolor: '#fff', border: '1px solid #e0e0e0', borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      {getLocalizedValue(item.title) || `Detail #${index + 1}`}
                    </Typography>

                    {item.icon && (
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="caption" fontWeight="bold">Icon:</Typography>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', bgcolor: '#eee', px: 0.5, borderRadius: 0.5 }}>{item.icon}</Typography>
                      </Box>
                    )}

                    {Object.values(item.points || {}).some(p => p) && (
                      <Box component="ul" sx={{ m: 0, pl: 2.5, typography: 'caption', color: 'text.secondary' }}>
                        {Object.values(item.points || {}).map((point, i) => (
                          point ? <li key={i}>{getLocalizedValue(point)}</li> : null
                        ))}
                      </Box>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary" fontStyle="italic">No details sections.</Typography>
          )}
        </Box>

        {/* Action Button */}
        <Box>
          <SectionHeader title="Call to Action" />
          <ButtonDetails button={main_button} />
        </Box>

        {/* Images */}
        <Box>
          <SectionHeader icon={ImageIcon} title="Gallery" />
          <ImagesSection images={images} />
        </Box>

      </Box>
    </ReusableModal>
  );
}
