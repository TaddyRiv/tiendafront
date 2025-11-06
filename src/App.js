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
function App() {
  return (
    <AuthProvider> {/* Sesión global */}
      <CartProvider> {/* Carrito global */}
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            

            {/* Panel administrativo */}
             <Route
              path="/admin"
              element={
                <AdminLayout>
                </AdminLayout>
              }
            />
            <Route
              path="/admin/usuarios"
              element={
                <AdminLayout>
                  <Usuarios />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/productos"
              element={
                <AdminLayout>
                  <h1>Gestión de Productos</h1>
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
