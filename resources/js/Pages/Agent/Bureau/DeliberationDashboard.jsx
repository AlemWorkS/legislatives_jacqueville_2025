import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import axios from "axios";
import { toast } from "react-toastify";
import DeconnexionButton from "@/Components/DeconnexionButton";
import FinishMessageBox from "@/Components/FinishMessageBox";

export default function DeliberationDashboard({ lieu, resultats, candidats, isFinish }) {

    const { props } = usePage();
    const { user } = props.auth;
    const [finish,setFinish] = useState(isFinish);

    const [scores, setScores] = useState(resultats);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (id, value) => {
        setScores((prev) => ({
            ...prev,
            [id]: Number(value)
        }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            res = await axios.post("/agent_bureau/save_deliberation", {
                lieu_id: lieu.id,
                scores,
                user_id: user.id
            });

            toast.success("Résultats finalisés avec succès !");
            if(res.data) setFinish(true); // !
        } catch (e) {
            console.error(e);
            toast.error("Erreur lors de l’enregistrement.");
        } finally {
            setIsLoading(false);
        }
    };

    // Si le lieu est null, on affiche un message
    if (!lieu) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 p-4">
                <div className="bg-yellow-100 border-l-4 border-yellow-400 p-6 rounded-lg shadow-md max-w-md text-center">
                    <h2 className="text-lg font-semibold text-yellow-800 mb-2">
                        Vous n'avez pas encore été attribué à un lieu de vote
                    </h2>
                    <p className="text-sm text-yellow-700">
                        Veuillez contacter l'administrateur pour obtenir votre affectation.
                    </p>
                </div>
            </div>
        );
    }

    if (finish) {
        return (
            <FinishMessageBox message={'Les deliberations sont terminées pour votre lieu cher agent merci :)'}/>
        );
    }


    return (
        <div className="w-full min-h-screen bg-gray-100 flex justify-center items-start py-8 px-4">
            <div className="w-full max-w-6xl bg-white border rounded-xl shadow-xl p-6 flex flex-col md:flex-row gap-6">

                {/* -----------------------------------------
                   COLONNE GAUCHE : USER + lieu + LOGOUT
                ------------------------------------------*/}
                <div className="w-full md:w-1/4 flex flex-col justify-between md:border-r pr-4">

                    {/* USER CARD */}
                    <div>
                        <div className="bg-gray-100 p-4 rounded-lg border mb-4 shadow-sm">
                            <p className="text-sm font-medium text-gray-600">Connecté en tant que :</p>
                            <h3 className="text-lg font-bold text-gray-900">
                                {user.prenom} {user.nom}
                            </h3>
                            <p className="text-sm text-yellow-700 mt-1">
                                Rôle : {user.role || "Agent lieu"}
                            </p>
                        </div>

                        {/* lieu CARD */}
                        <div className="bg-blue-100 border border-blue-400 rounded-lg p-4 shadow-sm text-center">
                            <p className="text-sm text-gray-600">lieu :</p>
                            <h2 className="text-lg font-semibold text-blue-900">
                                {lieu.lib_lieu} (#{lieu.id})
                            </h2>
                        </div>
                    </div>

                    {/* LOGOUT */}
                    <div className="mt-6 border-t pt-4">
                        <DeconnexionButton />
                    </div>
                </div>


                {/* -----------------------------------------
                   COLONNE CENTRALE : AFFICHAGE RESULTATS
                ------------------------------------------*/}
                <div className="w-full md:w-1/2 px-2">
                    <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
                        <h2 className="text-xl font-bold text-center mb-4 text-gray-800">
                            Résultats provisoires
                        </h2>

                        {candidats.map((c) => (
                            <div
                                key={c.id}
                                className="flex justify-between items-center border-b py-2"
                            >
                                <span className="font-medium text-gray-800">
                                    {c.nom} ({c.parti})
                                </span>

                                <span className="font-bold text-blue-700 text-lg">
                                    {scores[c.id] ?? 0}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>


                {/* -----------------------------------------
                   COLONNE DROITE : SAISIE FINALE
                ------------------------------------------*/}
                <div className="w-full md:w-1/4 md:border-l pl-4">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                        Saisie des résultats finaux
                    </h3>

                    {candidats.map((c) => (
                        <div key={c.id} className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {c.nom} ({c.parti})
                            </label>
                            <input
                                type="number"
                                className="w-full border rounded-lg p-2 focus:ring-blue-500"
                                value={scores[c.id] ?? ""}
                                onChange={(e) => handleChange(c.id, e.target.value)}
                            />
                        </div>
                    ))}

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`w-full py-3 rounded-lg font-semibold mt-2 ${
                            isLoading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                    >
                        {isLoading ? "Enregistrement…" : "Valider les résultats"}
                    </button>
                </div>
            </div>
        </div>
    );
}
