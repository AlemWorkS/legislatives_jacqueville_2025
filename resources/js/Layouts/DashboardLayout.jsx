import React from "react";
import Sidebar from "./SidebarLayout";

/**
 * Layout global du dashboard.
 * Wrappe les pages avec une sidebar et un header léger.
 */
export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <Sidebar />

      <div className="flex-1 p-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Supervision — Dashboard</h1>
          <div className="text-sm text-gray-500">Dernière synchronisation: {new Date().toLocaleString()}</div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
