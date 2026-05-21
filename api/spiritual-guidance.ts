import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const { messages, userApiKey } = req.body;
    const parsedUserApiKey =
      (req.headers["x-user-api-key"] as string) || userApiKey;

    const resolvedKey = parsedUserApiKey || process.env.GEMINI_API_KEY;

    if (!resolvedKey) {
      return res.status(500).json({
        error:
          "Spiritual connection not configured. Please add your Gemini API key under 'Akashic Companion Key Config' or configure a server key.",
      });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = new GoogleGenAI({
      apiKey: resolvedKey,
      httpOptions: {
        headers: {
          "User-Agent": parsedUserApiKey
            ? "aistudio-build-user"
            : "aistudio-build",
        },
      },
    });

    const contents = messages.map((m: any) => ({
      role: m.role === "model" || m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.75,
      },
    });

    const reply =
      response.text ||
      "Remain in silent awareness. The mind is currently empty.";
    res.json({ text: reply });
  } catch (error: any) {
    console.error("Gemini Spiritual Guidance Error:", error);
    res.status(500).json({
      error:
        error.message ||
        "An error occurred while seeking guidance from the Cosmos.",
    });
  }
}
