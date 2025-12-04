import { handleLogin } from "@/services/auth";
import { Head, useForm } from "@inertiajs/react";

export default function Login() {
    // useForm d'Inertia gère les champs + soumission
    const { data, setData, processing, errors } = useForm({
        num: "",
        password: "",
    });

    async function submit(e) {
        e.preventDefault();
        await handleLogin(data);
    } 

    return (
        <>
            <Head title="Connexion" />
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
                    <h1 className="text-2xl font-bold text-center mb-6">
                        Connexion
                    </h1>

                    {/* Formulaire */}
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
                            {errors.num && (
                                <div className="text-red-500">{errors.num}</div>
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
                                <div className="text-red-500">
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full p-2 bg-blue-500 hover:bg-blue-600 rounded font-semibold"
                        >
                            {processing ? "Connexion..." : "Se connecter"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
