import React from "react";

/**
 * Date range filter (from / to)
 */
export default function DateRange({ from, to, onFrom, onTo }) {
  return (
    <div className="flex items-end gap-2">
      <div>
        <label className="block text-xs text-gray-600">Du</label>
        <input type="date" value={from || ""} onChange={(e) => onFrom(e.target.value)} className="border rounded p-1" />
      </div>
      <div>
        <label className="block text-xs text-gray-600">Au</label>
        <input type="date" value={to || ""} onChange={(e) => onTo(e.target.value)} className="border rounded p-1" />
      </div>
    </div>
  );
}
