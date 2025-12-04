import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "@/Layouts/DashboardLayout";
import RecensementsTable from "@/Components/Supervisor/RecensementsTable";

export default function Recensements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    centre_id: "",
    zone_id: "",
    lieu_id: "",
    agent_id: "",
    from: "",
    to: "",
    page: 1,
  });

  const fetchData = async () => {
    setLoading(true);
    const { data } = await axios.get("/supervisor/recensements", { params: filters });
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [filters.page]);

  const handleFilterChange = (key, value) => {
    setFilters((old) => ({ ...old, [key]: value, page: 1 }));
    fetchData();
  };

  return (
    <DashboardLayout>
      <div className="p-4">

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <input
            type="date"
            onChange={(e) => handleFilterChange("from", e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            onChange={(e) => handleFilterChange("to", e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Agent ID"
            onChange={(e) => handleFilterChange("agent_id", e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow p-4 w-full overflow-auto">
          <h3 className="text-lg font-semibold mb-3">
            Derniers recensements
          </h3>

          {loading ? (
            <p>Chargement...</p>
          ) : (
            <RecensementsTable items={items.data} />
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={!items.prev_page_url}
              onClick={() => setFilters((f) => ({ ...f, page: items.current_page - 1 }))}
              className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
            >
              Précédent
            </button>

            <span>Page {items.current_page}</span>

            <button
              disabled={!items.next_page_url}
              onClick={() => setFilters((f) => ({ ...f, page: items.current_page + 1 }))}
              className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
