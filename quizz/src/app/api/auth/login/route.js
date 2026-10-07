import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        const { pseudo, password } = await request.json();

        // 1. Vérification des champs
        if (!pseudo || !password) {
            return NextResponse.json(
                { error: "Veuillez remplir tous les champs." },
                { status: 400 }
            );
        }

        // 2. Rechercher l'utilisateur dans la base de données
        const result = await db.execute({
            sql: "SELECT * FROM users WHERE pseudo = ?",
            args: [pseudo],
        });

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: "Identifiants incorrects." },
                { status: 401 }
            );
        }

        const user = result.rows[0];

        // 3. Comparer le mot de passe avec le hash stocké
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Identifiants incorrects." },
                { status: 401 }
            );
        }

        // 4. Succès : on renvoie les infos de l'utilisateur (sans le mot de passe)
        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                pseudo: user.pseudo,
            },
        });

    } catch (error) {
        console.error("Erreur connexion:", error);
        return NextResponse.json(
            { error: "Erreur serveur lors de la connexion." },
            { status: 500 }
        );
    }
}