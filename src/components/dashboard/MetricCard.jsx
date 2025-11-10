// src/components/dashboard/MetricCard.jsx
import React from "react";

const MetricCard = ({ icon, label, value, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="p-6 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="mb-2 text-sm text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-800">
            {value !== null && value !== undefined ? value : "---"}
          </p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;