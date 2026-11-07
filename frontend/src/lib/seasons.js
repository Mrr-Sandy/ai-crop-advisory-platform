// Typical cropping windows in India. They shift by region and with the rains;
// the page says so wherever it shows them.
export const SEASONS = [
  {
    key: "kharif",
    label: "Kharif",
    months: [6, 7, 8, 9, 10],
    window: "June to October",
    note: "Sown with the monsoon in June and July, harvested in September and October.",
  },
  {
    key: "rabi",
    label: "Rabi",
    months: [11, 12, 1, 2, 3],
    window: "October to April",
    note: "Sown after the rains, from October to December, harvested in March and April.",
  },
  {
    key: "zaid",
    label: "Zaid",
    months: [4, 5],
    window: "March to June",
    note: "The short summer crop between the Rabi harvest and the Kharif rains.",
  },
];

// The farming year runs from the monsoon: June first.
export const YEAR = [6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5];
export const MONTH = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_LONG = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const NOW = {
  1: "Rabi crops are growing",
  2: "Rabi crops are growing",
  3: "Rabi harvest begins, Zaid sowing starts",
  4: "Rabi harvest and Zaid crops",
  5: "Zaid crops, fields readied for the rains",
  6: "Kharif sowing begins with the monsoon",
  7: "Kharif sowing",
  8: "Kharif crops are growing",
  9: "Kharif harvest begins",
  10: "Kharif harvest, Rabi sowing begins",
  11: "Rabi sowing",
  12: "Rabi sowing ends",
};

const ALIASES = { kharif: "kharif", rabi: "rabi", ravi: "rabi", zaid: "zaid", zayed: "zaid", summer: "zaid" };

export function seasonOf(value) {
  const key = ALIASES[String(value || "").trim().toLowerCase()];
  return SEASONS.find((season) => season.key === key) || null;
}

export function seasonForMonth(month) {
  return SEASONS.find((season) => season.months.includes(month)) || SEASONS[0];
}

export function today(date = new Date()) {
  const month = date.getMonth() + 1;
  return { month, name: MONTH_LONG[month], season: seasonForMonth(month), line: NOW[month] };
}
