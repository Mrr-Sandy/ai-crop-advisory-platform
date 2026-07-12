const AUTH_API_URL = "/api/auth";
const API_ORIGIN = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function parseAuthResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Authentication request failed");
  }

  return data;
}

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  localStorage.setItem("token", token);
  window.dispatchEvent(new Event("auth-change"));
}

export function clearToken() {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("auth-change"));
}

export async function registerUser(payload) {
  const response = await fetch(`${AUTH_API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseAuthResponse(response);
}

export async function loginUser(payload) {
  const response = await fetch(`${AUTH_API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseAuthResponse(response);
}

export async function getProfile({ signal } = {}) {
  const token = getToken();

  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch(`${AUTH_API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return parseAuthResponse(response);
}

export function getGoogleLoginUrl() {
  return `${API_ORIGIN.replace(/\/$/, "")}/api/auth/google`;
}
