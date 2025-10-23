import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

// MUI-based Sidebar / Tabs navigation used in page editors.
// Props: sections [{id,title}], activeSection, setActiveSection, primaryColor, variant
const SidebarNavigation = ({ sections, activeSection, setActiveSection, primaryColor = '#388E3C', variant = 'sidebar' }) => {
  if (variant === 'tabs') {
    const currentIndex = Math.max(0, sections.findIndex((s) => s.id === activeSection));
    return (
      <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 1 }}>
        <Tabs
          value={currentIndex}
          onChange={(e, idx) => setActiveSection(sections[idx]?.id)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="page sections tabs"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '999px',
            },
            '& .MuiTabs-indicator': { display: 'none' }
          }}
        >
          {sections.map((s) => (
            <Tab
              key={s.id}
              label={s.title}
              sx={(theme) => ({
                color: activeSection === s.id ? '#fff' : theme.palette.text.primary,
                bgcolor: activeSection === s.id ? primaryColor : 'transparent',
                minHeight: 40,
                px: 3,
                mr: 1,
              })}
            />
          ))}
        </Tabs>
      </Box>
    );
  }

  // Sidebar (vertical) variant using MUI List
  return (
    <Box sx={{ position: 'sticky', top: 16 }}>
      <List sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 1 }}>
        {sections.map((s) => (
          <ListItemButton
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            selected={activeSection === s.id}
            sx={{
              borderRadius: 1.5,
              mb: 1,
              '&.Mui-selected': {
                bgcolor: primaryColor,
                color: '#fff',
                '& .MuiListItemText-root': { color: '#fff' }
              }
            }}
          >
            <ListItemText primary={s.title} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

SidebarNavigation.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired, title: PropTypes.string.isRequired })).isRequired,
  activeSection: PropTypes.string,
  setActiveSection: PropTypes.func.isRequired,
  primaryColor: PropTypes.string,
  variant: PropTypes.oneOf(['sidebar', 'tabs'])
};

export default SidebarNavigation;