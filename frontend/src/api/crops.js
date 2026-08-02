import { getToken } from "./auth";

const API_ORIGIN = import.meta.env.VITE_API_URL;

if (!API_ORIGIN) {
  throw new Error("VITE_API_URL is not configured");
}

const CROPS_API_URL = `${API_ORIGIN.replace(/\/$/, "")}/api/crops`;

function getAuthHeaders(extraHeaders = {}) {
  const token = getToken();

  if (!token) {
    return extraHeaders;
  }

  return {
    ...extraHeaders,
    Authorization: `Bearer ${token}`,
  };
}

async function parseResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Crop request failed");
  }

  return data;
}

export async function getCrops({ signal } = {}) {
  const response = await fetch(CROPS_API_URL, {
    headers: getAuthHeaders(),
    signal,
  });

  const data = await parseResponse(response);
  return Array.isArray(data) ? data : [];
}

export async function searchCrops(name, { signal } = {}) {
  const params = new URLSearchParams({ name });

  const response = await fetch(
    `${CROPS_API_URL}/search?${params.toString()}`,
    {
      headers: getAuthHeaders(),
      signal,
    }
  );

  const data = await parseResponse(response);
  return Array.isArray(data) ? data : [];
}

export async function createCrop(payload) {
  const response = await fetch(CROPS_API_URL, {
    method: "POST",
    headers: getAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function updateCrop(id, payload) {
  const response = await fetch(`${CROPS_API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function deleteCrop(id) {
  const response = await fetch(`${CROPS_API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return parseResponse(response);
}