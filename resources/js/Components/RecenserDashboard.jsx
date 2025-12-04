import { useState } from "react";

export default function RecenserDashboard() {

  const [cumul, setCumul] = useState(0);
  const [value, setValue] = useState("");

  const handleConfirm = () => {
    const num = Number.parseInt(value);
    if (!Number.isNaN(num) && num > cumul) {
      setCumul(cumul + num);
      setValue("");
    }
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="w-full max-w-6xl bg-white border rounded-xl shadow-md p-6 flex">

        {/* Colonne gauche */}
        <div className="w-1/4 border-r pr-4">
          <div className="bg-yellow-200 text-lg font-semibold px-4 py-3 rounded-md border">
            RECENSER
          </div>
        </div>

        {/* Colonne centrale */}
        <div className="w-1/2 px-4">
          {/* Bloc nombre cumulé */}
          <div className="border rounded-md p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Nombre cumulé de votant
            </h2>

            <p className="text-3xl font-bold text-center">{cumul}</p>
          </div>

          {/* Bloc répartition */}
          <div className="border rounded-md p-4">
            <h2 className="text-xl font-semibold mb-2">
              Répartition des voies
            </h2>

            <p className="text-gray-500">En construction…</p>
          </div>
        </div>

        {/* Colonne droite */}
        <div className="w-1/4 border-l pl-4 flex flex-col justify-center">

          <p className="text-sm text-gray-600 mb-2">
            Ajoutez le nombre cumulé actuel
          </p>

          <input
            type="number"
            className="border p-2 rounded-md mb-4 w-full"
            placeholder="Saisir un nombre"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <button
            onClick={handleConfirm}
            className="bg-yellow-300 border border-yellow-500 py-2 rounded-md font-semibold hover:bg-yellow-400"
          >
            Confirmer
          </button>
        </div>

      </div>
    </div>
  );
}
