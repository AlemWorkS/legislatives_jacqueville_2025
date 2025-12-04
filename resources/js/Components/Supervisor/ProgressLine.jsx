import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

/**
 * Simple progress visualization (0-100)
 */
export default function ProgressLine({ value = 0 }) {
  const data = [{ name: 'Progress', value: Number(value ?? 0) }];
  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis domain={[0,100]} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
