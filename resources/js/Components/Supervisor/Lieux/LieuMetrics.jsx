import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

/**
 * Display metrics for selected lieu
 * - metrics: { nb_bureaux, nb_inscrits, votants, progress_percent }
 */
export default function LieuMetrics({ lieu, metrics }) {
  if (!lieu) {
    //return <div className="metrics-panel p-4 text-sm text-gray-500">Sélectionnez un lieu pour voir ses métriques.</div>;
    lieu = { id: null, nom: 'Tout les lieux' };
  }

  const m = metrics || {};
  const pct = m.progress_percent ?? 0;

  const pieData = [
    { name: 'Votants', value: m.votants ?? 0 },
    { name: 'Restant', value: Math.max((m.nb_inscrits ?? 0) - (m.votants ?? 0), 0) }
  ];
  const COLORS = ['#10b981', '#e5e7eb'];

  console.log('Pie data:', pieData, 'metrics:', m);

  return (
    <div className="metrics-panel bg-white rounded-lg shadow p-4">
      <div className="text-sm text-gray-600">Lieu</div>
      <div className="font-semibold mb-2">{lieu.lib_lieu ?? lieu.nom ?? `#${lieu.id}`}</div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className="text-xs text-gray-500">Bureaux</div>
          <div className="font-bold">{m.nb_bureaux ?? '—'}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Inscrits</div>
          <div className="font-bold">{m.nb_inscrits ?? '—'}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Votants</div>
          <div className="font-bold">{m.votants ?? 0}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Progression</div>
          <div className="font-bold">{pct}%</div>
        </div>
      </div>

      <div style={{ width: '100%', height: 160 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={60} paddingAngle={2}>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
