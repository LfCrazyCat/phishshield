import fetch from "node-fetch";

const API_URL = "http://127.0.0.1:1234/v1/chat/completions";

(async () => {
  console.log("🧠 Tester LM Studio-tilkobling...");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.2-3b-instruct",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Say 'Hello from LM Studio!'" },
        ],
      }),
    });

    if (!res.ok) {
      console.error(`❌ Feil fra API: ${res.status} ${res.statusText}`);
      return;
    }

    const data = await res.json();
    console.log("✅ Svar mottatt fra LM Studio:");
    console.log(data.choices?.[0]?.message?.content || "Ingen tekst mottatt.");
  } catch (err) {
    console.error("🚫 Kunne ikke koble til API:", err.message);
  }
})();
