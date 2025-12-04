// src/Components/DeconnexionButton.jsx
import { Link } from "@inertiajs/react";
import React from 'react';

export default function DeconnexionButton() {
    return (
        <Link
            href={route('logout')}
            method="get"
            as="button"
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg shadow-md transition duration-200 text-sm"
        >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H9" />
            </svg>
            <span>Se Deconnecter</span>
        </Link>
    );
}
