import React from "react";

/**
 * Centre select dropdown
 * centers: array of {id, lib_cen}
 */
export default function CenterFilter({ centers = [], value, onChange }) {
  return (
    <div>
      <label className="block text-xs text-gray-600">Centre</label>
      <select value={value || ""} onChange={(e) => onChange(e.target.value)} className="border rounded p-1">
        <option value="">Tous</option>
        {centers.map((c) => (
          <option key={c.id} value={c.id}>{c.lib_cen}</option>
        ))}
      </select>
    </div>
  );
}
