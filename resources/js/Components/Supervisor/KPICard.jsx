import React from "react";

/**
 * KPI Card
 * props: { title, value, subtitle }
 */
export default function KPICard({ title = "", value = "—", subtitle = "" }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
    </div>
  );
}
