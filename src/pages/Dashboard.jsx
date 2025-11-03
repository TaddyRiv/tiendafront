import React from "react";
import AdminLayout from "../layouts/AdminLayout";

const Dashboard = () => {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Panel Administrativo</h1>
      <p className="text-gray-600">
        Bienvenido al panel del administrador. Desde aquí puedes gestionar usuarios, productos y ventas.
      </p>
    </AdminLayout>
  );
};
export default Dashboard;
