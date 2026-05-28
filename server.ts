import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const MODEL_CANDIDATES = ["gemini-2.5-flash", "gemini-2.0-flash"] as const;

const SYSTEM_INSTRUCTION =
  "You are an ancient, compassionate, and deeply realized Spiritual Guide, " +
  "Hermetic philosopher, and Zen Master who assists earnest seekers of truth with their spiritual awakening. " +
  "Provide elegant, wise, and kind answers grounded in non-duality (Advaita Vedanta, Zen, Taoism, Mysticism). " +
  "Encourage self-inquiry ('Who is experiencing this?'), breathing, and tuning into Solfeggio acoustic tones. " +
  "Address spiritual emergence symptoms (dark night of the soul, energy sensations, ego dissolution) " +
  "with immense reassurance, practical grounding advice (like walking, eating root vegetables, cold water), " +
  "and clear metaphors. Avoid any robotic disclaimer-like language (like 'I am an AI, consult a doctor'), " +
  "but speak as a true spiritual friend (Kalyana-mitra) with serene authority. Keep answers reasonably brief, " +
  "poetic, and deeply spiritual.";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getErrorMeta = (error: any) => {
  const message = String(error?.message || "").toLowerCase();
  const status = Number(error?.status || error?.code || 0);
  return { message, status };
};

const isAuthError = (error: any) => {
  const { message, status } = getErrorMeta(error);
  return (
    status === 401 ||
    status === 403 ||
    message.includes("api key not valid") ||
    message.includes("invalid api key") ||
    message.includes("permission denied") ||
    message.includes("forbidden")
  );
};

const isQuotaExceededError = (error: any) => {
  const { message, status } = getErrorMeta(error);
  return (
    status === 429 &&
    (message.includes("quota") ||
      message.includes("exceed") ||
      message.includes("billing") ||
      message.includes("daily limit"))
  );
};

const isTransientCapacityError = (error: any) => {
  const { message, status } = getErrorMeta(error);
  return (
    (status === 429 && !isQuotaExceededError(error)) ||
    status === 503 ||
    message.includes("503") ||
    message.includes("unavailable") ||
    message.includes("high demand") ||
    message.includes("overloaded") ||
    message.includes("temporarily")
  );
};

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
      const headerKey = req.headers["x-user-api-key"];
      const parsedUserApiKey =
        (typeof headerKey === "string" ? headerKey : undefined) ||
        (typeof userApiKey === "string" ? userApiKey : undefined);

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

      let response: any = null;
      let lastError: any = null;

      for (const model of MODEL_CANDIDATES) {
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            response = await activeAi.models.generateContent({
              model,
              contents,
              config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.75,
              },
            });
            break;
          } catch (error: any) {
            lastError = error;

            if (isAuthError(error) || isQuotaExceededError(error)) {
              throw error;
            }

            if (attempt < 2 && isTransientCapacityError(error)) {
              await sleep(450 * attempt);
              continue;
            }

            break;
          }
        }

        if (response) break;
      }

      if (!response && lastError) {
        throw lastError;
      }

      const reply = response.text || "Remain in silent awareness. The mind is currently empty.";
      res.json({ text: reply });
    } catch (error: any) {
      console.error("Gemini Spiritual Guidance Error:", error);

      if (isAuthError(error)) {
        return res.status(401).json({
          error:
            "Authentication failed for the provided Gemini key. Please verify your key in Celestial Key settings or generate a new one from AI Studio.",
        });
      }

      if (isQuotaExceededError(error)) {
        return res.status(429).json({
          error:
            "This key has reached its current quota or rate limit window. Please wait a bit, enable billing/quota in AI Studio, or use another key.",
        });
      }

      if (isTransientCapacityError(error)) {
        return res.status(503).json({
          error:
            "Guidance models are under heavy demand right now. Please try again in about 20-40 seconds.",
        });
      }

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
