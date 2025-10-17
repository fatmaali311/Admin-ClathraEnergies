import React from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box,
  IconButton, Typography, CircularProgress, Button
} from "@mui/material";
import { Visibility, Edit, Delete, Refresh as RefreshIcon } from "@mui/icons-material";

const PRIMARY_COLOR = "#ADD0B3";
const HOVER_COLOR = "#8CB190";

export default function PositionTable({
  positions,
  loading,
  onView,
  onEdit,
  onDelete,
  onRefresh
}) {

  if (loading) {
    return (
      <Box 
        className="text-center p-10 bg-white rounded-xl shadow-md" 
        sx={{ color: PRIMARY_COLOR, borderRadius: "12px" }}
      >
        <CircularProgress color="inherit" size={24} sx={{ mr: 2 }} />
        <Typography component="span">Loading job positions...</Typography>
      </Box>
    );
  }

  return (
    <TableContainer 
      component={Paper} 
      elevation={3} 
      sx={{ borderRadius: "12px" }}
    >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, gap: 1 }}>
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
                Refresh
            </Button>
            <Button
                onClick={() => onEdit(null)} // Use onEdit(null) to trigger create/add new form
                variant="contained"
                sx={{
                    backgroundColor: PRIMARY_COLOR,
                    "&:hover": { backgroundColor: HOVER_COLOR },
                }}
            >
                Add New Position
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
            <TableCell>Name</TableCell>
            <TableCell>Location</TableCell>
            <TableCell className="hidden sm:table-cell">Type</TableCell>
            <TableCell className="hidden md:table-cell">Skills</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {positions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} sx={{ textAlign: 'center', py: 8, color: 'gray.500' }}>
                No open positions found.
              </TableCell>
            </TableRow>
          ) : (
            positions.map((row) => (
              <TableRow key={row._id} hover className="hover:bg-gray-50 transition duration-150 ease-in-out">
                <TableCell className="font-medium text-gray-900">{row.name}</TableCell>
                <TableCell className="text-gray-600">{row.location}</TableCell>
                <TableCell className="text-gray-600 hidden sm:table-cell">{row.type}</TableCell>
                <TableCell className="text-gray-600 hidden md:table-cell max-w-xs truncate">{row.skills}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" size="small" onClick={() => onView(row)} aria-label={`View ${row.name}`}>
                    <Visibility fontSize="small" />
                  </IconButton>
                  <IconButton color="secondary" size="small" onClick={() => onEdit(row)} aria-label={`Edit ${row.name}`}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => onDelete(row)} aria-label={`Delete ${row.name}`}>
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