import { useState } from "react";
import { toast } from "react-toastify";
// IMPORTANT : Assurez-vous d'importer Link pour la déconnexion et usePage pour l'accès aux props
import { Link, usePage } from '@inertiajs/react';
import FinishMessageBox from "@/Components/FinishMessageBox";
import DeconnexionButton from "@/Components/DeconnexionButton";
import NavigationButton from "@/Components/NavigationButton";
import { HiDocumentText } from "react-icons/hi";

export default function RecenserDashboard({ lieu, lastCumul, isFinish }) {

    // Utilisation de usePage pour accéder aux props globales Inertia,
    // y compris 'auth' si elle est partagée.
    const { props } = usePage();
    const { user } = props.auth; // Suppose que les données sont sous props.auth.user

    const [cumul, setCumul] = useState(lastCumul);
    const [value, setValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [finish, setFinish] = useState(isFinish);


        if(finish) {
        return <FinishMessageBox message="Il n'est plus possible de faire le recensement cher agent Merci pour votre contribution :)"/>;
    }

    const handleConfirm = async () => {
        const num = Number.parseInt(value);

        if (Number.isNaN(num) || num <= cumul) {
            toast.error("Le nombre saisi doit être un total cumulé supérieur au dernier total (" + cumul + ").");
            return;
        }

        setIsLoading(true);

        try {
            const res = await axios.post("/agent/store", {
                lieu_id: lieu.id,
                nombre_recenses: num,
            });

            setCumul(res.data.lastCumul);
            toast.success("Recensement enregistré avec succès !");
            setValue("");

        } catch (e) {
            console.error(e);
            const errorMessage = e.response?.data?.message || "Erreur lors de l’enregistrement. Vérifiez votre connexion.";
            toast.error(errorMessage);

        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="w-full min-h-screen bg-gray-100 flex justify-center items-start md:items-center py-6 md:py-12 px-4">
            <div className="w-full max-w-6xl bg-white border rounded-xl shadow-2xl p-6 flex flex-col md:flex-row gap-6">

                {/* Colonne gauche (Infos Utilisateur & Logout) */}
                <div className="w-full md:w-1/4 md:border-r md:pr-4 flex flex-col justify-between">

                    {/* Infos Utilisateur et lieu */}
                    <div>
                        {/* Carte Utilisateur */}
                        <div className="bg-gray-100 p-4 rounded-lg border mb-4 shadow-sm">
                            <p className="text-sm font-semibold text-gray-700">Connecté en tant que:</p>
                            <h3 className="text-lg font-bold text-gray-900 mt-1">
                                {user.prenom} {user.nom}
                            </h3>
                            <p className="text-sm text-yellow-600 mt-1">
                                Rôle: {user.role || 'Agent de lieu'}
                                {/* Remplacez 'Agent de lieu' par la propriété de rôle réelle */}
                            </p>
                        </div>

                        {/* Carte lieu Actuel */}
                        <div className="bg-yellow-200 text-center md:text-left text-lg font-bold px-4 py-3 rounded-md border border-yellow-400">
                            <span className="text-sm font-normal text-gray-700 block">lieu:</span>
                            {lieu.lib_lieu} ({lieu.id})
                        </div>
                    </div>

                    <NavigationButton
                            targetRoute="/agent/deliberation" // Remplacez par la route réelle
                            label="Passer à la délibération"
                            icon={HiDocumentText}
                        />

                    {/* Bouton de Déconnexion (Collé en bas à gauche sur desktop) */}
                    <div className="mt-6 border-t pt-4">
                        <DeconnexionButton/>
                    </div>
                </div>

                {/* Colonne centrale (Affichage) */}
                <div className="w-full md:w-1/2 md:px-4">
                    <div className="border border-gray-300 rounded-lg p-6 mb-6 bg-blue-50">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">
                            Nombre cumulé de votants (Total actuel)
                        </h2>
                        <p className="text-5xl font-extrabold text-center text-blue-700 animate-pulse">
                            {cumul}
                        </p>
                    </div>
                </div>

                {/* Colonne droite (Action) */}
                <div className="w-full md:w-1/4 md:border-l md:pl-4 flex flex-col justify-center pt-4 md:pt-0">

                    <h3 className="text-lg font-semibold mb-2 text-gray-800">
                        Nouvel enregistrement
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                        Saisissez le **nouveau cumul total** des votants.
                    </p>

                    <input
                        type="number"
                        className="border border-gray-300 p-3 rounded-lg mb-4 w-full focus:ring-yellow-500 focus:border-yellow-500 transition duration-150"
                        placeholder={`Total minimum : ${cumul + 1}`}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        disabled={isLoading}
                    />

                    <button
                        onClick={handleConfirm}
                        className={`py-3 rounded-lg font-semibold transition duration-200
                            ${isLoading
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                : 'bg-yellow-400 text-gray-900 border border-yellow-500 hover:bg-yellow-500'
                            }`}
                        disabled={isLoading || !value}
                    >
                        {isLoading ? 'Enregistrement...' : 'Confirmer le cumul'}
                    </button>
                </div>
            </div>
        </div>
    );
}
