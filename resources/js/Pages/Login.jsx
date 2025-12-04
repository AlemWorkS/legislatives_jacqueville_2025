import { Head, useForm } from "@inertiajs/react";

export default function Login() {
  const { data, setData, processing, errors, post, reset } = useForm({
    num: "",
    password: "",
  });

  const submit = (e) => {
    e.preventDefault();

    // Utiliser la méthode post fournie par useForm
    // route('login') doit être le nom de ta route POST (->name('login'))
    post(route('loginProcess'), {
      onSuccess: () => {
        // Si tu veux nettoyer le password après succès
        reset('password');
      },
      onError: (errs) => {
        // Optionnel : log des erreurs côté client
        console.log('login errors', errs);
      },
      onFinish: () => {
        // ex: enlever loading ou autres cleanup si besoin
      }
    });
  };

  return (
    <>
      <Head title="Connexion" />
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
          <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="tel" className="block mb-1 text-sm">Numéro de téléphone</label>
              <input
                id="tel"
                type="tel"
                value={data.num}
                onChange={(e) => setData("num", e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-blue-500"
                placeholder="Ex : 0708123456"
                required
              />
              {errors.num && <div className="text-red-500 text-sm mt-1">{errors.num}</div>}
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 text-sm">Mot de passe</label>
              <input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-blue-500"
                placeholder="********"
                required
              />
              {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
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
