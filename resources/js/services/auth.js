import { ApiUrl } from "@/routes/urls";
import axios from "axios";

/**
 * @param {LoginRequestDto} data
 */
export async function handleLogin(data) {
    try {
        // Assure-toi que le cookie de session et CSRF sont envoyés
        axios.defaults.withCredentials = true;

        const response = await axios.post(ApiUrl.sendLoginPath, data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });

        const result = response.data;
        console.log("Login réussi :", result);

        // Exemple de redirection selon rôle
        if (result.role === "admin") {
            window.location.href = "/admin";
        } else if (result.role === "agent de bureau") {
            window.location.href = "/dashboard";
        }

    } catch (error) {
        console.error("Erreur auth :", error.response?.data || error.message);
    }
}
