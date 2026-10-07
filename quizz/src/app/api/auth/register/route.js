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

        // 2. Vérifier si le pseudo existe déjà
        const existingUser = await db.execute({
            sql: "SELECT * FROM users WHERE pseudo = ?",
            args: [pseudo],
        });

        if (existingUser.rows.length > 0) {
            return NextResponse.json(
                { error: "Ce pseudo est déjà pris." },
                { status: 400 }
            );
        }

        // 3. Hacher le mot de passe pour la sécurité
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Insérer l'utilisateur dans la base de données Turso
        await db.execute({
            sql: "INSERT INTO users (pseudo, password) VALUES (?, ?)",
            args: [pseudo, hashedPassword],
        });

        return NextResponse.json(
            { success: true, message: "Inscription réussie !" },
            { status: 201 }
        );

    } catch (error) {
        console.error("Erreur inscription:", error);
        return NextResponse.json(
            { error: "Erreur serveur lors de l'inscription." },
            { status: 500 }
        );
    }
}