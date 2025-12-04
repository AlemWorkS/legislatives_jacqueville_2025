import React from "react";

/**
 * Recensements table — expects items array
 */
export default function RecensementsTable({ items = [] }) {
  if (!(items && items.length)) {
    return <div className="text-sm text-gray-500">Aucun recensement.</div>;
  }

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="px-2 py-1">BV</th>
            <th className="px-2 py-1">Agent</th>
            <th className="px-2 py-1">Nombre</th>
            <th className="px-2 py-1">Inscrits</th>
            <th className="px-2 py-1">Date</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="px-2 py-1">{r.bureau_label ?? r.id_bur ?? r.id}</td>
              <td className="px-2 py-1">{r.agent?.name ?? r.agent_name ?? '—'}</td>
              <td className={`px-2 py-1 ${r.nb_inscrits && r.nombre_votants > r.nb_inscrits ? 'text-red-500 font-semibold' : ''}`}>
                {r.nombre_votants ?? '—'}
              </td>
              <td className="px-2 py-1">{r.nb_inscrits ?? '—'}</td>
              <td className="px-2 py-1">{r.created_at ? new Date(r.created_at).toLocaleString() : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
