import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLayout from "./layouts/AdminLayout";
import Usuarios from "./pages/admin/Usuarios";
import Proveedores from "./pages/admin/proveedores";
import Categorias from "./pages/admin/categorias";
import Productos from "./pages/admin/Productos";
import Suministros from "./pages/admin/suministros";

function App() {
  return (
    <AuthProvider>
      {" "}
      {/* Sesión global */}
      <CartProvider>
        {" "}
        {/* Carrito global */}
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Panel administrativo */}
            <Route path="/admin" element={<AdminLayout></AdminLayout>} />
            <Route
              path="/admin/usuarios"
              element={
                <AdminLayout>
                  <Usuarios />
                  <h1>Gestión de Usuarios</h1>
                </AdminLayout>
              }
            />
            <Route
              path="/admin/clientes"
              element={
                <AdminLayout>
                  <h1>Gestión de Clientes</h1>
                </AdminLayout>
              }
            />
            <Route
              path="/admin/proveedores"
              element={
                <AdminLayout>
                  <Proveedores />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/categorias"
              element={
                <AdminLayout>
                  <Categorias />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/productos"
              element={
                <AdminLayout>
                  <Productos />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/suministros"
              element={
                <AdminLayout>
                  <Suministros />
                </AdminLayout>
              }
            />

            <Route
              path="/admin/ventas"
              element={
                <AdminLayout>
                  <h1>Gestión de Ventas</h1>
                </AdminLayout>
              }
            />
            <Route
              path="/admin/reportes"
              element={
                <AdminLayout>
                  <h1>Reportes</h1>
                </AdminLayout>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
