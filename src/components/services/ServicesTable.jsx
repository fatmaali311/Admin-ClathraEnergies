import React from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box,
  IconButton, Button, Typography, CircularProgress
} from "@mui/material";
import { Visibility, Edit, Delete, Refresh as RefreshIcon } from "@mui/icons-material";

const PRIMARY_COLOR = "#ADD0B3";
const HOVER_COLOR = "#8CB190";

export default function ServicesTable({
  services,
  loading,
  error,
  onView,
  onEdit,
  onDelete,
  onRefresh
}) {
  const getServiceField = (service, path, defaultValue = 'N/A') => {
    return path.split('.').reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : null, service) || defaultValue;
  };

  if (loading) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          p: 10,
          bgcolor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: PRIMARY_COLOR }} size={24} />
        <Typography variant="h6" sx={{ color: PRIMARY_COLOR }}>
          Loading services...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', p: 10, bgcolor: 'red.50', border: '1px solid', borderColor: 'red.200', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" color="error">Error Loading Data</Typography>
        <Typography sx={{ color: 'error.dark', mt: 1 }}>{error}</Typography>
        <Button
          onClick={onRefresh}
          startIcon={<RefreshIcon />}
          sx={{ mt: 2, color: PRIMARY_COLOR, borderColor: PRIMARY_COLOR, "&:hover": { borderColor: HOVER_COLOR } }}
          variant="outlined"
        >
          Try Refreshing
        </Button>
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <Button
          onClick={onRefresh}
          startIcon={<RefreshIcon />}
          variant="outlined"
          sx={{
            color: PRIMARY_COLOR,
            borderColor: PRIMARY_COLOR,
            "&:hover": { borderColor: HOVER_COLOR, bgcolor: 'gray.50' },
            px: 3,
            py: 1,
          }}
        >
          Refresh List
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              bgcolor: PRIMARY_COLOR,
              "& th": { color: "white", fontWeight: "bold", py: 3 },
            }}
          >
            <TableCell>Title</TableCell>
            <TableCell>Sub Title</TableCell>
            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Slug</TableCell>

            <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Updated At</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {services.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} sx={{ textAlign: 'center', py: 8, color: 'gray.500' }}>
                No services found 😔
              </TableCell>
            </TableRow>
          ) : (
            services.map((row) => (
              <TableRow
                key={row._id}
                hover
                sx={{ '&:hover': { bgcolor: 'gray.50' }, transition: 'background-color 0.2s' }}
              >
                <TableCell sx={{ fontWeight: 'medium', color: 'gray.900' }}>{row.title}</TableCell>
                <TableCell sx={{ color: 'gray.600' }}>
                  {getServiceField(row, 'data.serviceObj.sub_title', 'N/A')}
                </TableCell>
                <TableCell sx={{ color: 'gray.600', display: { xs: 'none', sm: 'table-cell' } }}>{row.title}</TableCell>

                <TableCell sx={{ color: 'gray.600', fontSize: '0.875rem', display: { xs: 'none', lg: 'table-cell' } }}>
                  {new Date(row.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => onView(row)}
                    aria-label={`View ${row.title}`}
                    sx={{ mx: 0.5 }}
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    size="small"
                    onClick={() => onEdit(row)}
                    aria-label={`Edit ${row.title}`}
                    sx={{ mx: 0.5 }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => onDelete(row.title)}
                    aria-label={`Delete ${row.title}`}
                    sx={{ mx: 0.5 }}
                  >
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