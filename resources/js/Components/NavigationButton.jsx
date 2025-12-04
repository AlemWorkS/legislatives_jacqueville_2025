import { Link } from '@inertiajs/react';
import { HiArrowSmRight, HiDocumentText } from 'react-icons/hi';
// N'oubliez pas d'installer react-icons si ce n'est pas déjà fait : npm install react-icons

export default function NavigationButton({ targetRoute, label, currentActivity, icon: Icon }) {
    return (
        <Link
            href={targetRoute}
            className="w-full mt-4 flex items-center justify-between p-3 rounded-lg text-sm font-semibold
                       bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200 shadow-md"
        >
            <div className="flex items-center">
                <Icon className="w-5 h-5 mr-2" />
                {label}
            </div>
            <HiArrowSmRight className="w-5 h-5" />
        </Link>
    );
}
