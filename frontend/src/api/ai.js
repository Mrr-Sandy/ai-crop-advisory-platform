const AI_API_URL = "/api/ai";

async function parseAiResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "AI request failed");
  }

  return data;
}

export async function sendAiQuestion(question) {
  const response = await fetch(`${AI_API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: question }),
  });

  return parseAiResponse(response);
}