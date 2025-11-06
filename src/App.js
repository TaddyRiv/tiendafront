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
import Ventas from "./pages/admin/ventas";

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
                  <Ventas />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/reportes"
              element={
                <AdminLayout>
                  <Reportes />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/reportes/dinamico"
              element={
                <AdminLayout>
                  <Dinamico />
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
