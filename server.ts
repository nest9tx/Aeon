import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Check Gemini API Key and initialize the SDK
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // API Endpoints
  app.post("/api/spiritual-guidance", async (req, res): Promise<any> => {
    try {
      const { messages, userApiKey } = req.body;
      const parsedUserApiKey = req.headers["x-user-api-key"] || userApiKey;

      let activeAi = ai;

      if (parsedUserApiKey && typeof parsedUserApiKey === "string") {
        activeAi = new GoogleGenAI({
          apiKey: parsedUserApiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build-user",
            },
          },
        });
      }

      if (!activeAi) {
        return res.status(500).json({
          error: "Spiritual connection not configured. Please build connection by adding your own API key under 'Akashic Companion Key Config' or configure server keys.",
        });
      }

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      // Convert messages to the gemini expected format
      const contents = messages.map((m: any) => ({
        role: m.role === "model" || m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.text }],
      }));

      const systemInstruction = 
        "You are an ancient, compassionate, and deeply realized Spiritual Guide, " +
        "Hermetic philosopher, and Zen Master who assists earnest seekers of truth with their spiritual awakening. " +
        "Provide elegant, wise, and kind answers grounded in non-duality (Advaita Vedanta, Zen, Taoism, Mysticism). " +
        "Encourage self-inquiry ('Who is experiencing this?'), breathing, and tuning into Solfeggio acoustic tones. " +
        "Address spiritual emergence symptoms (dark night of the soul, energy sensations, ego dissolution) " +
        "with immense reassurance, practical grounding advice (like walking, eating root vegetables, cold water), " +
        "and clear metaphors. Avoid any robotic disclaimer-like language (like 'I am an AI, consult a doctor'), " +
        "but speak as a true spiritual friend (Kalyana-mitra) with serene authority. Keep answers reasonably brief, " +
        "poetic, and deeply spiritual.";

      const response = await activeAi.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.75,
        },
      });

      const reply = response.text || "Remain in silent awareness. The mind is currently empty.";
      res.json({ text: reply });
    } catch (error: any) {
      console.error("Gemini Spiritual Guidance Error:", error);
      res.status(500).json({
        error: error.message || "An error occurred while seeking guidance from the Cosmos.",
      });
    }
  });

  // Serve static UI assets or delegate to Vite in dev Mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Spiritual Awakening sanctuary running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to begin Spiritual Sanctuary:", err);
});
