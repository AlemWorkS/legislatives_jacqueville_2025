import api from "@/utils/api";
import { Link } from "@inertiajs/react";

/**
 * Sidebar simple, extensible.
 */
export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-6">
        <div className="text-lg font-bold">📊 Superviseur</div>
        <div className="text-xs text-gray-400">Vue d'ensemble</div>
      </div>
      <nav className="flex flex-col gap-2">
        <Link href="/supervisor" className="text-left p-2 rounded hover:bg-gray-800">Metrics</Link>
        <Link href='/supervisor/dash/recensements' className="text-left p-2 rounded hover:bg-gray-800">Recensements</Link>
        <button onClick={() => api.get('/supervisor/anomalies')} className="text-left p-2 rounded hover:bg-gray-800">Anomalies</button>
        <Link href="/supervisor/lieux" className="block hover:bg-gray-700 p-2 rounded">
            Lieux
          </Link>
        <hr className="my-4 border-gray-800" />
        <div className="text-xs text-gray-400 px-2">Filtrer rapidement</div>
        <button onClick={() => api.post('/logout', { from: new Date().toISOString().slice(0,10) })} className="text-left p-2 rounded hover:bg-gray-800">Deconnection</button>
      </nav>
    </aside>
  );
}
