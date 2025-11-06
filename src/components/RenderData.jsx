import React from "react";

export const RenderData = ({ data, title }) => {
  if (!data) return null;

  // Si es array → mostramos tabla
  if (Array.isArray(data)) {
    return (
      <div className="overflow-x-auto bg-white rounded-lg shadow mt-4">
        <h3 className="text-lg font-semibold mb-2 px-4 pt-3 text-gray-700">
          {title}
        </h3>
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {Object.keys(data[0] || {}).map((key) => (
                <th
                  key={key}
                  className="px-4 py-2 text-left text-sm text-gray-600 border-b"
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
                    {String(val)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Si es objeto → mostramos JSON formateado
  return (
    <div className="bg-gray-100 p-4 rounded-lg mt-4 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">{title}</h3>
      <pre className="text-sm text-gray-800">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};
