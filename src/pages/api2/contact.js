// dev/src/pages/api2/contact.js
import pb from 'dev/src/utils/pb.ts';

export const prerender = false;

export async function POST({ request }) {
    try {
        console.log("📨 Requête reçue");

        if (request.headers.get('content-type') !== 'application/json') {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Format de requête invalide"
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        const data = await request.json();
        console.log("💾 Données reçues:", JSON.stringify(data));

        if (!data.name || !data.email || !data.subject || !data.message) {
            console.log("❌ Champs manquants:", {
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message
            });
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Tous les champs sont obligatoires"
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        console.log("🔄 Tentative de création du record...");
        console.log("URL PocketBase:", pb.baseUrl);
        console.log("Collection:", 'contact');
        console.log("Données à envoyer:", {
            Nom: data.name,
            Email: data.email,
            Sujet: data.subject,
            Message: data.message,
        });

        const record = await pb.collection('contact').create({
            Nom: data.name,
            Email: data.email,
            Sujet: data.subject,
            Message: data.message,
        });

        console.log("✅ Record créé:", record.id);

        return new Response(
            JSON.stringify({
                success: true,
                id: record.id,
                message: "Votre message a été envoyé avec succès !"
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            }
        );

    } catch (error) {
        console.error("❌ ERREUR COMPLÈTE:", error);
        console.error("Message:", error?.message);
        console.error("Stack:", error?.stack);
        console.error("Status PocketBase:", error?.status);
        console.error("Data PocketBase:", error?.data);

        return new Response(
            JSON.stringify({
                success: false,
                error: error?.message || "Erreur serveur",
                status: error?.status || 500,
                details: error?.data || null
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}
