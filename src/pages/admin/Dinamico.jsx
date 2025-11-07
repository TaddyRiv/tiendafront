import React, { useState } from "react";
import http from "../../services/http"; 
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

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
    const columns = Object.keys(arr[0] || {});
    const rows = arr.map((obj) =>
      columns.map((c) => {
        const v = obj[c];
        if (v === null || v === undefined) return "";
        if (typeof v === "object") return JSON.stringify(v);
        return String(v);
      })
    );

    const doc = new jsPDF();
    doc.text("Reporte IA - Datos Generados", 14, 15);
    // autoTable
    // head expects array of arrays
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [240, 240, 240] },
      columnStyles: {},
    });

    const outName = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
    doc.save(outName);
  } catch (err) {
    console.error("Error exportando a PDF:", err);
    alert("Error al exportar a PDF");
  }
};

// Formatea valores para celdas de tabla: convierte objetos a JSON, booleans a Sí/No,
// y trunca strings muy largos para evitar roturas de layout.
const formatCell = (v, max = 300) => {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") {
    try {
      const s = JSON.stringify(v);
      return s.length > max ? s.slice(0, max) + "…" : s;
    } catch (err) {
      return String(v);
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
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      <h1 className="text-2xl font-bold text-gray-700">
        📊 Reporte Dinámico + Asistente IA
      </h1>

      {/* 🔹 Sección IA */}
      <div className="bg-white rounded-lg shadow p-5 space-y-4">
        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
          🧠 Asistente Inteligente
        </h2>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            className="flex-1 border rounded-md p-2"
            placeholder="Ej: Ventas de este mes, productos más vendidos..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
          <button
            onClick={enviarTextoIA}
            disabled={loadingIA}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loadingIA ? "Procesando..." : "Enviar Texto"}
          </button>

          <button
            onClick={iniciarGrabacion}
            disabled={grabando}
            className={`${grabando
              ? "bg-red-500 animate-pulse"
              : "bg-green-600 hover:bg-green-700"
              } text-white px-4 py-2 rounded`}
          >
            {grabando ? "🎙️ Grabando..." : "🎤 Hablar"}
          </button>
        </div>

        {errorIA && <div className="text-red-600 mt-2">{errorIA}</div>}

        {respuestaIA && (
          <div className="mt-6 space-y-8">
            {/* 🧠 Interpretación */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span>🧩 Interpretación de la IA</span>
              </h3>
              <pre className="bg-gray-100 rounded p-2 overflow-x-auto text-sm">
                {JSON.stringify(respuestaIA.interpretacion, null, 2)}
              </pre>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <span>📊 Datos del Reporte</span>
                </h3>

                <div className="flex gap-2">
                  <button
                    onClick={() => exportToExcel(respuestaIA.datos, "reporte_ia.xlsx")}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                  >
                    📗 Exportar Excel 
                  </button>
                  <button
                    onClick={() => exportToPDF(respuestaIA.datos, "reporte_ia.pdf")}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
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
                              <th key={key} className="text-left px-3 py-2 font-semibold">
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
                <div className="text-gray-500 text-sm">Sin datos disponibles</div>
              )}
            </div>

            {/* 💬 Respuesta natural */}
            <div className="bg-green-50 rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                💬 Respuesta Natural
              </h3>
              <div className="whitespace-pre-line text-gray-800">{respuestaIA.respuesta}</div>
            </div>
          </div>
        )}

      </div>

      {/* 🔹 Constructor manual (opcional) */}
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          ⚙️ Constructor de Reportes Manual
        </h2>
        <p className="text-gray-500">
          Aquí puedes seguir usando los filtros, métricas y agrupaciones manuales.
          (Puedes integrarlo con la IA si lo deseas más adelante).
        </p>
      </div>
    </div>
  );
};

export default Dinamico;
