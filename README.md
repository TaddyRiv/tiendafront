# tiendafront — Frontend de Tienda E-Commerce

Aplicación web frontend para una tienda en línea con panel de administración completo. Construida con **React 19** y **Tailwind CSS**, incluye gestión de productos, ventas, inventario, reportes y pagos con Stripe.

---

## ¿Qué contiene este repositorio?

### Tipo de proyecto
- **Framework:** React 19.2.0 (Create React App)
- **Lenguaje:** JavaScript (JSX)
- **Estilos:** Tailwind CSS 3.4.14
- **Propósito:** Plataforma de e-commerce con tienda pública y panel de administración

---

## Estructura de carpetas

```
tiendafront/
├── public/                        # Archivos estáticos (HTML, íconos, manifest)
├── src/
│   ├── components/                # Componentes reutilizables de UI
│   │   ├── dashboard/             # Gráficas y métricas del dashboard admin
│   │   │   ├── InventarioChart.jsx      # Gráfica de inventario
│   │   │   ├── InventoryTable.jsx       # Tabla de inventario
│   │   │   ├── MetricCard.jsx           # Tarjetas de KPIs
│   │   │   ├── TopProductosChart.jsx    # Gráfica de productos más vendidos
│   │   │   └── VentasChart.jsx          # Gráfica de ventas en el tiempo
│   │   ├── CartSidebar.jsx        # Carrito de compras lateral
│   │   ├── Hero.jsx               # Sección hero de la tienda
│   │   ├── Navbar.jsx             # Barra de navegación con contador de carrito
│   │   ├── ProductCard.jsx        # Tarjeta de producto individual
│   │   ├── ProtectedRoute.jsx     # Protección de rutas por rol de usuario
│   │   ├── RenderData.jsx         # Componente genérico de renderizado de datos
│   │   ├── Sidebar.jsx            # Menú lateral del panel admin
│   │   └── StripeCheckout.jsx     # Integración de pago con Stripe
│   │
│   ├── context/                   # Estado global con React Context API
│   │   ├── AuthContext.jsx        # Autenticación: login, logout, usuario actual
│   │   └── CartContext.jsx        # Carrito: agregar/quitar productos, totales
│   │
│   ├── layouts/
│   │   └── AdminLayout.jsx        # Layout envolvente del panel de administración
│   │
│   ├── pages/                     # Páginas de la aplicación
│   │   ├── Home.jsx               # Tienda pública: catálogo y compras
│   │   ├── Login.jsx              # Formulario de inicio de sesión
│   │   ├── Register.jsx           # Registro de nuevos usuarios
│   │   ├── MisCompras.jsx         # Historial de compras del usuario
│   │   ├── Dashboard.jsx          # Dashboard admin con métricas y gráficas
│   │   └── admin/                 # Páginas exclusivas del administrador
│   │       ├── Productos.jsx           # CRUD de productos
│   │       ├── Usuarios.jsx            # Gestión de usuarios
│   │       ├── categorias.jsx          # Gestión de categorías
│   │       ├── proveedores.jsx         # Gestión de proveedores
│   │       ├── suministros.jsx         # Gestión de suministros
│   │       ├── Reportes.jsx            # Reportes estándar
│   │       ├── Dinamico.jsx            # Reportes dinámicos
│   │       ├── ReportesPrediccion.jsx  # Reportes de predicción
│   │       └── ventas/                 # Módulo completo de ventas
│   │           ├── VentasPage.jsx           # Página principal de ventas
│   │           ├── VentasTable.jsx          # Tabla de ventas
│   │           ├── VentaForm.jsx            # Formulario para registrar ventas
│   │           ├── VentaDetallesModal.jsx   # Modal de detalles de venta
│   │           ├── CuotasCreditoModal.jsx   # Modal de cuotas a crédito
│   │           ├── PagarCuotaModal.jsx      # Modal para pagar cuotas
│   │           ├── StripePayDialog.jsx      # Diálogo de pago con Stripe
│   │           └── index.js                 # Exportaciones del módulo
│   │
│   ├── services/                  # Capa de comunicación con la API backend
│   │   ├── api.js                 # Instancia Axios con token Bearer automático
│   │   ├── authService.js         # Login, registro, logout
│   │   ├── productoService.js     # CRUD de productos
│   │   ├── ventasService.js       # Operaciones de ventas
│   │   ├── categoriaService.js    # Categorías
│   │   ├── proveedorService.js    # Proveedores
│   │   ├── proveedorProductoService.js  # Productos por proveedor
│   │   ├── suministros (via proveedorProductoService)
│   │   ├── dashboardService.js    # Datos para el dashboard (gráficas, métricas)
│   │   ├── reportService.js       # Generación de reportes
│   │   ├── usuariosService.js     # Gestión de usuarios
│   │   ├── clientesService.js     # Datos de clientes
│   │   ├── empleadoService.js     # Datos de empleados
│   │   ├── pagosService.js        # Operaciones de pagos
│   │   ├── rolesService.js        # Roles y permisos
│   │   └── http.js                # Utilidades HTTP
│   │
│   ├── App.js                     # Componente raíz con todas las rutas
│   ├── App.css                    # Estilos globales de la app
│   ├── index.js                   # Punto de entrada de React
│   └── index.css                  # Importaciones de Tailwind CSS
│
├── tailwind.config.js             # Configuración de Tailwind CSS
├── postcss.config.js              # Configuración de PostCSS
└── package.json                   # Dependencias y scripts npm
```

---

## Rutas de la aplicación

### Rutas públicas
| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | Home | Catálogo de productos con carrito de compras |
| `/login` | Login | Inicio de sesión |
| `/register` | Register | Registro de usuarios |
| `/checkout` | StripeCheckout | Proceso de pago con Stripe |
| `/mis-compras` | MisCompras | Historial de compras del usuario |

### Rutas del panel de administración (requiere rol `admin` o `superadmin`)
| Ruta | Página | Descripción |
|------|--------|-------------|
| `/admin` | Dashboard | Métricas, gráficas e inventario |
| `/admin/usuarios` | Usuarios | Gestión de usuarios del sistema |
| `/admin/proveedores` | Proveedores | Gestión de proveedores |
| `/admin/categorias` | Categorías | Gestión de categorías de productos |
| `/admin/productos` | Productos | CRUD completo de productos |
| `/admin/suministros` | Suministros | Gestión de suministros |
| `/admin/ventas` | Ventas | Módulo completo de ventas y crédito |
| `/admin/reportes` | Reportes | Reportes estándar con exportación PDF/Excel |
| `/admin/reportes/dinamico` | Dinámico | Reportes personalizados dinámicos |
| `/admin/reportes/prediccion` | Predicción | Reportes de predicción de demanda |

---

## Tecnologías y dependencias principales

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| Framework Frontend | React | 19.2.0 |
| Enrutamiento | React Router DOM | 7.9.5 |
| Estilos | Tailwind CSS | 3.4.14 |
| Cliente HTTP | Axios | 1.13.1 |
| Íconos | Lucide React | 0.552.0 |
| Gráficas | Recharts | 3.3.0 |
| Tablas | React Data Table Component | 7.7.0 |
| Pagos | Stripe.js + React Stripe | 8.3.0 / 5.3.0 |
| Alertas | SweetAlert2 | 11.26.3 |
| Exportar PDF | jsPDF + jsPDF-AutoTable | 3.0.3 / 5.0.2 |
| Exportar Excel | XLSX | 0.18.5 |
| Pruebas | Jest + React Testing Library | — |

---

## Instalación y uso

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crear un archivo `.env` en la raíz del proyecto:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
```

### 3. Iniciar en modo desarrollo
```bash
npm start
```
Abre [http://localhost:3000](http://localhost:3000) en el navegador.

### 4. Compilar para producción
```bash
npm run build
```
Genera la carpeta `build/` optimizada para despliegue.

### 5. Ejecutar pruebas
```bash
npm test
```

---

## Arquitectura

### Gestión de estado
- **AuthContext:** Almacena el usuario autenticado y el token JWT en `localStorage`. Controla el acceso a rutas protegidas.
- **CartContext:** Maneja el carrito de compras (agregar, quitar, calcular totales).
- **Estado local:** Para datos específicos de cada componente/página.

### Comunicación con el backend
- Todas las llamadas a la API pasan por `src/services/api.js`
- Se inyecta automáticamente el token Bearer en cada solicitud autenticada
- Variable de entorno `REACT_APP_API_URL` define la URL base del backend

### Protección de rutas
- `ProtectedRoute` verifica que el usuario tenga el rol correcto (`admin` o `superadmin`) antes de renderizar páginas del panel de administración
- Redirige al login si no hay sesión activa

### Exportaciones
- **PDF:** usando `jsPDF` y `jsPDF-AutoTable` en páginas de reportes
- **Excel:** usando `XLSX` para exportar datos tabulares 