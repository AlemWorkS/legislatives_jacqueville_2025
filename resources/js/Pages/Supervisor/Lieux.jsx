import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import api from '@/utils/api';
import LieuFilters from '@/Components/Supervisor/Lieux/LieuFilters';
import LieuMetrics from '@/Components/Supervisor/Lieux/LieuMetrics';
import LieuxTable from '@/Components/Supervisor/Lieux/LieuxTable';

export default function Lieux(props) {

  // props.centers provided by controller (safe default)
  const centers = props.centers || [];
  const zones = props.zones || [];

  // selected center
  const [centreId, setCentreId] = useState('');

  // state
  const [list, setList] = useState([]);
  const [meta, setMeta] = useState({}); // pagination meta
  const [loading, setLoading] = useState(false);

  // filters
  const [zoneId, setZoneId] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  // currently selected lieu for metrics
  const [selectedLieu, setSelectedLieu] = useState(null);
  const [metrics, setMetrics] = useState(null);

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get('/supervisor/api/lieux', {
        params: {
          centre_id: centreId || undefined,
          zone_id: zoneId || undefined,
          q: query || undefined,
          page,
          per_page: perPage
        }
      });
      // handle paginated response format: data + meta OR direct array
      setList(res.data.data ?? res.data);
      setMeta(res.data.meta ?? { total: (res.data.data || []).length, current_page: page });
    } catch (e) {
      console.error('fetchList error', e);
    } finally {
      setLoading(false);
    }
  }, [centreId, zoneId, query, page, perPage]);

  const fetchMetrics = useCallback(async (lieuId) => {
    if (!lieuId) {
      setMetrics(null);
      return;
    }
    try {
      const res = await api.get(`/supervisor/api/lieux/${lieuId}/metrics`);
      setMetrics(res.data);
    } catch (e) {
      console.error('fetchMetrics error', e);
    }
  }, []);

  // initial load
  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // when selected lieu changes, load metrics
  useEffect(() => {
    if (selectedLieu) fetchMetrics(selectedLieu.id ?? selectedLieu);
    else setMetrics(props);
  }, [selectedLieu, fetchMetrics]);

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">Lieux</h2>
          <LieuFilters
            centers={centers}
            centreId={centreId}
            onCentreChange={(v) => { setCentreId(v); setPage(1); }}
            zoneId={zoneId}
            onZoneChange={(v) => { setZoneId(v); setPage(1); }}
            query={query}
            onQueryChange={(v) => { setQuery(v); setPage(1); }}
            onApply={() => fetchList()}
          />
        </div>

        <div className="w-full lg:w-96">
          <h3 className="text-lg font-semibold">Métriques du lieu</h3>
          <LieuMetrics lieu={selectedLieu} metrics={metrics} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <LieuxTable
          items={list}
          loading={loading}
          onSelect={(lieu) => {
            setSelectedLieu(lieu);
            // scroll to metrics panel on small screens
            const el = document.querySelector('.metrics-panel');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          pagination={{
            meta,
            page,
            perPage,
            onPageChange: (p) => { setPage(p); fetchList(); },
            onPerPageChange: (pp) => { setPerPage(pp); setPage(1); fetchList(); }
          }}
        />
      </div>
    </DashboardLayout>
  );
}
