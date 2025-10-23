import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../layout/DashboardLayout';
import { getContactStatistics } from '../services/contactService';
import { getApplicationsStatistics } from '../services/applicationService';
import { Mail, FileText, Calendar } from 'lucide-react';

const StatCard = ({ title, value, sub, color = '#ADD0B3', link, icon: Icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-5 hover:shadow-md transition-all duration-200">
    <div
      className="p-4 rounded-xl flex items-center justify-center shrink-0"
      style={{ backgroundColor: color, minWidth: 64, minHeight: 64 }}
    >
      <Icon size={28} className="text-black opacity-80" />
    </div>

    <div className="flex-1">
      <div className="text-gray-500 text-sm font-medium">{title}</div>
      <div className="text-3xl font-bold text-black mt-1">{value ?? '—'}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>

    {link && (
      <a
        href={link}
        className="text-xs text-[#0F5132] font-medium underline hover:text-black transition-colors duration-200"
      >
        View
      </a>
    )}
  </div>
);

const Dashboard = () => {
  const { user, token, loading: authLoading } = useAuth();
  // Helper to get a friendly display name from the user object
  const getDisplayName = (u) => {
    if (!u) return null;
    return u.full_name || u.fullName || u.name || u.username || u.userName || u.email || 'Admin';
  };
  const displayName = getDisplayName(user);
  const [contactsStats, setContactsStats] = useState(null);
  const [appsStats, setAppsStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const [cStat, aStat] = await Promise.all([
          getContactStatistics(token),
          getApplicationsStatistics(token),
        ]);
        setContactsStats(cStat);
        setAppsStats(aStat);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Failed to fetch dashboard statistics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-black mb-2">
          Welcome back, {authLoading ? 'Loading...' : displayName || 'Admin'} 👋
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Manage your <span className="font-semibold text-[#0F5132]">ClarthraEnergies</span> website content, track
          applications, and stay updated — all in one place.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard
          title="Total Contacts"
          value={loading ? 'Loading...' : contactsStats?.summary?.totalContacts}
          sub={
            loading
              ? ''
              : `Unread: ${contactsStats?.summary?.unreadCount || 0} • Read: ${contactsStats?.summary?.readCount || 0}${
                  displayName ? ` • Managed by ${displayName}` : ''
                }`
          }
          color="#ADD0B3"
          link="/dashboard/content/contact-us"
          icon={Mail}
        />

        <StatCard
          title="Total Applications"
          value={loading ? 'Loading...' : appsStats?.summary?.totalApplications}
          sub={
            loading
              ? ''
              : `This month: ${appsStats?.summary?.thisMonthCount || 0}${displayName ? ` • Managed by ${displayName}` : ''}`
          }
          color="#ADD0B3"
          link="/dashboard/content/applications"
          icon={FileText}
        />

        <StatCard
          title="Applications This Month"
          value={
            loading
              ? 'Loading...'
              : appsStats?.filteredMonth?.count ?? appsStats?.summary?.thisMonthCount ?? '—'
          }
          sub={`Recent submissions overview${displayName ? ` • Managed by ${displayName}` : ''}`}
          color="#ADD0B3"
          icon={Calendar}
        />
      </div>

      {/* Footer */}
      <div className="mt-12 text-gray-500 text-sm border-t border-gray-200 pt-4 text-center">
        Last updated: {lastUpdated ? lastUpdated.toLocaleString() : '—'}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
