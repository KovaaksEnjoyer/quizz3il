"use client";

import React, { useEffect, useState } from "react";

export default function SidebarLeaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaderboard = async () => {
        try {
            const res = await fetch("/api/scores");
            
            // Lecture sécurisée du texte brut avant de parser en JSON
            const text = await res.text();
            const data = text ? JSON.parse(text) : {};

            if (res.ok && data.success) {
                setLeaderboard(data.leaderboard);
            }
        } catch (error) {
            console.error("Erreur chargement leaderboard:", error);
        } finally {
            // TRÈS IMPORTANT : On désactive le chargement dans tous les cas
            setLoading(false);
        }
    };

    // Charger le classement au montage du composant
    useEffect(() => {
        fetchLeaderboard();
        // Optionnel : actualiser toutes les 10 secondes
        const interval = setInterval(fetchLeaderboard, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full lg:w-80 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="font-extrabold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                🏆 Leaderboard
            </h3>

            {loading ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    Chargement du classement...
                </p>
            ) : leaderboard.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    Aucun score enregistré pour l'instant.
                </p>
            ) : (
                <div className="flex flex-col gap-2.5">
                    {leaderboard.map((entry, index) => (
                        <div
                            key={entry.id || index}
                            className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 text-sm"
                        >
                            <div className="flex items-center gap-2.5">
                                <span className={`font-bold text-xs px-2 py-1 rounded-lg ${
                                    index === 0 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300" :
                                    index === 1 ? "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200" :
                                    index === 2 ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300" :
                                    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                }`}>
                                    #{index + 1}
                                </span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[100px]">
                                    {entry.pseudo}
                                </span>
                            </div>

                            <div className="text-right">
                                <div className="font-extrabold text-blue-600 dark:text-blue-400">
                                    {entry.score} pts
                                </div>
                                <div className="text-[10px] text-gray-400 dark:text-gray-500">
                                    ({entry.correct}✓ / {entry.incorrect}✗)
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}