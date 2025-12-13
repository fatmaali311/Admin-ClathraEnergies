import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../Auth/utils/authHelpers';
import {
  MdHome,
  MdInfo,
  MdBuild,
  MdWork,
  MdApps,
  MdContacts,
  MdPeople,
  MdDashboard,
  MdSettings,
  MdHelp,


} from 'react-icons/md';
import Logo from '../Common/Logo';
import { PRIMARY_COLOR, HOVER_COLOR } from '../Common/styles';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();

  // Colors
  const textColor = 'text-[#388E3C]';
  const activeBgColor = 'bg-white';

  // Common NavLink style
  const getLinkClasses = (isActive) => `
    flex items-center px-3 py-2 rounded-lg transition-colors text-sm
    ${isActive
      ? `${activeBgColor} ${textColor} font-bold shadow-md`
      : 'text-white hover:bg-white hover:text-[#388E3C] opacity-95 hover:opacity-100'}
  `;


  // Dashboard (independent)
  const dashboardItem = { name: 'Dashboard', path: '/', icon: <MdDashboard size={20} /> };

  // Content Management Links
  const contentNavItems = [
    { name: 'Home', path: '/dashboard/content/home', icon: <MdHome size={20} /> },
    { name: 'About Us', path: '/dashboard/content/about-us', icon: <MdInfo size={20} /> },
    { name: 'Services', path: '/dashboard/content/services', icon: <MdBuild size={20} /> },
    { name: 'Careers', path: '/dashboard/content/careers', icon: <MdWork size={20} /> },
    { name: 'Our Technology', path: '/dashboard/content/our-technology', icon: <MdInfo size={20} /> },
    { name: 'Why Technology', path: '/dashboard/content/why-technology', icon: <MdInfo size={20} /> },
    { name: 'Biogas Solutions', path: '/dashboard/content/biogas-solutions', icon: <MdHelp size={20} /> },
    { name: 'Applications', path: '/dashboard/content/applications', icon: <MdApps size={20} /> },
    { name: 'Contact Us', path: '/dashboard/content/contact-us', icon: <MdContacts size={20} /> },
    { name: 'Configuration', path: '/dashboard/configuration', icon: <MdSettings size={20} /> },
  ];

  return (
    <>
      <aside
        className={`
          bg-[#ADD0B3] w-64 h-[calc(100vh-4rem)] fixed top-16 left-0 
          p-4 z-40 transition-transform duration-300 flex flex-col
          ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} 
          md:translate-x-0
        `}
      >
        {/* Mobile Logo */}
        <div className="flex items-center justify-between mb-4 md:hidden h-16">
          <div className="flex items-center mb-6 h-16">
            <Logo size="lg" color="white" className="mr-2" marginBottom={false} />
            <span className="text-xl font-bold text-white">ClathraEnergies</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto mt-2 md:mt-0">
          {/* Dashboard Link */}
          <ul className="space-y-1 mb-6">
            <li>
              <NavLink
                to={dashboardItem.path}
                className={({ isActive }) => getLinkClasses(isActive)}
                onClick={() => isOpen && toggleSidebar()}
              >
                <span className="mr-3">{dashboardItem.icon}</span>
                {dashboardItem.name}
              </NavLink>
            </li>
          </ul>

          {/* Content Management Section */}
          <h2 className={`text-xs font-semibold uppercase opacity-90 tracking-wider mb-3 `}>
            Content Management
          </h2>
          <ul className="space-y-1">
            {contentNavItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => getLinkClasses(isActive)}
                  onClick={() => isOpen && toggleSidebar()}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* User Management - superadmin only */}
          {hasPermission(user?.role, 'superadmin') && (
            <div className="mt-8 pt-4 border-t border-white border-opacity-30">
              <h2 className={`text-xs font-semibold uppercase opacity-90 tracking-wider mb-3 `}>
                Administration
              </h2>
              <ul className="space-y-1">
                <li>
                  <NavLink
                    to="/dashboard/users"
                    className={({ isActive }) => getLinkClasses(isActive)}
                    onClick={() => isOpen && toggleSidebar()}
                  >
                    <span className="mr-3">
                      <MdPeople size={20} />
                    </span>
                    Manage Admins
                  </NavLink>
                </li>
              </ul>
            </div>
          )}
        </div>
      </aside>


      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default React.memo(Sidebar);
