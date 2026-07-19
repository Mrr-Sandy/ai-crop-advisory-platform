const GEMINI_MODEL = "gemini-flash-latest";

let aiClientPromise;

function extractGeneratedText(response) {
  const candidateParts = response?.candidates
    ?.flatMap((candidate) => candidate?.content?.parts || [])
    .map((part) => part?.text || "")
    .join("")
    .trim();

  if (candidateParts) {
    return candidateParts;
  }

  const outputParts = response?.output?.candidates
    ?.flatMap((candidate) => candidate?.content?.parts || [])
    .map((part) => part?.text || "")
    .join("")
    .trim();

  if (outputParts) {
    return outputParts;
  }

  return "";
}

async function getAiClient() {
  if (!aiClientPromise) {
    aiClientPromise = import("@google/genai").then(({ GoogleGenAI }) => {
      return new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });
    });
  }

  return aiClientPromise;
}

async function chatWithAi(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        message: "Gemini API key is not configured",
      });
    }

    const prompt = String(
      req.body?.message || req.body?.prompt || req.body?.question || ""
    ).trim();

    if (!prompt) {
      return res.status(400).json({
        message: "A farming question is required",
      });
    }

    const ai = await getAiClient();
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      systemInstruction:
        "You are an experienced agricultural expert. Respond with exactly 5 bullet points. Each bullet point must be 20-30 words and must include practical farmer-friendly advice. Bullet 1: likely cause or diagnosis. Bullet 2: immediate actions. Bullet 3: precautions and risks to avoid. Bullet 4: when professional agricultural help or a local extension officer is recommended. Bullet 5: closing recommendation. If details are missing, still provide the best probable advice instead of asking only for more information. Keep the full answer between 180 and 250 words. Return plain text only.",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        temperature: 0.4,
        maxOutputTokens: 1024,
        thinkingConfig: {
          includeThoughts: false,
          thinkingBudget: 0,
        },
      },
    });

    const answer = extractGeneratedText(response);

    if (!answer) {
      return res.status(502).json({
        message: "Gemini returned an empty response",
      });
    }

    return res.status(200).json({
      reply: answer,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "AI request failed",
    });
  }
}

module.exports = {
  chatWithAi,
};