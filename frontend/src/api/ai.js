import { getToken } from "./auth";

const AI_API_URL = "/api/ai";

async function parseAiResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "AI request failed");
  }

  return data;
}

export async function sendAiQuestion(question) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${AI_API_URL}/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({ message: question }),
  });

  return parseAiResponse(response);
}
