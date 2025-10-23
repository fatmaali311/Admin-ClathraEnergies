import React from 'react';
import TableShell from './TableShell';
import TableHeader from './TableHeader';
import { PRIMARY_COLOR, tableContainerSx, headerRowSx, loadingBoxSx, emptyCellSx } from './styles';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, Pagination, Typography, CircularProgress, Button
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

const DEFAULT_PRIMARY = PRIMARY_COLOR;

/**
 * ManagedTable
 * props:
 * - columns: [{ key, label, className?, render?(row) }]
 * - rows: []
 * - loading, error
 * - onRefresh, onAdd, addLabel
 * - leftHeader: JSX on left side (filters)
 * - renderRow: optional function(row) => JSX (action cell)
 * - page, totalPages, onPageChange
 * - primaryColor: color token
 */
export default function ManagedTable({
  columns = [],
  rows = [],
  loading = false,
  loadingMessage = 'Loading...',
  error = null,
  onRefresh,
  onAdd,
  addLabel = 'Add New',
  leftHeader = null,
  customHeader = null,
  renderRow = null,
  renderEmpty = null,
  getRowSx = null,
  page = 1,
  totalPages = 0,
  onPageChange = null,
  primaryColor = DEFAULT_PRIMARY,
}) {
  if (loading) {
    return (
      <Box sx={loadingBoxSx(primaryColor)}>
        <CircularProgress color="inherit" size={24} sx={{ mr: 2 }} />
        <Typography component="span">{loadingMessage}</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', p: 6 }}>
        <Typography variant="h6" color="error">Error Loading Data</Typography>
        <Typography sx={{ color: 'error.dark', mt: 1 }}>{String(error)}</Typography>
        {onRefresh && (
          <Button
            onClick={onRefresh}
            startIcon={<RefreshIcon />}
            sx={{ mt: 2, color: primaryColor, borderColor: primaryColor, '&:hover': { borderColor: primaryColor } }}
            variant="outlined"
          >
            Try Refreshing
          </Button>
        )}
      </Box>
    );
  }

  const hasActions = !!renderRow;

  return (
    <TableShell
      header={(
        customHeader ? customHeader : (<TableHeader left={leftHeader} onRefresh={onRefresh} onAdd={onAdd} addLabel={addLabel} />)
      )}
    >
      <TableContainer component={Paper} elevation={3} sx={tableContainerSx}>
        <Table>
          <TableHead>
            <TableRow sx={headerRowSx(primaryColor)}>
              {columns.map((col) => (
                <TableCell key={col.key} className={col.className || ''}>{col.label}</TableCell>
              ))}
              {hasActions && <TableCell align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {(!rows || rows.length === 0) ? (
              renderEmpty ? renderEmpty() : (
                <TableRow>
                  <TableCell colSpan={columns.length + (hasActions ? 1 : 0)} sx={emptyCellSx}>
                    No records found.
                  </TableCell>
                </TableRow>
              )
            ) : (
              rows.map((row) => (
                <TableRow key={row._id || row.id || JSON.stringify(row)} hover sx={getRowSx ? getRowSx(row) : undefined}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className || ''}>
                      {col.render ? col.render(row) : row[col.key]}
                    </TableCell>
                  ))}
                  {hasActions && <TableCell className="px-4 py-3">{renderRow(row)}</TableCell>}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {onPageChange && totalPages > 0 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={totalPages} page={page} onChange={(e, v) => onPageChange(v)} color="primary" />
        </Box>
      )}
    </TableShell>
  );
}
