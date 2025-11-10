import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReport, exportReport } from "../../services/reportService";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Helpers de export (locales para esta vista)
const safeStringify = (v, max = 1000) => {
  if (v === null || v === undefined) return "";
  // Date objects -> ISO
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "object") {
    try {
      const seen = new WeakSet();
      const s = JSON.stringify(v, (k, val) => {
        if (val instanceof Date) return val.toISOString();
        if (typeof val === "object" && val !== null) {
          if (seen.has(val)) return "[Circular]";
          seen.add(val);
        }
        return val;
      });
      return s.length > max ? s.slice(0, max) + "…" : s;
    } catch (err) {
      try {
        return String(v);
      } catch (e) {
        return "[Objeto]";
      }
    }
  }
  return String(v);
};

// Aplana un objeto recursivamente usando notación con puntos
const flattenObject = (obj, prefix = "", res = {}, seen = new WeakSet()) => {
  if (obj === null || obj === undefined) return res;
  if (obj instanceof Date) {
    res[prefix.slice(0, -1)] = obj.toISOString();
    return res;
  }
  if (typeof obj !== "object") {
    res[prefix.slice(0, -1)] = String(obj);
    return res;
  }
  if (seen.has(obj)) {
    res[prefix.slice(0, -1)] = "[Circular]";
    return res;
  }
  seen.add(obj);

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      res[prefix.slice(0, -1)] = "";
    } else if (
      obj.every((el) => typeof el !== "object" && !(el instanceof Date))
    ) {
      res[prefix.slice(0, -1)] = obj.map((el) => String(el)).join("; ");
    } else {
      // Array with objects or dates: stringify elements safely
      res[prefix.slice(0, -1)] = obj.map((el) => safeStringify(el)).join(" | ");
    }
    return res;
  }

  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    const newKey = prefix ? `${prefix}${key}` : `${key}`;
    if (val === null || val === undefined) {
      res[newKey] = "";
    } else if (val instanceof Date) {
      res[newKey] = val.toISOString();
    } else if (typeof val === "object") {
      flattenObject(val, `${newKey}.`, res, seen);
    } else {
      res[newKey] = String(val);
    }
  });
  return res;
};

const normalizeDataToTable = (data) => {
  if (!data) return { columns: [], rows: [] };

  // If object with main array, use that array
  if (!Array.isArray(data) && typeof data === "object") {
    const keys = Object.keys(data);
    const arrayKey = keys.find((k) => Array.isArray(data[k]));
    if (arrayKey) return normalizeDataToTable(data[arrayKey]);
    const flat = flattenObject(data);
    const columns = Object.keys(flat);
    const rows = [columns.map((c) => flat[c] ?? "")];
    return { columns, rows };
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return { columns: [], rows: [] };
    // array of primitives
    if (data.every((el) => typeof el !== "object" && !(el instanceof Date))) {
      return { columns: ["value"], rows: data.map((v) => [String(v)]) };
    }
    // array of objects: flatten each
    const flats = data.map((el) => flattenObject(el || {}));
    const columnSet = new Set();
    flats.forEach((f) => Object.keys(f).forEach((k) => columnSet.add(k)));
    const columns = Array.from(columnSet);
    const rows = flats.map((f) =>
      columns.map((c) => safeStringify(f[c] ?? ""))
    );
    return { columns, rows };
  }

  return { columns: ["value"], rows: [[safeStringify(data)]] };
};

const exportToExcelLocal = (data, filename = "reporte.xlsx") => {
  try {
    const { columns, rows } = normalizeDataToTable(data);
    if (!columns.length) {
      alert("No hay datos para exportar");
      return;
    }
    const arr = rows.map((r) => {
      const obj = {};
      columns.forEach((c, i) => (obj[c] = r[i]));
      return obj;
    });
    const ws = XLSX.utils.json_to_sheet(arr);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    const outName = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;
    XLSX.writeFile(wb, outName);
  } catch (err) {
    console.error("Error exportando excel:", err);
    alert("Error al exportar Excel");
  }
};

const exportToCSVLocal = (data, filename = "reporte.csv") => {
  try {
    const { columns, rows } = normalizeDataToTable(data);
    if (!columns.length) {
      alert("No hay datos para exportar");
      return;
    }
    const escape = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;
    const csvRows = rows.map((r) => r.map((c) => escape(c)).join(","));
    const csv = [
      columns.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","),
      ...csvRows,
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Error exportando csv:", err);
    alert("Error al exportar CSV");
  }
};

const exportToPDFLocal = (data, filename = "reporte.pdf") => {
  try {
    const { columns, rows } = normalizeDataToTable(data);
    if (!columns.length) {
      alert("No hay datos para exportar");
      return;
    }
    const doc = new jsPDF();
    doc.text("Reporte", 14, 15);
    if (typeof doc.autoTable === "function") {
      doc.autoTable({ head: [columns], body: rows, startY: 25 });
    } else if (typeof autoTable === "function") {
      autoTable(doc, { head: [columns], body: rows, startY: 25 });
    } else {
      throw new Error("autoTable no disponible");
    }
    const outName = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
    doc.save(outName);
  } catch (err) {
    console.error("Error exportando a PDF:", err);
    alert("Error al exportar a PDF. Revisa la consola para más detalles.");
  }
};

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
      // Validar datos: debe existir y no estar vacío (array o objeto)
      const isEmpty =
        !data ||
        (Array.isArray(data) && data.length === 0) ||
        (typeof data === "object" &&
          !Array.isArray(data) &&
          Object.keys(data).length === 0);

      if (isEmpty) {
        alert("No hay datos para exportar. Genera el reporte primero.");
        return;
      }

      console.log("🔍 Exportando:", formato, "| Tipo:", tipo, "| Data:", data);

      if (formato === "excel") {
        exportToExcelLocal(data, `reporte_${tipo || "datos"}.xlsx`);
      } else if (formato === "csv") {
        exportToCSVLocal(data, `reporte_${tipo || "datos"}.csv`);
      } else if (formato === "pdf") {
        exportToPDFLocal(data, `reporte_${tipo || "datos"}.pdf`);
      } else {
        // fallback: intentar llamar al servicio si existe
        await exportReport(tipo, params, formato);
        alert(
          `Reporte exportado correctamente en formato ${formato.toUpperCase()}`
        );
      }
    } catch (err) {
      console.error("handleExport error:", err);
      alert("Error al exportar el reporte");
    }
  };

  const handleChange = (field, value) => {
    setParams({ ...params, [field]: value });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="mb-6 text-2xl font-bold text-gray-700">
        Centro de Reportes
      </h1>

      <div className="grid grid-cols-1 gap-4 p-4 mb-6 bg-white rounded-lg shadow md:grid-cols-4">
        {/* Tipo de Reporte */}
        <div>
          <label className="block mb-1 text-sm text-gray-600">
            Tipo de Reporte
          </label>
          <select
            className="w-full p-2 border rounded-md"
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
                  <label className="block mb-1 text-sm text-gray-600">
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md"
                    value={params.fecha_inicio}
                    onChange={(e) =>
                      handleChange("fecha_inicio", e.target.value)
                    }
                  />
                </>
              )}
              {campo === "fecha_fin" && (
                <>
                  <label className="block mb-1 text-sm text-gray-600">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md"
                    value={params.fecha_fin}
                    onChange={(e) => handleChange("fecha_fin", e.target.value)}
                  />
                </>
              )}
              {campo === "limite" && (
                <>
                  <label className="block mb-1 text-sm text-gray-600">
                    Límite
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    value={params.limite}
                    onChange={(e) => handleChange("limite", e.target.value)}
                  />
                </>
              )}
              {campo === "minimo" && (
                <>
                  <label className="block mb-1 text-sm text-gray-600">
                    Stock mínimo
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    value={params.minimo}
                    onChange={(e) => handleChange("minimo", e.target.value)}
                  />
                </>
              )}
              {campo === "meses" && (
                <>
                  <label className="block mb-1 text-sm text-gray-600">
                    Meses
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    value={params.meses}
                    onChange={(e) => handleChange("meses", e.target.value)}
                  />
                </>
              )}
              {campo === "periodo" && (
                <>
                  <label className="block mb-1 text-sm text-gray-600">
                    Periodo
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
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
                  <label className="block mb-1 text-sm text-gray-600">
                    Mínimo soporte
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    value={params.min_soporte}
                    onChange={(e) =>
                      handleChange("min_soporte", e.target.value)
                    }
                  />
                </>
              )}
            </div>
          ))}
      </div>

      {/* Botón para ir al reporte dinámico (ruta separada) */}
      <button
        onClick={() => navigate("/admin/reportes/dinamico")}
        className="px-4 py-2 mb-4 text-white bg-purple-600 rounded hover:bg-purple-700"
      >
        Reporte Dinámico
      </button>

      {/* Botones */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleFetch}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Generar Reporte
        </button>

        <button
          onClick={() => handleExport("excel")}
          className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
          disabled={
            !data ||
            (Array.isArray(data) && data.length === 0) ||
            (typeof data === "object" &&
              !Array.isArray(data) &&
              Object.keys(data).length === 0)
          }
        >
          Exportar Excel
        </button>

        <button
          onClick={() => handleExport("csv")}
          className="px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
          disabled={
            !data ||
            (Array.isArray(data) && data.length === 0) ||
            (typeof data === "object" &&
              !Array.isArray(data) &&
              Object.keys(data).length === 0)
          }
        >
          Exportar CSV
        </button>

        <button
          onClick={() => handleExport("pdf")}
          className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
          disabled={
            !data ||
            (Array.isArray(data) && data.length === 0) ||
            (typeof data === "object" &&
              !Array.isArray(data) &&
              Object.keys(data).length === 0)
          }
        >
          Exportar PDF
        </button>
      </div>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading && <div className="text-gray-600">Cargando...</div>}

      {/* Tabla de resultados */}
      {!loading && data && (
        <>
          {/* Usamos RenderData para mostrar arrays y objetos (componente recursivo) */}
          {Array.isArray(data) && (
            <RenderData data={data} title={"Resultados"} />
          )}

          {!Array.isArray(data) &&
            typeof data === "object" &&
            (() => {
              const keys = Object.keys(data);
              const arrayKey = keys.find((k) => Array.isArray(data[k]));

              if (arrayKey) {
                return (
                  <>
                    <h2 className="mt-4 mb-2 text-lg font-semibold text-gray-700">
                      {arrayKey.replaceAll("_", " ").toUpperCase()}
                    </h2>
                    <RenderData
                      data={data[arrayKey]}
                      title={arrayKey.replaceAll("_", " ").toUpperCase()}
                    />

                    {keys
                      .filter((k) => k !== arrayKey)
                      .map((k) => (
                        <div key={k} className="mt-4">
                          <RenderData
                            data={data[k]}
                            title={k.replaceAll("_", " ")}
                          />
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
      <div className="mb-4 overflow-x-auto bg-white rounded-lg shadow">
        {title && (
          <h3 className="px-4 pt-3 text-lg font-semibold text-gray-700">
            {title}
          </h3>
        )}
        <table className="min-w-full mt-2 border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th
                  key={key}
                  className="px-4 py-2 text-sm text-left text-gray-600 border-b"
                >
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
                    {typeof val === "object"
                      ? JSON.stringify(val)
                      : String(val)}
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
      <div className="p-4 mb-4 bg-white rounded-lg shadow">
        {title && (
          <h3 className="mb-3 text-lg font-semibold text-gray-700">{title}</h3>
        )}
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="mb-4">
            <h4 className="mb-1 font-medium text-gray-700">
              {key.replaceAll("_", " ")}
            </h4>
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
