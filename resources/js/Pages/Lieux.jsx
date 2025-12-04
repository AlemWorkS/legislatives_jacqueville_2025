import DashboardLayout from "@/Layouts/DashboardLayout";

export default function LieuxIndex({ lieux }) {
  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold mb-4">Liste des lieux</h1>

      <div className="bg-white shadow p-4 rounded">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">ID</th>
              <th className="p-2">Nom du lieu</th>
              <th className="p-2">Code</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {lieux.map((l) => (
              <tr key={l.id} className="border-t">
                <td className="p-2">{l.id}</td>
                <td className="p-2">{l.lib_lieu}</td>
                <td className="p-2">{l.code}</td>
                <td className="p-2">
                  <button className="px-2 py-1 bg-blue-600 text-white rounded">Voir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
