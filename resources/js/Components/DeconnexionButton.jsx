import { Link } from "@inertiajs/react";

export default function DeconnexionButton(){
    return (
        <Link
        href={route("logout")}
        method="get"
        as="button"
        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
    >
        Déconnexion
    </Link>
    );
}
