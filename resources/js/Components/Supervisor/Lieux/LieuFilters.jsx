import React, { useEffect, useState } from 'react';
import api from '@/utils/api';

/**
 * Filters for lieux:
 * - centre select (props.centers)
 * - zone select loaded dynamically for selected centre
 * - search input
 */
export default function LieuFilters({ centers = [], centreId, onCentreChange, zoneId, onZoneChange, query, onQueryChange, onApply }) {
  const [zones, setZones] = useState([]);

  useEffect(() => {
    // load zones for centre if centreId provided
    async function loadZones() {
      if (!centreId) {
        setZones([]);
        onZoneChange && onZoneChange('');
        return;
      }
      try {
        const res = await api.get(`/supervisor/api/centers/${centreId}/zones`);
        setZones(res.data || []);
      } catch (e) {
        console.error('loadZones', e);
      }
    }
    loadZones();
  }, [centreId]);

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div>
        <label className="block text-xs text-gray-600">Centre</label>
        <select className="border rounded p-1" value={centreId || ''} onChange={(e) => onCentreChange(e.target.value)}>
          <option value="">Tous</option>
          {centers.map(c => <option key={c.id} value={c.id}>{c.lib_cen}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-600">Zone</label>
        <select className="border rounded p-1" value={zoneId || ''} onChange={(e) => onZoneChange(e.target.value)}>
          <option value="">Toutes</option>
          {zones.map(z => <option key={z.id} value={z.id}>{z.lib_zone ?? z.name}</option>)}
        </select>
      </div>

      <div className="flex-1 min-w-[160px]">
        <label className="block text-xs text-gray-600">Recherche</label>
        <input type="search" className="w-full border rounded p-1" placeholder="Rechercher lieu / code" value={query || ''} onChange={(e) => onQueryChange(e.target.value)} />
      </div>

      <div>
        <button onClick={onApply} className="px-4 py-2 bg-blue-600 text-white rounded">Appliquer</button>
      </div>
    </div>
  );
}
