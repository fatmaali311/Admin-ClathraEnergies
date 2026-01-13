import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, IconButton, Typography, CircularProgress,
  Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Close as CloseIcon, Save as SaveIcon, AddCircle as AddCircleIcon } from '@mui/icons-material';
import { createPosition, updatePosition } from '../../services/positionService';
import { toast } from 'react-toastify';

import LocalizedInput from '../ui/LocalizedInput';
import LocalizedTextArea from '../ui/LocalizedTextArea';

const PRIMARY_COLOR = "#ADD0B3";
const HOVER_COLOR = "#8CB190";

export default function PositionFormModal({ open, onClose, position }) {
  const isEdit = !!position;
  // Helper to ensure localized object
  const ensureLocalized = (val) => (typeof val === 'string' ? { en: val, fr: '', zh: '' } : { en: '', fr: '', zh: '', ...val });

  const [formData, setFormData] = useState({
    name: { en: '', fr: '', zh: '' },
    location: { en: '', fr: '', zh: '' },
    type: '',
    whatWeOffer: { en: '', fr: '', zh: '' },
    whyWeAreLooking: { en: '', fr: '', zh: '' },
    responsibilities: { en: '', fr: '', zh: '' },
    skills: { en: '', fr: '', zh: '' }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Effect to populate form when editing a position
  useEffect(() => {
    if (isEdit && position) {
      setFormData({
        name: ensureLocalized(position.name),
        location: ensureLocalized(position.location),
        type: position.type || '',
        whatWeOffer: ensureLocalized(position.whatWeOffer),
        whyWeAreLooking: ensureLocalized(position.whyWeAreLooking),
        responsibilities: ensureLocalized(position.responsibilities),
        skills: ensureLocalized(position.skills)
      });
    } else {
      // Reset form for creation
      setFormData({
        name: { en: '', fr: '', zh: '' },
        location: { en: '', fr: '', zh: '' },
        type: '',
        whatWeOffer: { en: '', fr: '', zh: '' },
        whyWeAreLooking: { en: '', fr: '', zh: '' },
        responsibilities: { en: '', fr: '', zh: '' },
        skills: { en: '', fr: '', zh: '' }
      });
    }
    setError('');
  }, [position, isEdit, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple validation
    if (!formData.name?.en?.trim() || !formData.location?.en?.trim() || !formData.type) {
      setError("Name, Location, and Type are required fields.");
      setLoading(false);
      return;
    }

    try {
      if (isEdit) {
        const posId = position._id || position.id || position;
        await updatePosition(posId, formData);
        toast.success(`Position "${formData.name}" updated successfully!`);
      } else {
        await createPosition(formData);
        toast.success(`Position "${formData.name}" created successfully!`);
      }
      onClose(true); // Close and signal that a refresh is needed
    } catch (err) {
      const msg = err.message.includes('Failed') ? 'Server error occurred.' : err.message;
      setError(`Operation failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose()} fullWidth maxWidth="md"
      PaperProps={{ sx: { borderTop: `4px solid ${PRIMARY_COLOR}`, borderRadius: '12px' } }}>
      <DialogTitle component="div" sx={{ backgroundColor: PRIMARY_COLOR, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold">
          {isEdit ? `Edit Position: ${position?.name}` : 'Create New Position'}
        </Typography>
        <IconButton onClick={() => onClose()} size="medium" sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ backgroundColor: 'gray.50', p: 4 }}>
          {error && <Typography color="error" gutterBottom>{error}</Typography>}

          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <LocalizedInput label="Position Name" name="name" value={formData.name} onChange={handleChange} required className="mb-0" />
            <LocalizedInput label="Location" name="location" value={formData.location} onChange={handleChange} required className="mb-0" />
            <FormControl fullWidth required>
              <InputLabel id="type-select-label">Type</InputLabel>
              <Select
                labelId="type-select-label"
                id="type-select"
                name="type"
                value={formData.type}
                label="Type"
                onChange={handleChange}
              >
                {['Full-time', 'Part-time', 'Internship', 'Freelance', 'Contract', 'Temporary'].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <LocalizedTextArea label="What We Offer" name="whatWeOffer" value={formData.whatWeOffer} onChange={handleChange} rows={3} className="mt-4" />
          <LocalizedTextArea label="Why We Are Looking" name="whyWeAreLooking" value={formData.whyWeAreLooking} onChange={handleChange} rows={3} />
          <LocalizedTextArea label="Responsibilities" name="responsibilities" value={formData.responsibilities} onChange={handleChange} rows={5} />
          <LocalizedTextArea label="Required Skills (e.g., HTML, React, NodeJS)" name="skills" value={formData.skills} onChange={handleChange} rows={3} />
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: 'center', backgroundColor: 'white' }}>
          <Button onClick={() => onClose()} variant="outlined" disabled={loading}
            sx={{ color: PRIMARY_COLOR, borderColor: PRIMARY_COLOR, '&:hover': { borderColor: HOVER_COLOR } }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading} startIcon={isEdit ? <SaveIcon /> : <AddCircleIcon />}
            sx={{ backgroundColor: PRIMARY_COLOR, '&:hover': { backgroundColor: HOVER_COLOR }, position: 'relative' }}>
            {isEdit ? 'Save Changes' : 'Create Position'}
            {loading && <CircularProgress size={24} sx={{ color: 'white', position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px', }} />}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
