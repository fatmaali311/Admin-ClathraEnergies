import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, IconButton, Typography, CircularProgress
} from '@mui/material';
import { Close as CloseIcon, Save as SaveIcon, AddCircle as AddCircleIcon } from '@mui/icons-material';
import { createPosition, updatePosition } from '../../services/positionService';
import { useToast } from '../../hooks/useToast';

const PRIMARY_COLOR = "#ADD0B3";
const HOVER_COLOR = "#8CB190";

export default function PositionFormModal({ open, onClose, position, token }) {
  const isEdit = !!position;
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: '',
    whatWeOffer: '',
    whyWeAreLooking: '',
    responsibilities: '',
    skills: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  // Effect to populate form when editing a position
  useEffect(() => {
    if (isEdit && position) {
      setFormData({
        name: position.name || '',
        location: position.location || '',
        type: position.type || '',
        whatWeOffer: position.whatWeOffer || '',
        whyWeAreLooking: position.whyWeAreLooking || '',
        responsibilities: position.responsibilities || '',
        skills: position.skills || ''
      });
    } else {
      // Reset form for creation
      setFormData({
        name: '', location: '', type: '', whatWeOffer: '',
        whyWeAreLooking: '', responsibilities: '', skills: ''
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
    if (!formData.name || !formData.location || !formData.type) {
        setError("Name, Location, and Type are required fields.");
        setLoading(false);
        return;
    }

    try {
      if (isEdit) {
        await updatePosition(token, position._id, formData);
        showToast(`Position "${formData.name}" updated successfully!`, 'success');
      } else {
        await createPosition(token, formData);
        showToast(`Position "${formData.name}" created successfully!`, 'success');
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
      <DialogTitle sx={{ backgroundColor: PRIMARY_COLOR, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
            <TextField label="Position Name" name="name" value={formData.name} onChange={handleChange} required />
            <TextField label="Location" name="location" value={formData.location} onChange={handleChange} required />
            <TextField label="Type (e.g., Full-time, Internship)" name="type" value={formData.type} onChange={handleChange} required />
          </Box>

          <TextField label="What We Offer" name="whatWeOffer" value={formData.whatWeOffer} onChange={handleChange} multiline rows={3} fullWidth margin="normal" />
          <TextField label="Why We Are Looking" name="whyWeAreLooking" value={formData.whyWeAreLooking} onChange={handleChange} multiline rows={3} fullWidth margin="normal" />
          <TextField label="Responsibilities" name="responsibilities" value={formData.responsibilities} onChange={handleChange} multiline rows={5} fullWidth margin="normal" />
          <TextField label="Required Skills (e.g., HTML, React, NodeJS)" name="skills" value={formData.skills} onChange={handleChange} multiline rows={3} fullWidth margin="normal" />
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