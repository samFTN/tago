// Pas besoin de node-fetch, Node 18+ fournit fetch global
const MAKE_API_KEY = "IAGuitarisationAPIKey";

export async function handler(event) {
  try {
    const body = JSON.parse(event.body);
    const { message, studentId } = body;

    console.log("Message reçu :", { studentId, message });

    const response = await fetch("https://hook.eu2.make.com/h1yxtaaobrh75ggv9ix822a8wzesc2i4", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-make-apikey": MAKE_API_KEY
      },
      // On envoie à Make le studentId en plus du message
      body: JSON.stringify({ 
        studentId: studentId || "unknown", 
        message 
      })
    });

    if (!response.ok) {
      console.error("Erreur webhook Make :", response.status, await response.text());
      return {
        statusCode: 500,
        body: JSON.stringify({ reply: "Erreur serveur : problème avec le webhook Make" })
      };
    }

    const replyText = await response.text();
    console.log("Réponse reçue de Make :", replyText);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ reply: replyText })
    };
  } catch (err) {
    console.error("Relay error :", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Erreur serveur : problème interne" })
    };
  }
}