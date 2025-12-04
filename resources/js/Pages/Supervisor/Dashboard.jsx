import React, { useEffect, useState, useCallback } from "react";

import KPICard from "../../Components/Supervisor/KPICard";
import ProgressLine from "../../Components/Supervisor/ProgressLine";
import RecensementsTable from "../../Components/Supervisor/RecensementsTable";
import AnomaliesTable from "../../Components/Supervisor/AnomaliesTable";
import api from "@/utils/api"; // axios instance
import TopCentersChart from "../../Components/Supervisor/TopCenterChart";
import DashboardLayout from "@/Layouts/DashboardLayout";
import DateRange from "../../Components/Supervisor/Filters/DateRange";
import CenterFilter from "../../Components/Supervisor/Filters/CenterFilter";
import AgentFilter from "../../Components/Supervisor/Filters/AgentFilter";

/**
 * Responsive dashboard: mobile-first, improved layout and spacing.
 */
export default function Dashboard(props) {
  // props from Inertia: ensure safe defaults
  const initialKpis = props.kpis || {};
  const initialCenters = props.centers || [];
  const initialRecensements = props.recensements || [];

  const [kpis, setKpis] = useState(initialKpis);
  const [centers, setCenters] = useState(initialCenters);
  const [recensements, setRecensements] = useState(initialRecensements);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(false);

  // filters
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [centerId, setCenterId] = useState("");
  const [agentId, setAgentId] = useState("");

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/supervisor/metrics");
      setKpis(res.data || {});
    } catch (e) {
      console.error("fetchMetrics error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecensements = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/supervisor/recensements", {
        params: { centre_id: centerId, agent_id: agentId, from, to, per_page: 50 },
      });
      setRecensements(res.data.data ?? res.data ?? []);
    } catch (e) {
      console.error("fetchRecensements error", e);
    } finally {
      setLoading(false);
    }
  }, [centerId, agentId, from, to]);

  const fetchAnomalies = useCallback(async () => {
    try {
      const res = await api.get("/supervisor/anomalies");
      setAnomalies([
        ...(res.data.over_votes || []).map((o) => ({ ...o, type: "over_vote", message: `Over vote: ${o.id}` })),
        ...(res.data.duplicates || []).map((d) => ({ ...d, type: "duplicate", message: `Duplicate: lieu ${d.lieu_id}` })),
      ]);
    } catch (e) {
      console.error("fetchAnomalies error", e);
    }
  }, []);

  // initial load
  useEffect(() => {
    fetchMetrics();
    fetchRecensements();
    fetchAnomalies();
  }, [fetchMetrics, fetchRecensements, fetchAnomalies]);

  // filtered recensements client-side fallback (useful if backend returns full list)
  const filtered = (recensements || []).filter((r) => {
    const matchFrom = !from || new Date(r.created_at) >= new Date(from + "T00:00:00");
    const matchTo = !to || new Date(r.created_at) <= new Date(to + "T23:59:59");
    const matchCenter = !centerId || r.id_cen == centerId || r.lieu?.centre_id == centerId;
    const matchAgent = !agentId || r.agent_id == agentId || r.agent?.id == agentId;
    return matchFrom && matchTo && matchCenter && matchAgent;
  });

  return (
    <DashboardLayout>
      {/* FILTERS: collapsible on mobile */}
      <div className="mb-4">
        <div className="block md:hidden">
          {/* Mobile: collapsible summary */}
          <details className="bg-white rounded-lg shadow p-3">
            <summary className="font-medium">Filtres ▾</summary>
            <div className="mt-3 space-y-3">
              <DateRange from={from} to={to} onFrom={setFrom} onTo={setTo} />
              <CenterFilter centers={centers} value={centerId} onChange={setCenterId} />
              <AgentFilter agents={[]} value={agentId} onChange={setAgentId} />
              <div className="flex gap-2">
                <button onClick={() => { fetchMetrics(); fetchRecensements(); }} className="flex-1 px-3 py-2 bg-blue-600 text-white rounded">
                  Appliquer
                </button>
                <button onClick={() => { setFrom(""); setTo(""); setCenterId(""); setAgentId(""); }} className="flex-1 px-3 py-2 bg-gray-200 rounded">
                  Réinitialiser
                </button>
              </div>
            </div>
          </details>
        </div>

        <div className="hidden md:flex md:items-end md:gap-4">
          {/* Desktop: inline filters */}
          <DateRange from={from} to={to} onFrom={setFrom} onTo={setTo} />
          <CenterFilter centers={centers} value={centerId} onChange={setCenterId} />
          <AgentFilter agents={[]} value={agentId} onChange={setAgentId} />
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => { fetchMetrics(); fetchRecensements(); }} className="px-4 py-2 bg-blue-600 text-white rounded">Appliquer</button>
            <button onClick={() => { setFrom(""); setTo(""); setCenterId(""); setAgentId(""); }} className="px-4 py-2 bg-gray-200 rounded">Réinitialiser</button>
          </div>
        </div>
      </div>

      {/* KPI Cards: responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard title="Total centres" value={kpis.totalCentres ?? "—"} subtitle="Nombre de centres" />
        <KPICard title="Progression" value={`${kpis.progress_percent ?? 0}%`} subtitle="Couverture globale" />
        <KPICard title="Recensements" value={kpis.totalRecensements ?? 0} subtitle="Total enregistré" />
        <KPICard title="Inscrits" value={kpis.totalInscrits ?? 0} subtitle="Total inscrits" />
      </div>

      {/* Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4 min-h-[300px]">
          <h3 className="text-lg font-semibold mb-3">Top centres (par progression)</h3>
          {/* ensure chart container has a min-height so recharts can measure properly */}
          <div className="w-full" style={{ minHeight: 260 }}>
            <TopCentersChart data={kpis.top_centres ?? []} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 min-h-[300px]">
          <h3 className="text-lg font-semibold mb-3">Progression générale</h3>
          <div style={{ minHeight: 200 }}>
            <ProgressLine value={kpis.progress_percent ?? 0} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-lg shadow p-4 w-full overflow-auto">
          <h3 className="text-lg font-semibold mb-3">Anomalies récentes</h3>
          <AnomaliesTable items={anomalies} />
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500 text-center">
        {loading ? "Chargement..." : "Données à jour."}
      </div>
    </DashboardLayout>
  );
}
