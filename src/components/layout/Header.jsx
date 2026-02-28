import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Common/Logo';
import { logoutRequest } from '../../Auth/services/authService';
import Alert from '../ui/Alert';
import { useNavigate, Link } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Menu,
    MenuItem,
    Avatar,
    Divider,
    ListItemIcon
} from '@mui/material';
import {
    Menu as MenuIcon,
    Logout as LogoutIcon,
    Person as PersonIcon
} from '@mui/icons-material';

/**
 * Header Component
 * Material UI implementation.
 * Contains: Sidebar Toggle, Logo/Title, Profile Menu.
 */
const Header = ({ toggleSidebar, isSidebarOpen }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });

    // Profile Menu State
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            handleProfileMenuClose();
            await logoutRequest();
            logout();

            setAlert({
                show: true,
                type: 'success',
                message: 'Logged out successfully!',
            });

            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            setAlert({
                show: true,
                type: 'error',
                message: 'Failed to log out. Please try again.',
            });
        }
    };

    // Brand Colors
    const primaryColor = '#ADD0B3'; // Green
    const textColor = '#388E3C';   // Darker Green text
    const drawerWidth = 260; // Sidebar Open width
    const miniDrawerWidth = 72; // Sidebar Closed width

    return (
        <>
            <AppBar
                position="fixed"
                elevation={1}
                sx={{
                    backgroundColor: 'white',
                    color: 'text.primary',
                    borderBottom: '1px solid #f0f0f0',
                    // Header Width/Margin Logic:
                    // If desktop & open: Width = 100% - 260, Margin = 260
                    // If desktop & closed: Width = 100% - 72, Margin = 72
                    // If mobile: Width = 100%, Margin = 0

                    transition: (theme) => theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),

                    // Desktop Logic
                    width: { md: `calc(100% - ${isSidebarOpen ? drawerWidth : miniDrawerWidth}px)` },
                    marginLeft: { md: `${isSidebarOpen ? drawerWidth : miniDrawerWidth}px` },

                }}
            >
                <Toolbar>
                    {/* Mobile Toggle Button (Visible only on mobile) */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={toggleSidebar}
                        sx={{ mr: 2, display: { md: 'none' }, color: textColor }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Logo & Application Name */}
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <Logo size="sm" className="mr-2" marginBottom={false} />
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{
                                fontWeight: 800,
                                color: primaryColor,
                                display: { xs: 'none', sm: 'block' }
                            }}
                        >
                            ClathraEnergies
                        </Typography>
                    </Link>

                    {/* Spacer */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* Profile Section */}
                    <Box sx={{ display: 'flex' }}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                            sx={{ p: 0 }}
                        >
                            <Avatar
                                alt={user?.fullName || 'User'}
                                src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=ADD0B3&color=ffffff&size=40`}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    border: `2px solid transparent`,
                                    '&:hover': { borderColor: primaryColor },
                                    transition: 'all 0.2s'
                                }}
                            />
                        </IconButton>

                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={isMenuOpen}
                            onClose={handleProfileMenuClose}
                            PaperProps={{
                                elevation: 3,
                                sx: {
                                    mt: 1.5,
                                    minWidth: 200,
                                    borderRadius: 2,
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                }
                            }}
                        >
                            {/* User Info Header */}
                            <Box sx={{ px: 2, py: 1.5, bgcolor: '#f9f9f9', borderBottom: '1px solid #eee' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                                    {user?.fullName || 'Admin User'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: textColor, textTransform: 'capitalize' }}>
                                    {user?.role || 'Administrator'}
                                </Typography>
                            </Box>

                            <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/dashboard/profile'); }}>
                                <ListItemIcon>
                                    <PersonIcon fontSize="small" sx={{ color: '#757575' }} />
                                </ListItemIcon>
                                Profile
                            </MenuItem>

                            <Divider />

                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small" sx={{ color: '#d32f2f' }} />
                                </ListItemIcon>
                                <Typography variant="body2" color="error">
                                    Logout
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Alert messages container */}
            <Box sx={{ position: 'fixed', top: 70, right: 16, zIndex: 9999, width: '100%', maxWidth: 350 }}>
                <Alert
                    show={alert.show}
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert({ show: false, type: 'info', message: '' })}
                />
            </Box>
        </>
    );
};

export default React.memo(Header);