// scripts/generateQuestions.js
import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const API_URL = "http://127.0.0.1:1234/v1/chat/completions"; // LM Studio API
const MODEL = "llama-3.2-3b-instruct";

// Filstier
const inputFile = path.resolve("./data/questions.no.json");
const outputFile = path.resolve("./data/questions.en.json");

console.log("🌐 Oversetter spørsmål via LM Studio...\n");

// Leser inn norske spørsmål
const noData = JSON.parse(fs.readFileSync(inputFile, "utf8"));

// Prompt for oversettelse
const prompt = `
You are a professional translator specialized in cybersecurity.
Translate the following JSON from Norwegian to clear, professional English.
Keep the same JSON structure (id, prompt, isPhish, why). 
Do not remove or add any questions. Only translate the text.

Here is the file:
${JSON.stringify(noData, null, 2)}
`;

(async () => {
  try {
    // Sender forespørsel til LM Studio
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: "You are a cybersecurity JSON translator." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      console.error(`❌ Feil fra API: ${res.status} ${res.statusText}`);
      return;
    }

    const data = await res.json();
    const translated = data?.choices?.[0]?.message?.content?.trim();

    if (!translated) {
      console.error("⚠️ Ingen oversettelse mottatt fra LM Studio.");
      return;
    }

    // Lagre den oversatte filen
    fs.writeFileSync(outputFile, translated, "utf8");
    console.log("✅ Oversettelse fullført!");
    console.log(`💾 Fil lagret til: ${outputFile}`);

    // --- Validering av strukturen ---
    console.log("\n🔍 Sjekker at antall spørsmål stemmer...");

    const enData = JSON.parse(fs.readFileSync(outputFile, "utf8"));
    let errors = [];

    for (const key of Object.keys(noData)) {
      const noLen = noData[key].length;
      const enLen = enData[key]?.length || 0;
      if (noLen !== enLen) {
        errors.push(`❌ ${key}: ${noLen} spørsmål på norsk, ${enLen} på engelsk`);
      } else {
        console.log(`✅ ${key}: ${noLen} spørsmål i begge filer`);
      }
    }

    if (errors.length > 0) {
      console.log("\n⚠️ Uoverensstemmelser funnet:");
      errors.forEach(e => console.log(e));
    } else {
      console.log("\n🎉 Alle kategorier stemmer perfekt!");
    }

  } catch (err) {
    console.error("🚫 Feil ved oversettelse:", err.message);
  }
})();
