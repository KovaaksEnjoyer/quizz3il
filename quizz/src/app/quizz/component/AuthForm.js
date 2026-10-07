"use client";

import React, { useState } from "react";

export default function AuthForm({ onLoginSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [pseudo, setPseudo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pseudo, password }),
            });

            const text = await res.text();
            const data = text ? JSON.parse(text) : {};

            if (!res.ok) {
                throw new Error(data.error || "Une erreur est survenue");
            }

            if (isLogin) {
                // Connexion réussie : on sauvegarde l'utilisateur dans le localStorage
                localStorage.setItem("user", JSON.stringify(data.user));
                onLoginSuccess(data.user);
            } else {
                // Inscription réussie : on bascule vers le formulaire de connexion
                setIsLogin(true);
                setError("Inscription réussie ! Vous pouvez vous connecter.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            {/* Onglets pour basculer entre Connexion et Inscription */}
            <div className="flex justify-center mb-6 gap-6 border-b border-gray-100 dark:border-gray-700 pb-2">
                <button
                    type="button"
                    onClick={() => { setIsLogin(true); setError(""); }}
                    className={`font-bold text-sm pb-2 transition-colors border-b-2 ${
                        isLogin ? "border-blue-600 text-blue-600 dark:text-blue-400" : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                >
                    Connexion
                </button>
                <button
                    type="button"
                    onClick={() => { setIsLogin(false); setError(""); }}
                    className={`font-bold text-sm pb-2 transition-colors border-b-2 ${
                        !isLogin ? "border-blue-600 text-blue-600 dark:text-blue-400" : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                >
                    Inscription
                </button>
            </div>

            {/* Affichage des messages d'erreur ou de succès */}
            {error && (
                <div className={`p-3 mb-4 rounded-xl text-xs font-medium ${
                    error.includes("réussie") 
                        ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300 border border-green-200 dark:border-green-800" 
                        : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800"
                }`}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                        Pseudo
                    </label>
                    <input
                        type="text"
                        value={pseudo}
                        onChange={(e) => setPseudo(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Votre pseudo"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                        Mot de passe
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition text-sm disabled:opacity-50"
                >
                    {loading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
                </button>
            </form>
        </div>
    );
}