import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLayout from "./layouts/AdminLayout";
import Usuarios from "./pages/admin/Usuarios";
import Reportes from "./pages/admin/Reportes";
import Dinamico from "./pages/admin/Dinamico";
import Proveedores from "./pages/admin/proveedores";
import Categorias from "./pages/admin/categorias";
import Productos from "./pages/admin/Productos";
import Suministros from "./pages/admin/suministros";
import { VentasPage } from "./pages/admin/ventas";
import ReportesPrediccion from "./pages/admin/ReportesPrediccion";
import StripeCheckout from "./components/StripeCheckout";
import MisComprasPage from "./pages/MisCompras";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* 🔹 RUTAS PÚBLICAS */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/checkout"
              element={<StripeCheckout onSuccess={() => window.location.replace("/")} />}
            />
            <Route path="/mis-compras" element={<MisComprasPage />} />

            {/* 🔒 RUTAS ADMIN PROTEGIDAS */}
            <Route
              path="/admin/usuarios"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <AdminLayout>
                    <Usuarios />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/proveedores"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <AdminLayout>
                    <Proveedores />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categorias"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <AdminLayout>
                    <Categorias />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/productos"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <AdminLayout>
                    <Productos />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/suministros"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <AdminLayout>
                    <Suministros />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/ventas"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <AdminLayout>
                    <VentasPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reportes"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <AdminLayout>
                    <Reportes />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reportes/dinamico"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <AdminLayout>
                    <Dinamico />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reportes/prediccion"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <AdminLayout>
                    <ReportesPrediccion />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
