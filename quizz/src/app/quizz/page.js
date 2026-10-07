// ==============================================================================
// FICHIER : src/app/quizz/page.js
// RÔLE : Composant principal du Quizz (Page "/quizz").
//
// C'est le "composant conteneur" (ou chef d'orchestre) de l'application :
// - Il détient la vérité sur l'état global du jeu (questions sélectionnées, score, progression).
// - Il orchestre l'affichage de l'un des 3 écrans selon la situation :
//     1. Écran de configuration (choix du nombre de questions)
//     2. Écran de jeu (affichage de la question courante et pagination)
//     3. Écran de fin (score final, récapitulatif des réponses)
// ==============================================================================

// En Next.js (App Router), tous les fichiers sont par défaut des "Server Components".
// Pour utiliser l'interactivité, des événements (onClick, etc.) et des Hooks React (useState),
// la directive "use client" est OBLIGATOIRE tout en haut du fichier.
"use client";

// Import des bibliothèques externes et Hooks de React
import React, { useState, useEffect } from "react";
import Link from "next/link";

// Import de nos composants personnalisés (découpés dans des fichiers séparés pour la clarté)
import ChoiceNumber from "./component/choiceNumber";
import ShowQuestion from "./component/showQuestion";
import NumberQuestion from "./component/numberQuestion";

// Import du catalogue de questions brutes
import { questions } from "./component/questions/general";

// Import du leaderboard et de l'authentification
import AuthForm from "./component/AuthForm";
import SidebarLeaderboard from "./component/sidebarLeaderboard";

export default function Start() {
    // --------------------------------------------------------------------------
    // 1. ÉTATS DU COMPOSANT (useState)
    // --------------------------------------------------------------------------
    // Un "état" (state) est la mémoire vive d'un composant React.
    // Dès qu'on modifie un état avec sa fonction "set...", React rafraîchit (re-render) l'affichage automatiquement.

    // Nombre de questions souhaité par l'utilisateur (valeur par défaut : 5)
    const [numberQuestions, setNumberQuestions] = useState(5);

    // Tableau contenant la liste des questions sélectionnées pour la partie courante (vide au départ)
    const [quizz, setQuizz] = useState([]);

    // Index (position) de la question actuellement affichée à l'écran (commence à 0)
    const [currentQuestion, setCurrentQuestion] = useState(0);

    // Dictionnaire (objet) stockant les réponses de l'utilisateur.
    // Format : { 0: { answer: "HTML", isCorrect: true }, 1: { ... } }
    const [userAnswers, setUserAnswers] = useState({});

    // Booléen indiquant si le quizz est terminé (pour afficher l'écran de fin)
    const [isFinished, setIsFinished] = useState(false);

    // Pour basculer entre l'écran des scores et l'écran de révision
    const [showReview, setShowReview] = useState(false);

    // Constante permettant de savoir si l'utilisateur est en train de réviser ses réponses (affichage du récapitulatif)
    const [isReviewing, setIsReviewing] = useState(false);

    // Constante pour savoir si le score a été sauvegardé dans la base de données
    const [scoreSaved, setScoreSaved] = useState(false);

    // Gestion de l'utilisateur
    const [user, setUser] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                localStorage.removeItem("user");
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    if (!mounted) return null;
    // 

    // Constante pour sauvegarder le score dans la base de données
    const saveScoreToDatabase = async () => {
        const savedUser = localStorage.getItem("user");
        if (!savedUser) return;
    
        const currentUser = JSON.parse(savedUser);
        const incorrect = quizz.length - score;

        try {
            await fetch("/api/scores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: currentUser.id, // Correction : userId devient user_id
                score: score,            // Ajout du score manquant
                correct: score,
                incorrect: incorrect,
            }),
        });
            setScoreSaved(true);

        } catch (error) {
            console.error("Erreur lors de l'enregistrement du score", error);
        }


    // Modifie ta fonction handleFinish existante pour y intégrer l'appel :
    const handleFinish = () => {
        setIsFinished(true);
        setIsReviewing(true);
        saveScoreToDatabase(); // <-- AJOUTER CET APPEL ICI
    };
};    
    // --------------------------------------------------------------------------
    // 2. LOGIQUE MÉTIER & FONCTIONS DE GESTION DU JEU
    // --------------------------------------------------------------------------

    /**
     * Initialise et démarre une nouvelle partie de quizz.
     * 1. Mélange aléatoirement toutes les questions disponibles.
     * 2. Sélectionne le nombre de questions demandé.
     * 3. Réinitialise la progression et les réponses.
     */
    const setNewQuizz = () => {
        // Mélange aléatoire (Algorithme de tri basé sur un comparateur aléatoire) :
        // L'opérateur de décomposition [...questions] crée une copie superficielle
        // pour ne JAMAIS modifier le tableau d'origine (principe d'immutabilité).
        const shuffled = [...questions].sort(() => 0.5 - Math.random());

        // On s'assure de ne pas demander plus de questions qu'il n'en existe
        const count = Math.min(numberQuestions, questions.length);

        // .slice(0, count) découpe les 'count' premiers éléments du tableau mélangé
        const selectedQuestions = shuffled.slice(0, count);

        // Mise à jour des états pour démarrer le quizz
        setQuizz(selectedQuestions);
        setCurrentQuestion(0);
        setUserAnswers({});
        setIsFinished(false);
    };

    /**
     * Enregistre la réponse choisie par l'utilisateur pour la question courante.
     *
     * @param {string} answer - Le texte de la réponse choisie.
     * @param {boolean} isCorrect - true si la réponse est correcte, false sinon.
     */
    const handleAnswer = (answer, isCorrect) => {
        // BONNE PRATIQUE REACT :
        // Pour mettre à jour un objet dans l'état sans écraser les anciennes réponses,
        // on copie l'état existant (...prev) et on ajoute ou modifie la clé de la question actuelle.
        setUserAnswers((prev) => ({
            ...prev,
            [currentQuestion]: { answer, isCorrect },
        }));
    };

    /**
     * Réinitialise totalement le quizz pour revenir au menu de sélection initial.
     */
    const handleRestart = () => {
        setQuizz([]);
        setCurrentQuestion(0);
        setUserAnswers({});
        setIsFinished(false);
    };

    // --------------------------------------------------------------------------
    // 3. VALEURS CALCULÉES ("Derived State")
    // --------------------------------------------------------------------------
    // Inutile de créer un useState pour le score !
    // En React, si une valeur peut être déduite d'un état existant (ici userAnswers),
    // on la calcule simplement à chaque affichage.
    // Object.values() extrait la liste des réponses enregistrées, et .filter() ne garde que les bonnes réponses.
    const score = Object.values(userAnswers).filter((a) => a.isCorrect).length;
    const answeredCount = Object.keys(userAnswers).length;

    // --------------------------------------------------------------------------
    // 4. RENDU VISUEL (JSX) & CONDITIONS D'AFFICHAGE
    // --------------------------------------------------------------------------
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-gray-50 dark:bg-gray-900">
            {/*
              STRUCTURE CONDITIONNELLE PRINCIPALE (Opérateur ternaire en cascade) :
              
              Cas A : quizz.length === 0
              -> La partie n'a pas encore commencé. On affiche le composant de configuration <ChoiceNumber />.
            */}
            {quizz.length === 0 ? (
                <ChoiceNumber
                    numberQuestions={numberQuestions}
                    setNumberQuestions={setNumberQuestions}
                    onTrigger={setNewQuizz}
                    maxQuestions={questions.length}
                />
            ) : isFinished ? (
                /*
                  Cas B : isFinished === true
                  -> La partie est terminée. Affichage en 2 colonnes : le récap au centre, le leaderboard à droite.
                */
                <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8">
                    
                    {/* Colonne de gauche / principale : Résultats et Récapitulatif */}
                    <div className="flex-1 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-center flex flex-col items-center border border-gray-100 dark:border-gray-700">
                        {/* Icône de victoire ou d'encouragement */}
                        <span className="text-6xl mb-2 block animate__animated animate__tada animate__delay-1s">
                            {score >= quizz.length / 2 ? "🏆" : "💪"}
                        </span>
                        <h2 className="text-3xl font-extrabold mb-2 text-gray-900 dark:text-white">
                            Quizz Terminé !
                        </h2>

                        {/* Message d'appréciation personnalisé */}
                        <p className="text-gray-600 dark:text-gray-300 mb-6 text-base sm:text-lg">
                            {score === quizz.length
                                ? "Félicitations ! Un score parfait !"
                                : score >= quizz.length / 2
                                ? "Bien joué ! Vous avez de solides connaissances !"
                                : "Courage ! Entraînez-vous pour faire encore mieux !"}
                        </p>

                        {/* --- BLOC DE GESTION UTILISATEUR / SCORE --- */}
                        {user ? (
                            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl w-full max-w-sm">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Connecté en tant que : <span className="font-bold text-blue-600 dark:text-blue-400">{user.pseudo}</span>
                                </p>
                                {scoreSaved ? (
                                    <p className="text-xs text-green-600 dark:text-green-400 font-bold mt-1">
                                        Score enregistré dans le leaderboard ! 🎉
                                    </p>
                                ) : (
                                    <button
                                        onClick={saveScoreToDatabase}
                                        className="mt-2 text-xs px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow transition-all"
                                    >
                                        Envoyer mon score au leaderboard
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="w-full max-w-sm mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl">
                                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-3">
                                    Connectez-vous pour enregistrer votre score !
                                </p>
                                <AuthForm 
                                    onLoginSuccess={(loggedInUser) => {
                                        setUser(loggedInUser);
                                        localStorage.setItem("user", JSON.stringify(loggedInUser));
                                    }} 
                                />
                            </div>
                        )}
                        {/* ------------------------------------------ */}

                        {/* Message de confirmation d'enregistrement */}
                        {scoreSaved && (
                            <p className="text-xs text-green-600 dark:text-green-400 font-bold mb-4">
                                Score enregistré dans le leaderboard avec succès ! 🎉
                            </p>
                        )}

                        {/* Bloc d'affichage de la note et du pourcentage */}
                        <div className="animate__animated animate__heartBeat animate__delay-1s my-4 p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-200 dark:border-blue-800 w-full max-w-sm shadow-inner">
                            <div className="text-5xl font-black text-blue-600 dark:text-blue-400">
                                {score} / {quizz.length}
                            </div>
                            <div className="text-base font-semibold text-gray-700 dark:text-gray-200 mt-2">
                                {Math.round((score / quizz.length) * 100)}% de bonnes réponses
                            </div>
                        </div>

                        {/* Liste récapitulative de chaque question avec indicateur ✓ ou ✗ */}
                        <div className="w-full text-left mt-6 mb-6">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-3">
                                Récapitulatif des questions :
                            </h3>
                            <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-2">
                                {quizz.map((q, idx) => {
                                    const ans = userAnswers[idx];
                                    const isAnsCorrect = ans && ans.isCorrect;
                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => {
                                                setCurrentQuestion(idx);
                                                setIsFinished(false);
                                                setIsReviewing(true);
                                            }}
                                            className={`p-3.5 rounded-xl border-2 text-sm flex items-start justify-between gap-3 transition-all cursor-pointer hover:scale-[1.01] hover:shadow-md ${
                                                isAnsCorrect 
                                                    ? "bg-green-50 border-green-300 text-green-950 dark:bg-green-950/30 dark:border-green-800 dark:text-green-200" 
                                                    : "bg-red-50 border-red-300 text-red-950 dark:bg-red-950/30 dark:border-red-800 dark:text-red-200"
                                            }`}
                                        >
                                            <div>
                                                <span className="font-bold mr-2">Q{idx + 1}.</span>
                                                <span>{q.question}</span>
                                            </div>
                                            <span className="font-extrabold text-base flex-shrink-0">
                                                {isAnsCorrect ? "✓" : "✗"}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Boutons d'action : Recommencer ou Retourner à l'accueil */}
                        <div className="flex flex-wrap gap-4 justify-center mt-2">
                            <button
                                onClick={() => {
                                    setScoreSaved(false); // Réinitialiser pour la prochaine partie
                                    setNewQuizz();
                                }}
                                className="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                Recommencer un quizz
                            </button>
                            <Link
                                href="/"
                                className="px-7 py-3.5 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                Retour à l'accueil
                            </Link>
                        </div>
                    </div>

                    {/* Colonne de droite : La Sidebar Leaderboard */}
                    <div className="w-full lg:w-auto flex justify-center">
                        <SidebarLeaderboard />
                    </div>

                </div>
            ) : (
                /*
                  Cas C : La partie est en cours !
                  On affiche deux sous-composants :
                  - ShowQuestion : montre la question active.
                    Remarque : la prop `key={currentQuestion}` force React à re-créer
                    proprement le composant ShowQuestion à chaque changement de question.
                  - NumberQuestion : barre de pagination (Précédent / Suivant / Terminer).
                */
                <>
                    <ShowQuestion
                        key={currentQuestion}
                        question={quizz[currentQuestion]}
                        questionNumber={currentQuestion + 1}
                        totalQuestions={quizz.length}
                        savedAnswer={userAnswers[currentQuestion]}
                        onAnswer={handleAnswer}
                    />

                    <NumberQuestion
                        setNumber={setCurrentQuestion}
                        numberTotalQuestions={quizz.length}
                        currentNumber={currentQuestion}
                        onFinish={() => setIsFinished(true)}
                        isCurrentAnswered={!!userAnswers[currentQuestion]}
                        isReviewing={isReviewing}
                        setIsFinished={setIsFinished}
                    />
                </>
            )}
        </main>
    );
}
