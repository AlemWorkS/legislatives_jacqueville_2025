export default function RecensementsTable({ items }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Lieu</th>
            <th className="p-2 border">Agent</th>
            <th className="p-2 border">Votants</th>
            <th className="p-2 border">Inscrits</th>
            <th className="p-2 border">Date</th>
          </tr>
        </thead>

        <tbody>
          {items?.map((r) => (
            <tr key={r.id}>
              <td className="p-2 border">{r.id}</td>
              <td className="p-2 border">{r.lieu?.nom}</td>
              <td className="p-2 border">{r.agent?.name}</td>
              <td className="p-2 border">{r.nombre_votants}</td>
              <td className="p-2 border">{r.nb_inscrits}</td>
              <td className="p-2 border">
                {new Date(r.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
