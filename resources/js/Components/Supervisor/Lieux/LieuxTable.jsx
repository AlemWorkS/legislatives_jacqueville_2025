import React from 'react';

/**
 * items: array of lieux
 * pagination: { meta, page, perPage, onPageChange, onPerPageChange }
 */
export default function LieuxTable({ items = [], loading = false, onSelect = () => {}, pagination = {} }) {
  const { meta = {}, page = 1, perPage = 20, onPageChange = () => {}, onPerPageChange = () => {} } = pagination;

  return (
    <div>
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="px-2 py-1">Lieu</th>
              <th className="px-2 py-1">Inscrits</th>
              <th className="px-2 py-1">Bureaux</th>
              <th className="px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="p-4">Chargement...</td></tr>
            ) : (items.length ? items.map(l => (
              <tr key={l.id} className="border-t">
                <td className="px-2 py-1">{l.lib_lieu ?? l.nom ?? `#${l.id}`}</td>
                <td className="px-2 py-1">{l.nb_inscrits ?? '—'}</td>
                <td className="px-2 py-1">{l.bureaux_count ?? l.nb_bur ?? '—'}</td>
                <td className="px-2 py-1">
                  <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => onSelect(l)}>Voir métriques</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" className="p-4 text-gray-500">Aucun lieu trouvé.</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simple pagination controls */}
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">Total: {meta?.total ?? items.length}</div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Par page:</label>
          <select value={perPage} onChange={(e) => onPerPageChange(Number(e.target.value))} className="border rounded p-1">
            {[10,20,50,100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>

          <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="px-2 py-1 bg-gray-200 rounded">Prev</button>
          <div className="px-2">Page {page} / {meta?.last_page ?? 1}</div>
          <button disabled={page >= (meta?.last_page ?? 1)} onClick={() => onPageChange(page + 1)} className="px-2 py-1 bg-gray-200 rounded">Next</button>
        </div>
      </div>
    </div>
  );
}
