import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET : Récupérer le leaderboard
export async function GET() {
    try {
        // On groupe par utilisateur et on additionne (SUM) les scores, bonnes et mauvaises réponses
        const result = await db.execute(`
            SELECT 
                users.pseudo, 
                SUM(scores.score) AS score, 
                SUM(scores.correct) AS correct, 
                SUM(scores.incorrect) AS incorrect, 
                MAX(scores.created_at) AS created_at 
            FROM scores 
            JOIN users ON scores.user_id = users.id 
            GROUP BY users.id, users.pseudo
            ORDER BY score DESC 
            LIMIT 10
        `);

        return NextResponse.json({
            success: true,
            leaderboard: result.rows || [],
        }, { status: 200 });

    } catch (error) {
        console.error("Erreur GET scores:", error);
        return NextResponse.json(
            { success: false, error: "Erreur serveur lors de la récupération du leaderboard.", leaderboard: [] },
            { status: 500 }
        );
    }
}

// POST : Enregistrer un score
export async function POST(request) {
    try {
        const body = await request.json();
        const { user_id, score, correct, incorrect } = body;

        if (!user_id || score === undefined) {
            return NextResponse.json(
                { success: false, error: "Données manquantes." },
                { status: 400 }
            );
        }

        await db.execute({
            sql: `INSERT INTO scores (user_id, score, correct, incorrect, created_at) VALUES (?, ?, ?, ?, datetime('now'))`,
            args: [user_id, score, correct || 0, incorrect || 0],
        });

        return NextResponse.json(
            { success: true, message: "Score enregistré avec succès !" },
            { status: 201 }
        );

    } catch (error) {
        console.error("Erreur POST scores:", error);
        return NextResponse.json(
            { success: false, error: "Erreur serveur lors de l'enregistrement du score." },
            { status: 500 }
        );
    }
}