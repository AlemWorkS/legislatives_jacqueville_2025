import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import api from "@/utils/api";
import { Link } from "@inertiajs/react";
import DeconnexionButton from "@/Components/DeconnexionButton";
// NOTE: L'importation de ReactToastify.css a été retirée et le CSS intégré ci-dessous
// L'importation de "@inertiajs/react" a été retirée pour des raisons de compilation
// Les éléments Inertia (Link, usePage) ont été simulés ou remplacés.

// Utilisation d'icônes SVG intégrées pour éviter les dépendances externes comme Heroicons
const IconKey = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M8.25 6.75a2.25 2.25 0 0 1 2.25-2.25h5.25A2.25 2.25 0 0 1 18 6.75v5.25a2.25 2.25 0 0 1-2.25 2.25H10.5A2.25 2.25 0 0 1 8.25 12V6.75zM12.75 14.25a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5z" clipRule="evenodd" />
        <path d="M11.25 10.5a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5z" />
        <path fillRule="evenodd" d="M12 2.25c-5.407 0-9.75 4.343-9.75 9.75s4.343 9.75 9.75 9.75 9.75-4.343 9.75-9.75S17.407 2.25 12 2.25zM12 20.25a8.25 8.25 0 1 0 0-16.5 8.25 8.25 0 0 0 0 16.5z" clipRule="evenodd" />
    </svg>
);
const IconTrash = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M16.5 4.478a.75.75 0 0 0-.585-.145l-4.267.925a.75.75 0 0 0-.671.145L6.593 4.333A.75.75 0 0 0 6 5.043v1.657a.75.75 0 0 0 .585.73l4.267.925a.75.75 0 0 0 .671-.145l4.267-.925a.75.75 0 0 0 .585-.73V5.043a.75.75 0 0 0-.543-.728zM18 7.5a.75.75 0 0 1-.75.75h-10.5A.75.75 0 0 1 6 7.5V6.75a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 .75.75V7.5zm-3.75 4.5a.75.75 0 0 0-.75.75v3.75a.75.75 0 0 0 1.5 0v-3.75a.75.75 0 0 0-.75-.75zm-3 0a.75.75 0 0 0-.75.75v3.75a.75.75 0 0 0 1.5 0v-3.75a.75.75 0 0 0-.75-.75zm-3 0a.75.75 0 0 0-.75.75v3.75a.75.75 0 0 0 1.5 0v-3.75a.75.75 0 0 0-.75-.75z" clipRule="evenodd" />
    </svg>
);


// Simulation de usePage et route() pour la compilation
const usePage = () => ({ props: { auth: { user: { id: 1, name: "Admin", prenom: "Super" } } } });
const route = (name) => `#${name}`;

/**
 * @param {{ roles: Array, users: Array, lieux: Array }} props
 */
export default function AdminDashboard({ roles, users: initialUsers, lieux }) {

    // Récupération des informations de l'utilisateur connecté via Inertia (simulé)
    const { props } = usePage();
    const currentUser = props.auth?.user;

    const [users, setUsers] = useState(initialUsers || []);
    const [nom, setNom] = useState("");
    const [prenoms, setPrenom] = useState("");
    const [num, setPhone] = useState("");

    // Initialisation des états Role et Lieu
    const [role, setRole] = useState(roles[0]?.id ?? "");
    const [lieu, setLieu] = useState(lieux[0]?.id ?? ""); // ID du Lieu sélectionné

    // Trouver tous les bureaux du lieu sélectionné.
    const selectedLieu = lieux.find(l => l.id == lieu);
    // Assurez-vous que 'bureaux' est un tableau, même s'il est vide ou indéfini
    const bureauxDuLieu = selectedLieu && Array.isArray(selectedLieu.bureaux) ? selectedLieu.bureaux : [];

    // État pour le bureau sélectionné
    const [idBureau, setIdBureau] = useState(bureauxDuLieu[0]?.id ?? "");

    // Mise à jour de l'ID du bureau quand le Lieu change
    useState(() => {
        setIdBureau(bureauxDuLieu.length > 0 ? bureauxDuLieu[0].id : "");
    }, [lieu]);


    // États de chargement spécifiques
    const [isCreating, setIsCreating] = useState(false);
    const [loadingActions, setLoadingActions] = useState({});

    // NOTE: Laissez l'URL API inchangée, même si le code ne se connecte pas réellement
    const API_URL = "/admin/api";
    const config = { headers: { Accept: "application/json" }, withCredentials: true };

    // -----------------------------
    // Créer un utilisateur
    // -----------------------------
    const createUser = async () => {
        if (!nom || !prenoms || !num || !role || !lieu) {
            toast.warn("Veuillez remplir tous les champs et sélectionner un bureau.");
            return;
        }

        setIsCreating(true);
        try {
            // Utilisation de la simulation à la place d'axios réel
            // NOTE: Remplacez `simulatedAxios.post` par `axios.post` dans votre environnement réel
            const res = await api.post(
                `${API_URL}/users`,
                { nom, prenoms, num, role: role, id_lieu: lieu },
                config
            );

            const newUser = res.data.user;
            const generatedPassword = res.data.password;

            //toast.success(`Utilisateur créé ! Mot de passe: ${generatedPassword}`, { autoClose: 8000 });
            alert(`Utilisateur créé ! Mot de passe: ${generatedPassword}`);

            // Réinitialiser le formulaire
            setNom(""); setPrenom(""); setPhone(""); setRole(roles[0]?.id ?? ""); setLieu(lieux[0]?.id ?? ""); setIdBureau("");

            // Mise à jour locale de la liste
            const userWithRoleAndLieu = {
                ...newUser,
                role: roles.find(r => r.id == newUser.role_id) || { lib_role: 'N/A' },
                lieu: lieux.find(l => l.id == newUser.lieu_id) || { lib_lieu: 'N/A' },
            };
            setUsers((prevUsers) => [...prevUsers, userWithRoleAndLieu]);

        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la création de l'utilisateur. Vérifiez la console.");
        } finally {
            setIsCreating(false);
        }
    };

    // -----------------------------
    // Réinitialiser mot de passe
    // -----------------------------
    const sendResetPassword = async (id) => {
        // NOTE: Utiliser un modal à la place de confirm() dans l'environnement réel
        if (!window.confirm("Voulez-vous vraiment réinitialiser le mot de passe ?")) return;

        setLoadingActions(prev => ({ ...prev, [id]: 'reset' }));
        try {
            // Utilisation de la simulation
            const res = await api.post(`${API_URL}/reset-password`, {
                id
            }, config);
            const newPassword = res.data.password;
            //toast.success(`Mot de passe réinitialisé ! Nouveau mot de passe: ${newPassword}`, { autoClose: 8000 });
            alert(`Utilisateur créé ! Mot de passe: ${newPassword}`);

        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la réinitialisation");
        } finally {
            setLoadingActions(prev => ({ ...prev, [id]: false }));
        }
    };

    // -----------------------------
    // Supprimer un utilisateur
    // -----------------------------
    const deleteUser = async (id, name) => {
        // NOTE: Utiliser un modal à la place de confirm() dans l'environnement réel
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${name} ? Cette action est irréversible.`)) {
            return;
        }

        setLoadingActions(prev => ({ ...prev, [id]: 'delete' }));
        try {
            // Utilisation de la simulation
            await api.delete(`${API_URL}/users/${id}`, config);

            toast.success(`Utilisateur ${name} supprimé avec succès.`);

            // Mise à jour locale de la liste
            setUsers((prevUsers) => prevUsers.filter((u) => u.id !== id));

        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la suppression");
        } finally {
            setLoadingActions(prev => ({ ...prev, [id]: false }));
        }
    };

    // Helper pour afficher le rôle
    const getUserRole = (user) => {
        if (user.role && user.role.lib_role) {
            return user.role.lib_role;
        }
        return roles.find(r => r.id === user.role_id)?.lib_role ?? '—';
    };

    // Helper pour afficher le lieu
    const getUserLieu = (user) => {
        if (user.lieu && user.lieu.lib_lieu) {
            return user.lieu.lib_lieu;
        }
        return lieux.find(l => l.id === user.lieu_id)?.lib_lieu ?? '—';
    };

    // CSS intégré de react-toastify pour résoudre l'erreur d'import
    const toastifyCSS = `
        .Toastify__toast-container {
            z-index: 9999;
            position: fixed;
            padding: 4px;
            width: 320px;
            box-sizing: border-box;
        }
        .Toastify__toast {
            position: relative;
            min-height: 64px;
            box-sizing: border-box;
            margin-bottom: 1rem;
            padding: 8px;
            border-radius: 8px;
            box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.1), 0 2px 15px 0 rgba(0, 0, 0, 0.05);
            display: flex;
            justify-content: space-between;
            max-height: 800px;
            overflow: hidden;
            font-family: sans-serif;
            cursor: pointer;
            direction: ltr;
        }
        .Toastify__toast--success { background: #4caf50; color: #fff; }
        .Toastify__toast--error { background: #f44336; color: #fff; }
        .Toastify__toast--warn { background: #ff9800; color: #fff; }
        .Toastify__toast--info { background: #2196f3; color: #fff; }
        .Toastify__toast-body { margin: auto 0; flex: 1; padding: 6px; }
        .Toastify__close-button {
            color: #fff;
            background: transparent;
            outline: none;
            border: none;
            padding: 0;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.15s ease-in-out;
        }
        .Toastify__progress-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 5px;
            z-index: 1000;
            opacity: 0.7;
            background-color: rgba(255, 255, 255, 0.7);
        }
        .Toastify__toast-container--top-right { top: 1em; right: 1em; }
    `;

    return (
        <>
            {/* Intégration du CSS de Toastify */}
            <style dangerouslySetInnerHTML={{ __html: toastifyCSS }} />

            <div className="min-h-screen bg-gray-50 font-sans">
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored" // Changé à 'colored' pour utiliser les couleurs de base CSS
                />

                {/* --- Header & Logout --- */}
                <header className="bg-gray-800 text-white shadow-lg">
                    <div className="p-4 max-w-7xl mx-auto flex justify-between items-center">
                        <h1 className="text-3xl font-extrabold tracking-wider flex items-center space-x-2">
                             {/* Icône Menu Simplifiée */}
                             <svg className="h-6 w-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                             <span>ADMINISTRATION DES UTILISATEURS</span>
                        </h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-light hidden sm:inline">
                                {currentUser ? `${currentUser.prenom} ${currentUser.name}` : 'Administrateur'}
                            </span>
                            <DeconnexionButton/>
                        </div>
                    </div>
                </header>

                <div className="p-6 max-w-7xl mx-auto space-y-8">

                    {/* --- Formulaire de création --- */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-600">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                            Ajouter un nouvel utilisateur
                        </h2>

                        {/* Mise à jour du grid pour inclure 6 champs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
                            {/* Champ Nom */}
                            <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)}
                                className="border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 col-span-1" />

                            {/* Champ Prénoms */}
                            <input type="text" placeholder="Prénoms" value={prenoms} onChange={(e) => setPrenom(e.target.value)}
                                className="border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 col-span-1" />

                            {/* Champ Téléphone */}
                            <input type="tel" placeholder="Téléphone (ex: 771234567)" value={num} onChange={(e) => setPhone(e.target.value)}
                                className="border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 col-span-1" />

                            {/* Sélecteur de Rôle */}
                            <select value={role} onChange={(e) => setRole(e.target.value)}
                                className="border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white col-span-1">
                                <option value="">-- Rôle --</option>
                                {roles.map((r) => (
                                    <option key={r.id} value={r.id}>{r.lib_role}</option>
                                ))}
                            </select>

                            {/* Sélecteur de Lieu (Parent) */}
                            <select value={lieu} onChange={(e) => { setLieu(e.target.value); setIdBureau(""); }}
                                className="border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white col-span-1">
                                <option value="">-- Lieu --</option>
                                {lieux.map((l) => (
                                    <option key={l.id} value={l.id}>{l.lib_lieu}</option>
                                ))}
                            </select>

                        </div>

                        {/* Bouton de soumission en bas du formulaire */}
                        <button
                            onClick={createUser}
                            disabled={isCreating}
                            className={`mt-4 sm:w-auto px-6 py-3 rounded-lg font-bold transition duration-200 shadow-md
                                ${isCreating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                        >
                            {isCreating ? "Création en cours..." : "Ajouter l'utilisateur"}
                        </button>
                    </div>

                    {/* --- Liste des utilisateurs --- */}
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                            Liste des utilisateurs ({users.length})
                        </h2>

                        {users.length === 0 ? (
                            <p className="text-gray-500 p-4 border rounded-lg bg-gray-50">Aucun utilisateur trouvé. Veuillez en créer un.</p>
                        ) : (
                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom complet</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lieu Affectation</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((u) => {
                                            const actionLoading = loadingActions[u.id];
                                            const isSelf = currentUser && currentUser.id === u.id;

                                            return (
                                                <tr key={u.id} className="hover:bg-gray-50 transition duration-100">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {u.name} {u.prenom}
                                                        {isSelf && <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Moi</span>}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.num}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full
                                                                ${u.role_id === 1 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                            {getUserRole(u)}
                                                        </span>
                                                    </td>
                                                    {/* Affichage du Lieu */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {getUserLieu(u)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end gap-2">

                                                            {/* Bouton Réinitialiser Mot de Passe */}
                                                            <button
                                                                onClick={() => sendResetPassword(u.id)}
                                                                disabled={actionLoading === 'reset'}
                                                                className="flex items-center space-x-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-xs font-semibold transition duration-150 disabled:bg-gray-400 disabled:opacity-75 shadow-sm"
                                                            >
                                                                 <IconKey className="h-4 w-4" />
                                                                {actionLoading === 'reset' ? 'Reset...' : 'Reset MDP'}
                                                            </button>

                                                            {/* Bouton Supprimer */}
                                                            <button
                                                                onClick={() => deleteUser(u.id, `${u.nom} ${u.prenoms}`)}
                                                                disabled={actionLoading === 'delete' || isSelf}
                                                                className={`flex items-center space-x-1 text-white px-3 py-2 rounded-lg text-xs font-semibold transition duration-150 shadow-sm
                                                                        ${isSelf || actionLoading === 'delete'
                                                                            ? 'bg-gray-400 cursor-not-allowed'
                                                                            : 'bg-red-600 hover:bg-red-700'
                                                                        }`}
                                                            >
                                                                 <IconTrash className="h-4 w-4" />
                                                                {actionLoading === 'delete' ? 'Suppression...' : 'Supprimer'}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
