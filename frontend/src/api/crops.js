const CROPS_API_URL = "/api/crops";

async function parseResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Crop request failed");
  }

  return data;
}

export async function getCrops({ signal } = {}) {
  const response = await fetch(CROPS_API_URL, { signal });
  const data = await parseResponse(response);
  return Array.isArray(data) ? data : [];
}

export async function searchCrops(name, { signal } = {}) {
  const params = new URLSearchParams({ name });
  const response = await fetch(`${CROPS_API_URL}/search?${params.toString()}`, {
    signal,
  });
  const data = await parseResponse(response);
  return Array.isArray(data) ? data : [];
}

export async function createCrop(payload) {
  const response = await fetch(CROPS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function updateCrop(id, payload) {
  const response = await fetch(`${CROPS_API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function deleteCrop(id) {
  const response = await fetch(`${CROPS_API_URL}/${id}`, {
    method: "DELETE",
  });

  return parseResponse(response);
}
