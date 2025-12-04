import React from "react";

/**
 * Agent select — pass agents array if available
 */
export default function AgentFilter({ agents = [], value, onChange }) {
  return (
    <div>
      <label className="block text-xs text-gray-600">Agent</label>
      <select value={value || ""} onChange={(e) => onChange(e.target.value)} className="border rounded p-1">
        <option value="">Tous</option>
        {agents.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>
    </div>
  );
}
