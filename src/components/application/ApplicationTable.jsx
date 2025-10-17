import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box,
  IconButton, Typography, CircularProgress, Button, Chip,
  Select, MenuItem, FormControl, InputLabel
} from "@mui/material";
import { Visibility, Delete, Refresh as RefreshIcon, CheckCircle, Cancel } from "@mui/icons-material";
import { updateApplicationStatus } from "../../services/applicationService";
import { useAuth } from "../../contexts/AuthContext";

const PRIMARY_COLOR = "#ADD0B3";
const HOVER_COLOR = "#8CB190";

const statusColors = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
    contacted: 'info',
};

// Component for Status change (handles PATCH request directly)
const StatusSelector = ({ applicationId, currentStatus, refetchApplications }) => {
    const { token } = useAuth();
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (event) => {
        const newStatus = event.target.value;
        setLoading(true);
        try {
            await updateApplicationStatus(token, applicationId, newStatus);
            setStatus(newStatus);
            refetchApplications(); // Refresh the whole list for consistency
        } catch (error) {
            alert(`Failed to update status: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
                value={status}
                onChange={handleStatusChange}
                label="Status"
                disabled={loading}
                sx={{ 
                    bgcolor: 'white', 
                    '&.Mui-disabled': { opacity: 0.7, '& .MuiCircularProgress-root': { color: PRIMARY_COLOR } }
                }}
            >
                {['pending', 'approved', 'rejected', 'contacted'].map((s) => (
                    <MenuItem key={s} value={s}>
                        <Chip label={s.toUpperCase()} size="small" color={statusColors[s]} />
                    </MenuItem>
                ))}
            </Select>
            {loading && (
                <CircularProgress 
                    size={24} 
                    sx={{ 
                        color: PRIMARY_COLOR, 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        marginTop: '-12px', 
                        marginLeft: '-12px',
                        zIndex: 10
                    }} 
                />
            )}
        </FormControl>
    );
};


export default function ApplicationTable({
  applications,
  loading,
  onView,
  onDelete,
  onRefresh,
  filterStatus,
  onFilterChange
}) {

  if (loading) {
    return (
      <Box 
        className="text-center p-10 bg-white rounded-xl shadow-md" 
        sx={{ color: PRIMARY_COLOR, borderRadius: "12px" }}
      >
        <CircularProgress color="inherit" size={24} sx={{ mr: 2 }} />
        <Typography component="span">Loading job applications...</Typography>
      </Box>
    );
  }

  return (
    <TableContainer 
      component={Paper} 
      elevation={3} 
      sx={{ borderRadius: "12px" }}
    >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                    value={filterStatus}
                    onChange={(e) => onFilterChange(e.target.value)}
                    label="Filter by Status"
                >
                    <MenuItem value="">All Applications</MenuItem>
                    {['pending', 'approved', 'rejected', 'contacted'].map((s) => (
                        <MenuItem key={s} value={s}>
                            <Chip label={s.toUpperCase()} size="small" color={statusColors[s]} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button
                onClick={onRefresh}
                startIcon={<RefreshIcon />}
                variant="outlined"
                disabled={loading}
                sx={{
                    color: PRIMARY_COLOR,
                    borderColor: PRIMARY_COLOR,
                    "&:hover": { borderColor: HOVER_COLOR, bgcolor: 'gray.50' },
                }}
            >
                Refresh List
            </Button>
        </Box>

      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: PRIMARY_COLOR,
              "& th": { color: "white", fontWeight: "bold" },
            }}
          >
            <TableCell>Applicant</TableCell>
            <TableCell>Email</TableCell>
            <TableCell className="hidden sm:table-cell">Location</TableCell>
            <TableCell className="hidden md:table-cell">Submitted</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} sx={{ textAlign: 'center', py: 8, color: 'gray.500' }}>
                No applications found {filterStatus && `with status: ${filterStatus}`}.
              </TableCell>
            </TableRow>
          ) : (
            applications.map((row) => (
              <TableRow key={row._id} hover className="hover:bg-gray-50 transition duration-150 ease-in-out">
                <TableCell className="font-medium text-gray-900">{row.firstName} {row.lastName}</TableCell>
                <TableCell className="text-gray-600">{row.email}</TableCell>
                <TableCell className="text-gray-600 hidden sm:table-cell">{row.location || 'N/A'}</TableCell>
                <TableCell className="text-gray-600 text-xs hidden md:table-cell">
                    {new Date(row.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                    <StatusSelector 
                        applicationId={row._id}
                        currentStatus={row.status}
                        refetchApplications={onRefresh}
                    />
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" size="small" onClick={() => onView(row)} aria-label={`View ${row.firstName}`}>
                    <Visibility fontSize="small" />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => onDelete(row)} aria-label={`Delete ${row.firstName}`}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}