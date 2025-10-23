// Shared style tokens and reusable sx objects for tables/modals
export const PRIMARY_COLOR = '#ADD0B3';
export const HOVER_COLOR = '#8CB190';

export const tableContainerSx = {
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
};

export const headerRowSx = (primary = PRIMARY_COLOR) => ({
  backgroundColor: primary,
  '& th': { color: 'white', fontWeight: 'bold' }
});

export const loadingBoxSx = (primary = PRIMARY_COLOR) => ({
  textAlign: 'center',
  p: 10,
  bgcolor: 'white',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  color: primary
});

export const emptyCellSx = { textAlign: 'center', py: 8, color: 'gray.500' };

export default {
  PRIMARY_COLOR,
  HOVER_COLOR,
  tableContainerSx,
  headerRowSx,
  loadingBoxSx,
  emptyCellSx,
};
