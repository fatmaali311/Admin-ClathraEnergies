export const PRIMARY_COLOR = "#ADD0B3";
export const HOVER_COLOR = "#8CB190";

export const tableContainerSx = {
  borderRadius: '12px',
  overflowX: 'auto', // Enable horizontal scroll for responsiveness
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid #f0f0f0'
};

export const headerRowSx = (color) => ({
  backgroundColor: color || PRIMARY_COLOR,
  '& .MuiTableCell-root': {
    color: 'white',
    fontWeight: 'bold',
    borderBottom: 'none',
    fontSize: '0.875rem'
  }
});

export const loadingBoxSx = (color) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  py: 10,
  color: color || PRIMARY_COLOR
});

export const emptyCellSx = {
  textAlign: 'center',
  py: 10,
  color: 'text.secondary',
  fontStyle: 'italic'
};
