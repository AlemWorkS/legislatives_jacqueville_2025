import React from 'react';

export default function AnomaliesTable({ items = [] }) {
  if (!items?.length) return <div className="text-sm text-gray-400">Aucune anomalie détectée.</div>;

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="px-2 py-1">Type</th>
            <th className="px-2 py-1">Message</th>
            <th className="px-2 py-1">Date</th>
          </tr>
        </thead>
        <tbody>
          {items.map((a) => (
            <tr key={a.id ?? JSON.stringify(a)} className="border-t">
              <td className="px-2 py-1">{a.type}</td>
              <td className="px-2 py-1">{a.message}</td>
              <td className="px-2 py-1">{a.created_at ? new Date(a.created_at).toLocaleString() : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
