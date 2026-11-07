// Helpers shared by the home page, the dashboard and the assistant. They only read
// fields the crop API already returns: name, season, soil, water.

export function questionFor(crop) {
  const season = crop.season ? ` during ${crop.season} season` : "";
  const soil = crop.soil ? ` in ${crop.soil} soil` : "";
  return `What practical advice should I follow for ${crop.name}${season}${soil}?`;
}

export function shortQuestion(crop) {
  const parts = [titleCase(crop.season), crop.soil ? `${String(crop.soil).toLowerCase()} soil` : ""].filter(Boolean);
  return `Advice for ${titleCase(crop.name)}${parts.length ? `, ${parts.join(", ")}` : ""}`;
}

// One crop per distinct name, season, soil and water, so duplicate records show once.
export function distinctCrops(crops) {
  const seen = new Set();
  return crops.filter((crop) => {
    const key = [crop?.name, crop?.season, crop?.soil, crop?.water].map((v) => titleCase(v).toLowerCase()).join("|");
    if (!crop?.name || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function askLink(question) {
  return `/ai-assistant?q=${encodeURIComponent(question)}`;
}

// "Ravi" is a common transliteration of the Rabi season; show one spelling.
const SPELLING = { ravi: "Rabi" };

function titleCase(value) {
  const text = String(value || "").trim();
  if (SPELLING[text.toLowerCase()]) return SPELLING[text.toLowerCase()];
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

// Groups by a field case-insensitively, keeping the first spelling seen, largest group first.
export function countBy(crops, field) {
  const groups = new Map();
  for (const crop of crops) {
    const raw = String(crop?.[field] || "").trim();
    if (!raw) continue;
    const key = titleCase(raw).toLowerCase();
    const group = groups.get(key) || { label: titleCase(raw), items: [] };
    group.items.push(crop);
    groups.set(key, group);
  }
  return Array.from(groups.values()).sort((a, b) => b.items.length - a.items.length || a.label.localeCompare(b.label));
}

export { titleCase };
