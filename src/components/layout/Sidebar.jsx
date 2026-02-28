import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../Auth/utils/authHelpers';
import {
  MdHome,
  MdBusiness, 
  MdBuild,
  MdWork,
  MdMemory,   
  MdLightbulb,
  MdApps,
  MdEmail,    
  MdPeople,
  MdDashboard,
  MdSettings,
  MdEco,      
  MdMenu,
  MdChevronLeft
} from 'react-icons/md';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
  useMediaQuery,
  useTheme,
  Toolbar,
  Tooltip,
  IconButton
} from '@mui/material';

// Drawer Config
export const DRAWER_WIDTH = 260;
export const MINI_DRAWER_WIDTH = 72; // Width for icons only

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Colors
  const sidebarBg = '#ADD0B3';
  const activeBg = '#ffffff';
  const activeText = '#388E3C';
  const inactiveText = '#ffffff';

  // Navigation Data
  const dashboardItem = { name: 'Dashboard', path: '/', icon: <MdDashboard size={24} /> };

  const contentNavItems = [
    { name: 'Home', path: '/dashboard/content/home', icon: <MdHome size={24} /> },
    { name: 'About Us', path: '/dashboard/content/about-us', icon: <MdBusiness size={24} /> },
    { name: 'Services', path: '/dashboard/content/services', icon: <MdBuild size={24} /> },
    { name: 'Careers', path: '/dashboard/content/careers', icon: <MdWork size={24} /> },
    { name: 'Our Technology', path: '/dashboard/content/our-technology', icon: <MdMemory size={24} /> },
    { name: 'Why Technology', path: '/dashboard/content/why-technology', icon: <MdLightbulb size={24} /> },
    { name: 'Biogas Solutions', path: '/dashboard/content/biogas-solutions', icon: <MdEco size={24} /> },
    { name: 'Applications', path: '/dashboard/content/applications', icon: <MdApps size={24} /> },
    { name: 'Contact Us', path: '/dashboard/content/contact-us', icon: <MdEmail size={24} /> },
    { name: 'Configuration', path: '/dashboard/configuration', icon: <MdSettings size={24} /> },
  ];

  const adminNavItems = [
    { name: 'Manage Admins', path: '/dashboard/users', icon: <MdPeople size={24} /> }
  ];

  // Helper: Should we be in Mini Mode? (Desktop + Closed)
  const isMini = !isMobile && !isOpen;

  // Render a single nav item
  const renderNavItem = (item) => {
    const isActive = location.pathname === item.path;

    // Button Content
    const button = (
      <ListItemButton
        component={NavLink}
        to={item.path}
        onClick={() => isMobile && toggleSidebar()} // Close on mobile click
        sx={{
          borderRadius: 2,
          mx: isMini ? 1 : 1.5, // tighter margins when mini
          justifyContent: isMini ? 'center' : 'initial',
          px: isMini ? 1 : 2, // center content
          py: 0.6, // Tighter vertical padding (approx 5px)
          backgroundColor: isActive ? activeBg : 'transparent',
          color: isActive ? activeText : inactiveText,
          '&:hover': {
            backgroundColor: isActive ? activeBg : 'rgba(255, 255, 255, 0.15)',
            color: isActive ? activeText : '#fff',
          },
          transition: 'all 0.2s ease-in-out',
          minHeight: 40, // Reduced minimum height
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: isMini ? 0 : 2,
            justifyContent: 'center',
            color: 'inherit',
          }}
        >
          {item.icon}
        </ListItemIcon>

        {!isMini && (
          <ListItemText
            primary={item.name}
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: isActive ? 700 : 500,
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap', // prevent wrap during transition
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          />
        )}
      </ListItemButton>
    );

    return (
      <ListItem key={item.path} disablePadding sx={{ mb: 0.2, display: 'block' }}>
        {isMini ? (
          <Tooltip title={item.name} placement="right" arrow>
            {button}
          </Tooltip>
        ) : (
          button
        )}
      </ListItem>
    );
  };

  const drawerContent = (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      pb: 1,
      overflowX: 'hidden' // hide horizontal overflow during transition
    }}>
      {/* Sidebar Toggle / Header Area */}
      <Box
        sx={{
          height: 64, // Needs to match Header height for alignment
          display: 'flex',
          alignItems: 'center',
          justifyContent: isMini ? 'center' : 'flex-end',
          px: 2,
          flexShrink: 0 // Prevent shrinking
        }}
      >
        <IconButton
          onClick={toggleSidebar}
          sx={{ color: '#fff' }}
        >
          {/* If mini, show Menu or Right Arrow. If Open, show Left Arrow */}
          {isMini ? <MdMenu size={28} /> : <MdChevronLeft size={28} />}
        </IconButton>
      </Box>

      {/* Scrollable Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          mt: 0,
          // Hide Scrollbar Styles
          scrollbarWidth: 'none', // Firefox
          '&::-webkit-scrollbar': { display: 'none' }, // Chrome/Safari
        }}
      >
        <List component="nav" disablePadding>
          {renderNavItem(dashboardItem)}
        </List>

        <Divider sx={{ my: 0.8, borderColor: 'rgba(255,255,255,0.2)', mx: isMini ? 1 : 3 }} />

        {/* Section Title */}
        {!isMini && (
          <Typography
            variant="caption"
            sx={{
              px: 3,
              pb: 0.5,
              display: 'block',
              textTransform: 'uppercase',
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.7rem',
              whiteSpace: 'nowrap'
            }}
          >
            Content Management
          </Typography>
        )}

        <List component="nav" disablePadding>
          {contentNavItems.map(item => renderNavItem(item))}
        </List>

        {hasPermission(user?.role, 'superadmin') && (
          <>
            <Divider sx={{ my: 0.8, borderColor: 'rgba(255,255,255,0.2)', mx: isMini ? 1 : 3 }} />
            {!isMini && (
              <Typography
                variant="caption"
                sx={{
                  px: 3,
                  pb: 0.5,
                  display: 'block',
                  textTransform: 'uppercase',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.7rem',
                  whiteSpace: 'nowrap'
                }}
              >
                Administration
              </Typography>
            )}
            <List component="nav" disablePadding>
              {adminNavItems.map(item => renderNavItem(item))}
            </List>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: isMini ? MINI_DRAWER_WIDTH : DRAWER_WIDTH }, // Mini on Desktop Closed
        flexShrink: { md: 0 },
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
      aria-label="mailbox folders"
    >
      {/* Mobile Drawer (Temporary - Full or Hidden) */}
      <Drawer
        variant="temporary"
        open={isOpen} // On Mobile, isOpen means VISIBLE
        onClose={toggleSidebar}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            backgroundColor: sidebarBg,
            borderRight: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer (Persistent - Mini or Full) */}
      <Drawer
        variant="persistent"
        open={true} // Always "Open" conceptually, but we animate width
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: isMini ? MINI_DRAWER_WIDTH : DRAWER_WIDTH,
            backgroundColor: sidebarBg,
            borderRight: 'none',
            border: 'none',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden'
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default React.memo(Sidebar);
