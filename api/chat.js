// api/chat.js
import OpenAI from "openai";

console.log("API KEY détectée :", process.env.OPENAI_API_KEY ? "OUI" : "NON");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {

    console.log("✅ Clé OpenAI détectée :", !!process.env.OPENAI_API_KEY);

    // Autoriser les CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Gérer pré-vol OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  
  if (req.method !== 'POST') {

     console.log("⛔ Mauvaise méthode :", req.method);
    res.setHeader('Allow', ['POST']);
    return res.status(405).end("Method Not Allowed");
  }

  const { prompt } = req.body;

   console.log("📥 Prompt reçu :", prompt);
  if (!prompt) {

      console.log("❌ Prompt manquant !");  
    return res.status(400).json({ error: "Missing 'prompt' in body" });
  }

  try {
    // Appel à l'API Chat Completions
    const chat = await openai.chat.completions.create({
      model: "gpt-4o-turbo",   // ou le modèle de ton choix
      messages: [
        { role: "system", content: "Tu es un assistant pédagogique pour le nettoyage professionnel." },
        { role: "user", content: prompt }
      ]
    });

    const reply = chat.choices?.[0]?.message?.content ?? "";
    console.log("🗣️ Réponse GPT :", reply);
    
    // Activer les CORS pour ton front (si nécessaire)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Erreur OpenAI:", error);
    res.status(500).json({ error: "Erreur côté serveur" });
  }
}
