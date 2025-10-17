import React, { useState } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header fixed */}
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 mt-16">
        {/* Sidebar (fixed) */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main
          className="
            flex-1 
            ml-0 md:ml-64   
            p-4 md:p-6 
            overflow-y-auto 
            h-[calc(100vh-4rem)] 
            transition-all duration-300
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
