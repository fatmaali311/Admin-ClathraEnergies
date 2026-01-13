import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Common/Logo';
import { logoutRequest } from '../../Auth/services/authService';
import Alert from '../ui/Alert';
import { useNavigate, Link } from 'react-router-dom';
import { MdMenu, MdSearch } from 'react-icons/md';


/**
 * Header Component
 * Full-width, fixed header with search, profile menu, and mobile toggle.
 */
const Header = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    // Use a ref for the profile menu to handle clicks outside
    const profileMenuRef = useRef(null);

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click is outside the menu *and* outside the profile image/button
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = useCallback(async () => {
        try {
            // Close the menu immediately
            setIsProfileMenuOpen(false);

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
    }, [navigate, logout]); // Dependency array for useCallback is added



    return (
        <>
            <header className="bg-white shadow-md h-16 p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50 border-b border-gray-100">

                {/* Left Side: Mobile Menu Button + Logo/Name (Desktop) */}
                <div className="flex items-center">
                    {/* Menu button (mobile only) */}
                    <button
                        className="md:hidden p-1 text-[#388E3C] hover:text-[#2E7D32] mr-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ADD0B3] rounded-md"
                        onClick={toggleSidebar}
                        aria-label="Toggle Sidebar"
                    >
                        <MdMenu size={28} />
                    </button>


                    {/* Logo + Name (desktop only) */}
                    <div className="hidden md:flex items-center min-w-[200px] select-none">

                        {/* Using default dark logo as the header background is white */}
                        <Link to="/" className="flex items-center">
                            <Logo size="sm" className="mr-2" marginBottom={false} />
                            <span className="text-xl font-extrabold text-[#ADD0B3]">ClathraEnergies</span>
                        </Link>
                    </div>
                </div>

                {/* Center: Search bar (Hidden on smallest mobile screens) */}
                <div className="flex-1 mx-4 md:mx-8 max-w-lg hidden sm:flex">
                    <div className="relative w-full">
                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search assets, users, or data..."
                            className="w-full pl-10 pr-4 h-10 border border-gray-300 rounded-full text-sm transition-all shadow-sm
                                        focus:outline-none focus:ring-2 focus:ring-[#ADD0B3] focus:border-white"
                        />
                    </div>
                </div>

                {/* Right Side: Profile menu */}
                <div className="relative" ref={profileMenuRef}>
                    {/* Profile Image/Button */}
                    <img
                        src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=ADD0B3&color=ffffff&size=40`}
                        alt="Profile"
                        className="w-10 h-10 rounded-full cursor-pointer border-2 border-transparent hover:border-[#ADD0B3] transition-all object-cover shadow-md"
                        loading="lazy"
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    />


                    {/* Profile Dropdown Menu */}
                    {isProfileMenuOpen && (
                        <div
                            className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden transform origin-top-right animate-fade-in ring-1 ring-gray-200"
                            role="menu"
                            aria-orientation="vertical"
                        >
                            {/* User Info Header */}
                            <div className="flex items-center p-4 border-b border-gray-100 bg-gray-50">
                                <img
                                    src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=ADD0B3&color=ffffff&size=40`}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full object-cover mr-3"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 truncate">{user?.fullName || 'Admin User'}</p>
                                    <p className="text-xs text-[#388E3C] capitalize">{user?.role || 'Administrator'}</p>
                                </div>
                            </div>

                            {/* Profile Link (using Link for navigation) */}
                            <Link
                                to="/dashboard/profile"
                                onClick={() => setIsProfileMenuOpen(false)}
                                className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-[#ADD0B3] hover:text-[#388E3C] transition-colors font-medium"
                                role="menuitem"
                            >
                                Profile
                            </Link>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-[#ADD0B3] hover:text-[#388E3C] transition-colors font-medium"
                                role="menuitem"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Alert messages container (positioned below the fixed header) */}
            <div className="fixed top-16 right-4 z-50 w-full max-w-xs md:max-w-sm">
                <Alert
                    show={alert.show}
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert({ show: false, type: 'info', message: '' })}
                />
            </div>
        </>
    );
};

export default React.memo(Header);