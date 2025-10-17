import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../layout/DashboardLayout';



/**
 * Dashboard Component
 * Main dashboard for ClathraEnergies Admin Dashboard
 */
const Dashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-[#ADD0B3] mb-4">
        Welcome to ClathraEnergies Admin Dashboard
      </h1>
      <p className="text-gray-600 mb-6">Hello, {user?.full_name || 'User'} ({user?.role})</p>
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-300">
        <h2 className="text-lg font-semibold text-[#ADD0B3] mb-2">Overview</h2>
        <p className="text-gray-600">Select a section from the sidebar to manage content or users.</p>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;