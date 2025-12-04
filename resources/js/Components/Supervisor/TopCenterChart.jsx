import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

/**
 * Top centres bar chart
 * expects data: [{ id, lib_cen, progress }]
 */
export default function TopCentersChart({ data = [] }) {
  const chartData = (data || []).map((c) => ({
    name: c.lib_cen ?? `#${c.id}`,
    progress: Number(c.progress ?? 0)
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="progress" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
