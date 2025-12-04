import React, { useState } from 'react'; // Importez useState
import DeconnexionButton from "@/Components/DeconnexionButton";
import api from "@/utils/api";
import { Link } from "@inertiajs/react";
import { HiMenu, HiChevronLeft, HiChevronRight, HiChartBar, HiClipboardList, HiExclamationCircle, HiLocationMarker } from 'react-icons/hi'; // Importez des icônes

/**
 * Sidebar simple, extensible.
 */
export default function Sidebar() {
    // 1. Définir l'état de la sidebar: 'isOpen' est la variable d'état.
    const [isOpen, setIsOpen] = useState(true);

    // Fonction pour basculer l'état
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Définition des éléments de navigation avec leurs icônes
    const navItems = [
        { href: "/supervisor", label: "Metrics", icon: HiChartBar },
        { href: '/supervisor/dash/recensements', label: "Recensements", icon: HiClipboardList },
        { onClick: () => api.get('/supervisor/anomalies'), label: "Anomalies", icon: HiExclamationCircle, isButton: true },
        { href: "/supervisor/lieux", label: "Lieux", icon: HiLocationMarker },
    ];

    return (
        <aside
            // 3. Classes CSS dynamiques basées sur l'état 'isOpen'
            className={`
                ${isOpen ? 'w-64' : 'w-20'}
                bg-gray-900 text-white min-h-screen p-4 transition-all duration-300 ease-in-out flex flex-col
            `}
        >
            {/* --- En-tête et Bouton de bascule --- */}
            <div className={`mb-6 flex ${isOpen ? 'justify-between' : 'justify-center'} items-center`}>
                {isOpen && (
                    <div className="flex flex-col">
                        <div className="text-lg font-bold">📊 Superviseur</div>
                        <div className="text-xs text-gray-400">Vue d'ensemble</div>
                    </div>
                )}
                <button
                    onClick={toggleSidebar}
                    className="p-1 rounded hover:bg-gray-700 focus:outline-none"
                    title={isOpen ? "Rétracter" : "Développer"}
                >
                    {/* Icône de bascule : flèche gauche (ouvert) ou flèche droite (fermé) */}
                    {isOpen ? (
                        <HiChevronLeft className="h-6 w-6 text-white" />
                    ) : (
                        <HiChevronRight className="h-6 w-6 text-white" />
                    )}
                </button>
            </div>

            {/* --- Navigation --- */}
            <nav className="flex flex-col gap-2 flex-grow">
                {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const content = (
                        <>
                            <Icon className="h-6 w-6" />
                            {isOpen && (
                                <span className="ml-3 whitespace-nowrap overflow-hidden">
                                    {item.label}
                                </span>
                            )}
                        </>
                    );

                    const baseClasses = "flex items-center p-2 rounded hover:bg-gray-700 transition-colors duration-150";

                    if (item.isButton) {
                        return (
                            <button key={index} onClick={item.onClick} className={`${baseClasses} w-full text-left`}>
                                {content}
                            </button>
                        );
                    } else {
                        return (
                            <Link key={index} href={item.href} className={baseClasses}>
                                {content}
                            </Link>
                        );
                    }
                })}

                <hr className="my-4 border-gray-800" />
                                <DeconnexionButton isRetracted={!isOpen} />

            </nav>

            {/* --- Bouton Déconnexion --- */}
            <div className={`mt-auto ${isOpen ? 'w-full' : 'w-min mx-auto'}`}>
            </div>
        </aside>
    );
}
