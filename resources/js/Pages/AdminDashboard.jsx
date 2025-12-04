import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

/**
 * @param {{ roles: Array, users: Array }} props
 */
export default function AdminDashboard({ roles, users: initialUsers }) {
  const [users, setUsers] = useState(initialUsers || []);
  const [nom, setNom] = useState("");
  const [prenoms, setPrenom] = useState("");
  const [num, setPhone] = useState("");
  const [role, setRole] = useState(roles[0]?.id ?? null);

  const API_URL = "/admin/api";
  const config = { headers: { Accept: "application/json" }, withCredentials: true };

  // -----------------------------
  // Créer un utilisateur
  // -----------------------------
  const createUser = async () => {
    if (!nom || !prenoms || !num || !role) {
      toast.warn("Veuillez remplir tous les champs");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/users`,
        { nom, prenoms, num, role },
        config
      );

      const generatedPassword = res.data.password;
      toast.success(`Utilisateur créé ! Mot de passe: ${generatedPassword}`, { autoClose: 8000 });

      setNom(""); setPrenom(""); setPhone(""); setRole(roles[0]?.id ?? null);

      // Ajouter localement l'utilisateur créé (backend doit renvoyer l'objet complet)
      const users = await axios.get(
        `${API_URL}/users`,
        { nom, prenoms, num, role },
        config
      );
      setUsers(users.data);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création");
    }
  };

  // -----------------------------
  // Réinitialiser mot de passe
  // -----------------------------
  const sendResetPassword = async (id) => {
    try {
      const res = await axios.post(`${API_URL}/admin/users/${id}/reset-password`, {}, config);
      const newPassword = res.data.password;
      toast.success(`Mot de passe réinitialisé ! Nouveau mot de passe: ${newPassword}`, { autoClose: 8000 });
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la réinitialisation");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

      {/* --- Formulaire de création --- */}
      <div className="bg-white shadow p-4 mb-6 rounded">
        <h2 className="text-xl font-semibold mb-3">Créer un utilisateur</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)}
                 className="border p-2 rounded" />
          <input type="text" placeholder="Prénom" value={prenoms} onChange={(e) => setPrenom(e.target.value)}
                 className="border p-2 rounded" />
          <input type="text" placeholder="Téléphone" value={num} onChange={(e) => setPhone(e.target.value)}
                 className="border p-2 rounded" />
          <select value={role} onChange={(e) => setRole(e.target.value)}
                  className="border p-2 rounded">
            {roles.map((r) => (
              <option key={r.id} value={r.id}>{r.lib_role}</option>
            ))}
          </select>
        </div>
        <button onClick={createUser} className="bg-blue-600 text-white px-4 py-2 rounded">
          Ajouter
        </button>
      </div>

      {/* --- Liste des utilisateurs --- */}
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-xl font-semibold mb-3">Utilisateurs</h2>
        {users.length === 0 ? (
          <p className="text-gray-500">Aucun utilisateur trouvé.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2">Nom complet</th>
                <th className="p-2">Téléphone</th>
                <th className="p-2">Rôle</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="p-2">{u.name} {u.prenom}</td>
                  <td className="p-2">{u.num}</td>
                  <td className="p-2">{roles.find(r => r.id === u.role_id)?.lib_role ?? '—'}</td>
                  <td className="p-2 flex gap-2">
                    <button className="bg-orange-600 text-white px-3 py-1 rounded"
                            onClick={() => sendResetPassword(u.id)}>
                      Réinitialiser mot de passe
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
