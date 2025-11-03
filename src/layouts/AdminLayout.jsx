import React from "react";
import Sidebar from "../components/Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 ml-64 p-6">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
