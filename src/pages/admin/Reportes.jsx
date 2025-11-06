import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReport, exportReport } from "../../services/reportService";

const Reportes = () => {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState("");
  const [params, setParams] = useState({
    fecha_inicio: "",
    fecha_fin: "",
    limite: 10,
    minimo: 10,
    meses: 12,
    periodo: "mes_actual",
    min_soporte: 3,
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tiposReportes = [
    { value: "ventas-periodo", label: "📈 Ventas por Período" },
    { value: "top-productos", label: "🏆 Top Productos" },
    { value: "bajo-stock", label: "⚠️ Bajo Stock" },
    { value: "ventas-diarias", label: "📅 Ventas Diarias" },
    { value: "resumen-creditos", label: "💳 Resumen Créditos" },
    { value: "analisis-categorias", label: "📦 Análisis Categorías" },
    { value: "rendimiento-empleados", label: "👨‍💼 Rendimiento Empleados" },
    { value: "clientes-frecuentes", label: "🧍 Clientes Frecuentes" },
    { value: "flujo-caja", label: "💰 Flujo de Caja" },
    { value: "rotacion-inventario", label: "🔄 Rotación Inventario" },
    { value: "rfm", label: "📊 RFM Clientes" },
    { value: "tendencias", label: "📉 Tendencias Ventas" },
    { value: "cohortes", label: "📆 Cohortes Retención" },
    { value: "cartera-creditos", label: "💵 Cartera Créditos" },
    { value: "market-basket", label: "🛒 Market Basket" },
    { value: "dashboard", label: "📊 Dashboard Completo" },
    
  ];



  // Campos que necesita cada endpoint
  const camposPorReporte = {
    "ventas-periodo": ["fecha_inicio", "fecha_fin"],
    "top-productos": ["fecha_inicio", "fecha_fin", "limite"],
    "bajo-stock": ["minimo"],
    "ventas-diarias": ["fecha_inicio", "fecha_fin"],
    "resumen-creditos": [],
    "analisis-categorias": ["fecha_inicio", "fecha_fin"],
    "rendimiento-empleados": ["fecha_inicio", "fecha_fin"],
    "clientes-frecuentes": ["limite"],
    "flujo-caja": ["fecha_inicio", "fecha_fin"],
    "rotacion-inventario": ["fecha_inicio", "fecha_fin"],
    rfm: [],
    tendencias: ["meses"],
    cohortes: ["meses"],
    "cartera-creditos": [],
    "market-basket": ["fecha_inicio", "fecha_fin", "min_soporte"],
    dashboard: ["periodo"],
  };

  const handleFetch = async () => {
    if (!tipo) return setError("Selecciona un tipo de reporte");
    setError("");
    setLoading(true);
    setData([]);

    try {
      const activos = camposPorReporte[tipo];
      const queryParams = {};

      activos.forEach((campo) => {
        if (params[campo]) queryParams[campo] = params[campo];
      });

      const res = await getReport(tipo, queryParams);
      setData(Array.isArray(res) ? res : res.datos || res);
    } catch (err) {
      console.error(err);
      setError("Error al obtener el reporte");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (formato) => {
    try {
      await exportReport(tipo, params, formato);
      alert(`Reporte exportado correctamente en formato ${formato.toUpperCase()}`);
    } catch (err) {
      alert("Error al exportar el reporte");
    }
  };

  const handleChange = (field, value) => {
    setParams({ ...params, [field]: value });
  };
   
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Centro de Reportes</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-white p-4 rounded-lg shadow">
        {/* Tipo de Reporte */}
        <div>
          <label className="block text-gray-600 text-sm mb-1">Tipo de Reporte</label>
          <select
            className="w-full border rounded-md p-2"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="">-- Selecciona --</option>
            {tiposReportes.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Campos dinámicos según el tipo */}
        {tipo &&
          camposPorReporte[tipo].map((campo) => (
            <div key={campo}>
              {campo === "fecha_inicio" && (
                <>
                  <label className="block text-gray-600 text-sm mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    className="w-full border rounded-md p-2"
                    value={params.fecha_inicio}
                    onChange={(e) => handleChange("fecha_inicio", e.target.value)}
                  />
                </>
              )}
              {campo === "fecha_fin" && (
                <>
                  <label className="block text-gray-600 text-sm mb-1">Fecha Fin</label>
                  <input
                    type="date"
                    className="w-full border rounded-md p-2"
                    value={params.fecha_fin}
                    onChange={(e) => handleChange("fecha_fin", e.target.value)}
                  />
                </>
              )}
              {campo === "limite" && (
                <>
                  <label className="block text-gray-600 text-sm mb-1">Límite</label>
                  <input
                    type="number"
                    className="w-full border rounded-md p-2"
                    value={params.limite}
                    onChange={(e) => handleChange("limite", e.target.value)}
                  />
                </>
              )}
              {campo === "minimo" && (
                <>
                  <label className="block text-gray-600 text-sm mb-1">Stock mínimo</label>
                  <input
                    type="number"
                    className="w-full border rounded-md p-2"
                    value={params.minimo}
                    onChange={(e) => handleChange("minimo", e.target.value)}
                  />
                </>
              )}
              {campo === "meses" && (
                <>
                  <label className="block text-gray-600 text-sm mb-1">Meses</label>
                  <input
                    type="number"
                    className="w-full border rounded-md p-2"
                    value={params.meses}
                    onChange={(e) => handleChange("meses", e.target.value)}
                  />
                </>
              )}
              {campo === "periodo" && (
                <>
                  <label className="block text-gray-600 text-sm mb-1">Periodo</label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={params.periodo}
                    onChange={(e) => handleChange("periodo", e.target.value)}
                  >
                    <option value="hoy">Hoy</option>
                    <option value="semana_actual">Semana actual</option>
                    <option value="mes_actual">Mes actual</option>
                    <option value="mes_anterior">Mes anterior</option>
                    <option value="trimestre">Trimestre</option>
                    <option value="año">Año</option>
                  </select>
                </>
              )}
              {campo === "min_soporte" && (
                <>
                  <label className="block text-gray-600 text-sm mb-1">Mínimo soporte</label>
                  <input
                    type="number"
                    className="w-full border rounded-md p-2"
                    value={params.min_soporte}
                    onChange={(e) => handleChange("min_soporte", e.target.value)}
                  />
                </>
              )}
            </div>
          ))}
  </div>

  {/* Botón para ir al reporte dinámico (ruta separada) */}
  <button
    onClick={() => navigate("/admin/reportes/dinamico")}
    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mb-4"
  >
    Reporte Dinámico
  </button>

  {/* Botones */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleFetch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Generar Reporte
        </button>

        <button
          onClick={() => handleExport("excel")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={!data.length}
        >
          Exportar Excel
        </button>

        <button
          onClick={() => handleExport("csv")}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          disabled={!data.length}
        >
          Exportar CSV
        </button>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading && <div className="text-gray-600">Cargando...</div>}

      {/* Tabla de resultados */}
      {!loading && data && (
        <>
          {/* Usamos RenderData para mostrar arrays y objetos (componente recursivo) */}
          {Array.isArray(data) && <RenderData data={data} title={"Resultados"} />}

          {!Array.isArray(data) && typeof data === "object" && (() => {
            const keys = Object.keys(data);
            const arrayKey = keys.find((k) => Array.isArray(data[k]));

            if (arrayKey) {
              return (
                <>
                  <h2 className="text-lg font-semibold mb-2 mt-4 text-gray-700">
                    {arrayKey.replaceAll("_", " ").toUpperCase()}
                  </h2>
                  <RenderData data={data[arrayKey]} title={arrayKey.replaceAll("_", " ").toUpperCase()} />

                  {keys
                    .filter((k) => k !== arrayKey)
                    .map((k) => (
                      <div key={k} className="mt-4">
                        <RenderData data={data[k]} title={k.replaceAll("_", " ")} />
                      </div>
                    ))}
                </>
              );
            }

            // Si no tiene arrays, usamos RenderData para mostrar el objeto completo
            return <RenderData data={data} title={"Detalles"} />;
          })()}
        </>
      )}
    </div>
  );
};
// Nota: `TablaReportes` eliminado — usamos `RenderData` para renderizar arrays/objetos.

// Componente recursivo para renderizar arrays/objetos/texto de forma legible
const RenderData = ({ data, title }) => {
  if (data === null || data === undefined) return null;

  // Si es un array, mostramos tabla
  if (Array.isArray(data)) {
    if (data.length === 0) return <p className="text-gray-500">Sin datos</p>;
    return (
      <div className="overflow-x-auto bg-white rounded-lg shadow mb-4">
        {title && <h3 className="text-lg font-semibold text-gray-700 px-4 pt-3">{title}</h3>}
        <table className="min-w-full border border-gray-200 mt-2">
          <thead className="bg-gray-100">
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key} className="px-4 py-2 text-left text-sm text-gray-600 border-b">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {Object.values(row).map((val, i) => (
                  <td key={i} className="px-4 py-2 text-sm border-b">
                    {typeof val === "object" ? JSON.stringify(val) : String(val)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Si es un objeto, mostramos cada clave como bloque separado
  if (typeof data === "object") {
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        {title && <h3 className="text-lg font-semibold mb-3 text-gray-700">{title}</h3>}
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="mb-4">
            <h4 className="font-medium text-gray-700 mb-1">{key.replaceAll("_", " ")}</h4>
            <div className="pl-3 border-l border-gray-200">
              <RenderData data={value} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Caso base: texto o número
  return <p className="text-gray-700">{String(data)}</p>;
};


export default Reportes;
