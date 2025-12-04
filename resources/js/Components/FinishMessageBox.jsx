
/**
 *
 * @param {string} message
 */

import DeconnexionButton from "./DeconnexionButton";



export default function FinishMessageBox({message}){

              return <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 p-4">
                    <div className="bg-yellow-100 border-l-4 border-yellow-400 p-6 rounded-lg shadow-md max-w-md text-center">
                        <h2 className="text-lg font-semibold text-yellow-800 mb-2">
                           {message}
                        </h2>
                         <DeconnexionButton />

                    </div>
                </div>

}
