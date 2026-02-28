import React, { useState } from "react";
import { Box, CssBaseline, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import Header from "../components/layout/Header";
import Sidebar, { DRAWER_WIDTH } from "../components/layout/Sidebar";

const DashboardLayout = ({ children }) => {
  const theme = useTheme();
  // Default to open on desktop, closed on mobile
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#f9fafb' }}>
      <CssBaseline />

      {/* Header */}
      <Header
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, md: 2 }, // Reduced padding
          width: { xs: '100%', md: 'auto' },
          marginTop: '64px', // Header height
          minWidth: 0,
          overflow: 'auto', // Enable independent scrolling
          height: 'calc(100vh - 64px)', // Explicit height to ensure scroll
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
