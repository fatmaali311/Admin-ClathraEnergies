import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Typography, Box, IconButton, 
  Stepper, Step, StepLabel, LinearProgress, Paper, 
  Chip, Grid 
} from '@mui/material';
import { 
  Close as CloseIcon, 
  ChevronLeft, ChevronRight, 
  AddCircleOutline, DeleteOutline,
  Add as AddIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';
import { useServices } from '../../hooks/useServices';
import { useToast } from '../../hooks/useToast';
import { toServiceFormData } from '../../services/servicesApi';

// --- Constants ---
const PRIMARY_COLOR = "#ADD0B3";
const HOVER_COLOR = "#8CB190";

const initialServiceState = {
  title: '',
  data: {
    serviceObj: {
      main_color: '#ADD0B3',
      sub_title: '',
      paragraph: '',
      details: [{ 
        title: '', 
        icon: '', // FontAwesome class or image key
        points: { point1: '', point2: '', point3: '' } 
      }],
      main_button: { name: 'Learn More', link: '/services' },
      home_button: { name: 'Explore Now', link: '/home' },
    },
    images: {},
  },
};

const STEPS = ['Basic Info', 'Details & Content', 'Media & Actions'];

// Ensure any incoming service object has the expected nested shape so
// components can safely read `data`, `data.serviceObj` and `data.images`.
function normalizeService(svc) {
  // deep clone base shape
  const base = JSON.parse(JSON.stringify(initialServiceState));
  if (!svc) return base;

  // shallow merge then ensure nested fields exist
  const merged = { ...base, ...svc };
  merged.data = merged.data || JSON.parse(JSON.stringify(initialServiceState.data));
  merged.data.serviceObj = merged.data.serviceObj || JSON.parse(JSON.stringify(initialServiceState.data.serviceObj));
  merged.data.images = merged.data.images || {};
  // ensure title exists
  merged.title = merged.title || '';
  return merged;
}

export default function ServiceForm({ service, onClose }) {
  const isEdit = !!service;
  const { saveService, loading: saving, error: saveError, setError: setHookError } = useServices();
  const { showToast } = useToast();

  const [formData, setFormData] = useState(() => normalizeService(service));
  const [files, setFiles] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [localError, setLocalError] = useState('');
  // detail icons will be image uploads only (stored under data.images with a file-key)

  useEffect(() => {
    setFormData(normalizeService(service));
  }, [service]);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleTextChange = (e, path, index, subKey) => {
    const value = e.target.value;
    
    if (path === 'title') {
      setFormData(prev => ({ ...prev, title: value }));
      return;
    }
    
    setFormData(prev => {
      let newState = JSON.parse(JSON.stringify(prev));
      const obj = newState.data.serviceObj;

      if (path === 'details') {
        if (subKey === 'point') {
          const pointNum = e.target.name.match(/point(\d+)/)?.[1];
          if (pointNum) {
            obj.details[index].points[`point${pointNum}`] = value;
          }
        } else {
          obj.details[index][subKey] = value;
        }
      } else if (path === 'button') {
        const buttonKey = index === 0 ? 'main_button' : 'home_button';
        obj[buttonKey][subKey] = value;
      } else {
        obj[path] = value;
      }
      return newState;
    });
  };

  const handleFileChange = (e, fileKey) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      setFiles(prev => ({ ...prev, [fileKey]: file }));
      
      setFormData(prev => {
        const newState = JSON.parse(JSON.stringify(prev));
        newState.data.images[fileKey] = URL.createObjectURL(file);
        return newState;
      });
    }
  };

  const handleAddDetail = () => {
    setFormData(prev => {
      const newState = JSON.parse(JSON.stringify(prev));
      newState.data.serviceObj.details.push({ 
        title: '', 
        icon: '',
        points: { point1: '', point2: '', point3: '' } 
      });
      return newState;
    });
  };

  const handleDeleteDetail = (index) => {
    setFormData(prev => {
      const newState = JSON.parse(JSON.stringify(prev));
      newState.data.serviceObj.details.splice(index, 1);
      return newState;
    });
    // icons are stored under data.images keyed by fileKey; we just remove the detail
  };

  const handleAddPoint = (detailIndex) => {
    setFormData(prev => {
      const newState = JSON.parse(JSON.stringify(prev));
      const points = newState.data.serviceObj.details[detailIndex].points;
      const nextPointNum = Object.keys(points).length + 1;
      if (nextPointNum <= 10) { // Limit to 10 points max
        points[`point${nextPointNum}`] = '';
      }
      return newState;
    });
  };

  const handleRemovePoint = (detailIndex, pointKey) => {
    setFormData(prev => {
      const newState = JSON.parse(JSON.stringify(prev));
      delete newState.data.serviceObj.details[detailIndex].points[pointKey];
      return newState;
    });
  };

  const validateStep = () => {
    setLocalError('');
    if (activeStep === 0 && !formData.title.trim()) {
      setLocalError('Service Title is required.');
      return false;
    }
    if (activeStep === 1) {
      const hasValidDetails = (formData?.data?.serviceObj?.details || []).every(detail => 
          detail.title?.trim() && Object.values(detail.points || {}).some(p => p?.trim())
        );
      if (!hasValidDetails) {
        setLocalError('All detail sections must have a title and at least one point with content.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setLocalError('');
    setHookError('');

    try {
  const serviceObj = formData?.data?.serviceObj || initialServiceState.data.serviceObj;
      const finalServiceJson = {
        title: formData.title,
        ...serviceObj,
      };

      const payload = toServiceFormData(finalServiceJson, files);
      await saveService(payload);
      showToast(isEdit ? 'Service updated successfully' : 'Service created successfully', 'success');
      onClose();
    } catch (err) {
      const msg = err?.message || 'Error submitting service. Please try again.';
      setLocalError(msg);
      showToast(msg, 'error');
    }
  };

  const renderStepContent = (step) => {
  const obj = formData?.data?.serviceObj || initialServiceState.data.serviceObj;

    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid sx={{ width: '100%' }}>
              <TextField
                label="Service Title (Used as unique identifier/slug)"
                name="title"
                fullWidth
                required
                value={formData.title}
                onChange={(e) => handleTextChange(e, 'title')}
                helperText={isEdit ? 'Changing the title affects the URL.' : 'Example: web-development'}
                InputProps={{ readOnly: isEdit }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: '50%' }, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'gray.700' }}>Main Color</Typography>
                <input
                  type="color"
                  value={obj.main_color}
                  onChange={(e) => handleTextChange({ target: { value: e.target.value } }, 'main_color')}
                  style={{ width: 48, height: 36, border: 'none', padding: 0, background: 'transparent', cursor: 'pointer' }}
                />
              </Box>
              <TextField
                label="Main Color (Hex Code)"
                name="main_color"
                fullWidth
                value={obj.main_color}
                onChange={(e) => handleTextChange(e, 'main_color')}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
              <TextField
                label="Sub Title"
                name="sub_title"
                fullWidth
                value={obj.sub_title}
                onChange={(e) => handleTextChange(e, 'sub_title')}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid sx={{ width: '100%' }}>
              <TextField
                label="Main Paragraph"
                name="paragraph"
                fullWidth
                multiline
                rows={4}
                value={obj.paragraph}
                onChange={(e) => handleTextChange(e, 'paragraph')}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Typography variant="h6" sx={{ color: PRIMARY_COLOR, fontWeight: 'bold' }}>
              Service Details Sections
            </Typography>
            {obj.details.map((detail, index) => {
              const serviceTitle = formData.title || 'service';
              const iconFileKey = `${serviceTitle}-details-icon-${index + 1}`;
              const iconPreview = formData?.data?.images?.[iconFileKey];
              
              return (
                <Paper key={index} elevation={2} sx={{ p: 4, borderRadius: '12px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Detail Section #{index + 1}
                    </Typography>
                    {obj.details.length > 1 && (
                      <IconButton 
                        onClick={() => handleDeleteDetail(index)} 
                        color="error"
                        aria-label="Delete detail section"
                      >
                        <DeleteOutline />
                      </IconButton>
                    )}
                  </Box>
                  
                  <TextField
                    label="Detail Title (e.g., 'Frontend Development')"
                    fullWidth
                    required
                    value={detail.title}
                    onChange={(e) => handleTextChange(e, 'details', index, 'title')}
                    sx={{ mb: 3 }}
                  />
                  
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'gray.600', fontWeight: 'medium' }}>
                    Icon Image (upload):
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id={`details-icon-${index}`}
                      type="file"
                      onChange={(e) => {
                        handleFileChange(e, iconFileKey);
                        // set reference in detail.icon to the fileKey so backend knows to look in images
                        setFormData(prev => {
                          const newState = JSON.parse(JSON.stringify(prev));
                          newState.data.serviceObj.details[index].icon = iconFileKey;
                          return newState;
                        });
                      }}
                    />
                    <label htmlFor={`details-icon-${index}`}>
                      <Button variant="contained" component="span" sx={{ backgroundColor: PRIMARY_COLOR, "&:hover": { backgroundColor: HOVER_COLOR } }}>
                        Upload Icon Image
                      </Button>
                    </label>
                    {iconPreview && (
                      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <img 
                          src={iconPreview} 
                          alt="Icon Preview" 
                          style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                        />
                        <Chip label="Icon Loaded" color="success" size="small" />
                      </Box>
                    )}
                  </Box>

                  {/* Points Management */}
                  <Typography variant="subtitle2" sx={{ mb: 2, color: 'gray.600', fontWeight: 'medium' }}>
                    Points:
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    {Object.entries(detail.points).map(([pointKey, pointValue]) => (
                      <Box key={pointKey} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <TextField
                          label={`Point ${pointKey.replace('point', '')}`}
                          name={pointKey}
                          fullWidth
                          size="small"
                          value={pointValue}
                          onChange={(e) => handleTextChange(e, 'details', index, 'point')}
                        />
                        <IconButton
                          color="error"
                          onClick={() => handleRemovePoint(index, pointKey)}
                          aria-label="Remove point"
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => handleAddPoint(index)}
                      variant="outlined"
                      size="small"
                      disabled={Object.keys(detail.points).length >= 10}
                      sx={{ color: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                    >
                      Add Point
                    </Button>
                  </Box>
                </Paper>
              );
            })}
            <Button
              startIcon={<AddCircleOutline />}
              onClick={handleAddDetail}
              variant="outlined"
              sx={{ color: PRIMARY_COLOR, borderColor: PRIMARY_COLOR, "&:hover": { borderColor: HOVER_COLOR } }}
            >
              Add Detail Section
            </Button>
          </Box>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid sx={{ width: '100%' }}>
              <Typography variant="h6" sx={{ color: PRIMARY_COLOR, fontWeight: 'bold', mb: 2 }}>
                Media Uploads
              </Typography>
              <Box sx={{ mb: 4 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="service-image-upload"
                  type="file"
                  onChange={(e) => handleFileChange(e, 'service-image')}
                />
                <label htmlFor="service-image-upload">
                  <Button 
                    variant="contained" 
                    component="span" 
                    sx={{ 
                      backgroundColor: PRIMARY_COLOR, 
                      "&:hover": { backgroundColor: HOVER_COLOR },
                      px: 3,
                      py: 1.5,
                    }}
                  >
                    Upload Main Service Image
                  </Button>
                </label>
                {formData?.data?.images?.['service-image'] && (
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip label="Main Image Loaded" color="success" size="small" />
                    <img 
                      src={formData?.data?.images?.['service-image']} 
                      alt="Service Preview" 
                      style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid sx={{ width: '100%' }}>
              <Typography variant="h6" sx={{ color: PRIMARY_COLOR, fontWeight: 'bold', mb: 2 }}>
                Action Buttons
              </Typography>
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 2 }}>
                  Main Service Button
                </Typography>
                <TextField
                  label="Button Text (e.g., 'Learn More')"
                  fullWidth
                  size="small"
                  value={obj.main_button.name}
                  onChange={(e) => handleTextChange(e, 'button', 0, 'name')}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Button Link (e.g., '/contact-us')"
                  fullWidth
                  size="small"
                  value={obj.main_button.link}
                  onChange={(e) => handleTextChange(e, 'button', 0, 'link')}
                  sx={{ mb: 2 }}
                />
              </Box>
              {/* Home Page Button removed as per admin request; main button remains */}
            </Grid>
          </Grid>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{ sx: { borderRadius: '16px', borderTop: `6px solid ${PRIMARY_COLOR}`, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}
    >
      <DialogTitle sx={{ bgcolor: 'gray.50', display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, py: 3 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'gray.800' }}>
          {isEdit ? `Edit Service: ${service?.title || ''}` : 'Create New Service'}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'gray.600' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 6, py: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {saving && <LinearProgress sx={{ mb: 3 }} />}
        
        {(localError || saveError) && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'red.50', border: '1px solid', borderColor: 'red.300', borderRadius: '8px' }}>
            <Typography color="error">
              Error: {localError || saveError}
            </Typography>
          </Box>
        )}

        <Box sx={{ minHeight: 400 }}>
          {renderStepContent(activeStep)}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 6, py: 3, justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0 || saving}
          onClick={handleBack}
          startIcon={<ChevronLeft />}
          variant="outlined"
          sx={{ 
            color: PRIMARY_COLOR, 
            borderColor: PRIMARY_COLOR, 
            "&:hover": { borderColor: HOVER_COLOR, backgroundColor: 'gray.50' },
            px: 3,
          }}
        >
          Back
        </Button>
        <Box>
          {activeStep < STEPS.length - 1 ? (
            <Button
              variant="contained"
              onClick={() => {
                if (validateStep()) handleNext();
              }}
              endIcon={<ChevronRight />}
              disabled={saving}
              sx={{ 
                backgroundColor: PRIMARY_COLOR, 
                "&:hover": { backgroundColor: HOVER_COLOR },
                px: 4,
                py: 1.5,
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={saving}
              sx={{ 
                backgroundColor: '#4CAF50', 
                "&:hover": { backgroundColor: '#388E3C' },
                px: 4,
                py: 1.5,
              }}
            >
              {saving ? 'Saving...' : (isEdit ? 'Update Service' : 'Create Service')}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}