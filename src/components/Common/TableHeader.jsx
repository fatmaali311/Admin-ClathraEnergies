import React from 'react';
import { Box, Button } from '@mui/material';
import { Refresh as RefreshIcon, Add as AddIcon } from '@mui/icons-material';
import { PRIMARY_COLOR, HOVER_COLOR } from './styles';

// props: left (JSX), onRefresh, onAdd, addLabel
const TableHeader = ({ left = null, onRefresh, onAdd, addLabel = 'Add New' }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
      <div>{left}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {onRefresh && (
          <Button
            onClick={onRefresh}
            startIcon={<RefreshIcon />}
            variant="outlined"
            sx={{
              color: PRIMARY_COLOR,
              borderColor: PRIMARY_COLOR,
              '&:hover': { borderColor: HOVER_COLOR, bgcolor: 'gray.50' },
            }}
          >
            Refresh
          </Button>
        )}
        {onAdd && (
          <Button
            onClick={onAdd}
            startIcon={<AddIcon />}
            variant="contained"
            sx={{ backgroundColor: PRIMARY_COLOR, '&:hover': { backgroundColor: HOVER_COLOR } }}
          >
            {addLabel}
          </Button>
        )}
      </div>
    </Box>
  );
};

export default React.memo(TableHeader);
