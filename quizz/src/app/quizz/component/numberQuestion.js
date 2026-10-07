// ==============================================================================
// FICHIER : src/app/quizz/component/numberQuestion.js
// RÔLE : Barre de navigation entre les questions (Précédent / Suivant / Terminer).
// ==============================================================================

/**
 * Composant de navigation NumberQuestion
 *
 * @param {Function} props.setNumber - Fonction pour changer l'index de la question courante.
 * @param {number} props.numberTotalQuestions - Nombre total de questions dans le quizz actuel.
 * @param {number} props.currentNumber - Index de la question courante (commence à 0).
 * @param {Function} props.onFinish - Fonction appelée pour marquer le quizz comme terminé.
 * @param {boolean} props.isCurrentAnswered - Indique si la question courante a déjà reçu une réponse.
 */
export default function NumberQuestion({
    setNumber,
    numberTotalQuestions,
    currentNumber,
    onFinish,
    isCurrentAnswered = false,
    isReviewing,
    setIsFinished
}) {
    // --------------------------------------------------------------------------
    // 1. LOGIQUE DE NAVIGATION
    // --------------------------------------------------------------------------

    /**
     * Recule à la question précédente.
     * BONNE PRATIQUE REACT :
     * Quand on met à jour un état en se basant sur sa valeur précédente,
     * on passe une fonction de rappel (callback) au setter : `(prev) => ...`.
     * `Math.max(0, prev - 1)` garantit qu'on ne descendra JAMAIS sous l'index 0.
     */
    function handlePrevious() {
        setNumber((prev) => Math.max(0, prev - 1));
    }

    /**
     * Avance à la question suivante.
     * `Math.min(numberTotalQuestions - 1, prev + 1)` garantit qu'on ne dépasse
     * jamais le dernier index du tableau de questions.
     */
    function handleNext() {
        setNumber((prev) => Math.min(numberTotalQuestions - 1, prev + 1));
    }

    // Détermine si nous sommes actuellement sur la toute dernière question du quizz
    // (En informatique, les indices commencent à 0, donc la dernière question est à length - 1)
    const isLastQuestion = currentNumber >= numberTotalQuestions - 1;

    // --------------------------------------------------------------------------
    // 2. RENDU VISUEL (JSX)
    // --------------------------------------------------------------------------
    return (
        <div className="animate__animated animate__fadeIn flex items-center justify-between w-full max-w-2xl mt-6">
            {/*
              Bouton "Précédent"
              - 'disabled={currentNumber === 0}' : le bouton est désactivé si on est sur la 1ère question.
              - L'entité HTML '&larr;' affiche une flèche vers la gauche (←).
            */}
            <button
                className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium rounded-xl shadow hover:shadow-md transition-all duration-200 transform hover:-translate-x-0.5 active:translate-x-0"
                onClick={handlePrevious}
                disabled={currentNumber === 0}
            >
                &larr; Précédent
            </button>

            {/*
              RENDU CONDITIONNEL (Opérateur ternaire : condition ? siVrai : siFaux)
              - Si c'est la dernière question : on affiche le bouton "Terminer le quizz".
              - Sinon : on affiche le bouton standard "Suivant".
            */}
            {isReviewing ? (
               <button
                    onClick={() => setIsFinished(true)}
                    className="animate__animated animate__pulse animate__infinite px-7 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl shadow-lg transition"
                >
                    &larr; Retour au résumé
                </button>
            ) : (
                isLastQuestion ? (
                    <button
                        className="animate__animated animate__pulse animate__infinite px-7 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl shadow-lg transition"
                        onClick={onFinish}
                 >
                        Terminer le quizz &#127881;
                    </button>
                ) : (
                    <button
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow hover:shadow-md transition"
                        onClick={handleNext}
                    >
                        Suivant &rarr;
                    </button>
                )
            )}
        </div>
    );
}