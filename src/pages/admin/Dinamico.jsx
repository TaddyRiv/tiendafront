import React, { useState } from "react";
import http from "../../services/http";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Helpers de exportación
const exportToExcel = (data, filename = "reporte.xlsx") => {
  try {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      alert("No hay datos para exportar");
      return;
    }

    const arr = Array.isArray(data) ? data : [data];
    const ws = XLSX.utils.json_to_sheet(arr);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    // Forzar extensión .xlsx
    const outName = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;
    XLSX.writeFile(wb, outName);
  } catch (err) {
    console.error("Error exportando a Excel:", err);
    alert("Error al exportar a Excel");
  }
};

const exportToPDF = (data, filename = "reporte.pdf") => {
  try {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      alert("No hay datos para exportar");
      return;
    }

    const arr = Array.isArray(data) ? data : [data];
    // Normalizar columnas y filas: asegurar que las columnas sean strings y las celdas también
    let columns = Object.keys(arr[0] || {});
    if (!Array.isArray(columns) || columns.length === 0) {
      // intentar inferir columnas a partir de la primera fila iterando sus claves
      const first = arr[0] || {};
      columns = [];
      for (const k in first) {
        if (Object.prototype.hasOwnProperty.call(first, k))
          columns.push(String(k));
      }
    }
    columns = columns.map((c) =>
      c === null || c === undefined ? "" : String(c)
    );

    const rows = arr.map((obj) =>
      columns.map((c) => {
        const v = obj[c];
        // formatCell siempre devuelve string seguro
        return formatCell(v, 1000);
      })
    );

    // Debug: logear una muestra para inspección en consola si algo falla
    console.debug("exportToPDF: columns:", columns);
    console.debug("exportToPDF: sample rows:", rows.slice(0, 3));

    const doc = new jsPDF();
    doc.text("Reporte IA - Datos Generados", 14, 15);
    // autoTable
    // head expects array of arrays
    try {
      if (typeof doc.autoTable === "function") {
        doc.autoTable({
          head: [columns],
          body: rows,
          startY: 25,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [240, 240, 240] },
          columnStyles: {},
        });
      } else if (typeof autoTable === "function") {
        // algunos bundles exponen autoTable como función default
        autoTable(doc, {
          head: [columns],
          body: rows,
          startY: 25,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [240, 240, 240] },
          columnStyles: {},
        });
      } else {
        throw new Error(
          "autoTable no está disponible (doc.autoTable y import default fallaron)"
        );
      }
    } catch (autoErr) {
      console.error("autoTable error:", autoErr);
      // rethrow to ser atrapado por el catch exterior y mostrar alert genérico
      throw autoErr;
    }

    const outName = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
    doc.save(outName);
  } catch (err) {
    // Loguear con detalle y sugerir pasar por consola
    console.error("Error exportando a PDF:", err);
    // mostrar mensaje conciso al usuario
    alert("Error al exportar a PDF. Revisa la consola para más detalles.");
  }
};

// Formatea valores para celdas de tabla: convierte objetos a JSON, booleans a Sí/No,
// y trunca strings muy largos para evitar roturas de layout.
const formatCell = (v, max = 300) => {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") {
    try {
      // Safe stringify to avoid circular reference errors
      const seen = new WeakSet();
      const s = JSON.stringify(v, (k, val) => {
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
  if (typeof v === "boolean") return v ? "Sí" : "No";
  return String(v);
};

const Dinamico = () => {
  // IA
  const [texto, setTexto] = useState("");
  const [grabando, setGrabando] = useState(false);
  const [respuestaIA, setRespuestaIA] = useState(null);
  const [loadingIA, setLoadingIA] = useState(false);
  const [errorIA, setErrorIA] = useState("");

  //let mediaRecorder;
  //let audioChunks = [];

  // Grabar voz con la API del navegador
  const iniciarGrabacion = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      let audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        console.log("🎧 Tamaño del audio:", audioBlob.size, "bytes");

        if (audioBlob.size < 1000) {
          setErrorIA("⚠️ El audio grabado está vacío o demasiado corto.");
          return;
        }

        await enviarAudioIA(audioBlob);
      };

      mediaRecorder.start();
      setGrabando(true);

      // Graba durante 5 segundos
      setTimeout(() => {
        if (mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
          setGrabando(false);
        }
      }, 5000);
    } catch (error) {
      setErrorIA("⚠️ No se pudo acceder al micrófono.");
      console.error(error);
    }
  };

  // Enviar audio a la API /reportes/voz/
  const enviarAudioIA = async (audioBlob) => {
    setLoadingIA(true);
    setErrorIA("");
    setRespuestaIA(null);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "grabacion.webm");

      const res = await http.post("/reportes/voz/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setRespuestaIA(res.data);
    } catch (err) {
      console.error(err);
      setErrorIA("Error al procesar el audio con la IA.");
    } finally {
      setLoadingIA(false);
    }
  };

  // 🧠 Enviar texto directo a la IA (/reportes/texto/)
  const enviarTextoIA = async () => {
    if (!texto.trim()) return;
    setLoadingIA(true);
    setErrorIA("");
    setRespuestaIA(null);

    try {
      const res = await http.post("/reportes/texto/", { texto });
      setRespuestaIA(res.data);
    } catch (err) {
      console.error(err);
      setErrorIA("Error al comunicarse con la IA.");
    } finally {
      setLoadingIA(false);
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-700">
        📊 Reporte Dinámico + Asistente IA
      </h1>

      {/* 🔹 Sección IA */}
      <div className="p-5 space-y-4 bg-white rounded-lg shadow">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-700">
          🧠 Asistente Inteligente
        </h2>

        <div className="flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            className="flex-1 p-2 border rounded-md"
            placeholder="Ej: Ventas de este mes, productos más vendidos..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
          <button
            onClick={enviarTextoIA}
            disabled={loadingIA}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            {loadingIA ? "Procesando..." : "Enviar Texto"}
          </button>

          <button
            onClick={iniciarGrabacion}
            disabled={grabando}
            className={`${
              grabando
                ? "bg-red-500 animate-pulse"
                : "bg-green-600 hover:bg-green-700"
            } text-white px-4 py-2 rounded`}
          >
            {grabando ? "🎙️ Grabando..." : "🎤 Hablar"}
          </button>
        </div>

        {errorIA && <div className="mt-2 text-red-600">{errorIA}</div>}

        {respuestaIA && (
          <div className="mt-6 space-y-8">
            {/* 🧠 Interpretación */}
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="flex items-center gap-2 mb-2 font-semibold text-gray-700">
                <span>🧩 Interpretación de la IA</span>
              </h3>
              <pre className="p-2 overflow-x-auto text-sm bg-gray-100 rounded">
                {JSON.stringify(respuestaIA.interpretacion, null, 2)}
              </pre>
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="flex items-center gap-2 font-semibold text-gray-700">
                  <span>📊 Datos del Reporte</span>
                </h3>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      exportToExcel(respuestaIA.datos, "reporte_ia.xlsx")
                    }
                    className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                  >
                    📗 Exportar Excel
                  </button>
                  <button
                    onClick={() =>
                      exportToPDF(respuestaIA.datos, "reporte_ia.pdf")
                    }
                    className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                  >
                    📄 Exportar PDF
                  </button>
                </div>
              </div>

              {respuestaIA.datos ? (
                <div className="overflow-x-auto">
                  {(() => {
                    const datosArray = Array.isArray(respuestaIA.datos)
                      ? respuestaIA.datos
                      : [respuestaIA.datos];

                    return (
                      <table className="w-full text-sm border border-gray-200">
                        <thead className="bg-gray-100 border-b">
                          <tr>
                            {Object.keys(datosArray[0] || {}).map((key) => (
                              <th
                                key={key}
                                className="px-3 py-2 font-semibold text-left"
                              >
                                {key.replace(/_/g, " ").toUpperCase()}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {datosArray.map((fila, i) => (
                            <tr key={i} className="border-b hover:bg-gray-50">
                              {Object.values(fila).map((valor, j) => (
                                <td key={j} className="px-3 py-2">
                                  {formatCell(valor)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Sin datos disponibles
                </div>
              )}
            </div>

            {/* 💬 Respuesta natural */}
            <div className="p-4 rounded-lg shadow bg-green-50">
              <h3 className="flex items-center gap-2 mb-2 font-semibold text-gray-700">
                💬 Respuesta Natural
              </h3>
              <div className="text-gray-800 whitespace-pre-line">
                {respuestaIA.respuesta}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🔹 Constructor manual (opcional) */}
      <div className="p-5 bg-white rounded-lg shadow">
        <h2 className="mb-3 text-lg font-semibold text-gray-700">
          ⚙️ Constructor de Reportes Manual
        </h2>
        <p className="text-gray-500">
          Aquí puedes seguir usando los filtros, métricas y agrupaciones
          manuales. (Puedes integrarlo con la IA si lo deseas más adelante).
        </p>
      </div>
    </div>
  );
};

export default Dinamico;
