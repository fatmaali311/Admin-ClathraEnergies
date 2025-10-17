import React from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Typography, TablePagination,
  TextField, Box, CircularProgress
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ContactTable = ({
  data, total, page, setPage,
  totalPages, searchQuery, setSearchQuery,
  loading, error, onView,
}) => {

  const handleChangePage = (_, newPage) => setPage(newPage + 1);

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Contact Submissions</Typography>
        <TextField
          size="small"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Typography color="error" textAlign="center" p={2}>
          {error}
        </Typography>
      ) : data.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" p={2}>
          No contacts found.
        </Typography>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Organization</TableCell>
                  <TableCell>Interest</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row._id} hover>
                    <TableCell>{row.fullName}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.organization}</TableCell>
                    <TableCell>{row.areaOfInterest}</TableCell>
                    <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => onView(row)}>
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={total}
            page={page - 1}
            onPageChange={handleChangePage}
            rowsPerPage={10}
            rowsPerPageOptions={[10]}
          />
        </>
      )}
    </Paper>
  );
};

export default ContactTable;
