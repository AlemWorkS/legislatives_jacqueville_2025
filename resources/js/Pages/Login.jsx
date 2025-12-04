import { Head, useForm } from "@inertiajs/react";
// Vous n'avez plus besoin d'importer handleLogin si vous utilisez la méthode Inertia post
// import { handleLogin } from "@/services/auth";

export default function Login() {
    // useForm d'Inertia gère les champs + soumission
    const { data, setData, processing, errors, post } = useForm({ // <-- Ajout de 'post'
        num: "",
        password: "",
    });

    function submit(e) {
    e.preventDefault();

    // Inertia soumet le formulaire et gère:
    // - Echec (422) -> peuplement de l'objet 'errors'
    // - Succès (302) -> redirection vers la bonne page
    post(route('login'));

        // --- FIN MODIFICATION CRUCIALE ---
    }

    return (
        <>
            <Head title="Connexion" />
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
                    <h1 className="text-2xl font-bold text-center mb-6">
                        Connexion
                    </h1>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label htmlFor="tel" className="block mb-1 text-sm">
                                Numéro de téléphone
                            </label>
                            <input
                                id="tel"
                                type="tel"
                                value={data.num}
                                onChange={(e) => setData("num", e.target.value)}
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-blue-500"
                                placeholder="Ex : 0708123456"
                                required
                            />
                            {/* L'affichage des erreurs est déjà correct, Inertia va le peupler */}
                            {errors.num && (
                                <div className="text-red-500 text-sm mt-1">{errors.num}</div>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block mb-1 text-sm"
                            >
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-blue-500"
                                placeholder="********"
                                required
                            />
                            {errors.password && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full p-2 bg-blue-500 hover:bg-blue-600 rounded font-semibold transition duration-150 disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {processing ? "Connexion..." : "Se connecter"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
