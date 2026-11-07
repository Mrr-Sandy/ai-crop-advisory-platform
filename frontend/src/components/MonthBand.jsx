import { MONTH, YEAR, seasonForMonth } from "../lib/seasons";

// Twelve months from the monsoon, each tinted by its typical season, the current one marked.
function MonthBand({ current, focus, tone = "night", className = "" }) {
  return (
    <ol className={`monthband monthband--${tone} ${className}`} aria-label="Typical seasons by month, June to May">
      {YEAR.map((month) => {
        const season = seasonForMonth(month);
        const isNow = month === current;
        const dim = focus && focus !== season.key;
        return (
          <li
            key={month}
            className={`monthband__cell ${isNow ? "is-now" : ""} ${dim ? "is-dim" : ""}`}
            aria-current={isNow ? "date" : undefined}
            aria-label={`${MONTH[month]}, ${season.label}${isNow ? ", this month" : ""}`}
          >
            <span className={`monthband__bar monthband__bar--${season.key}`} aria-hidden="true" />
            <span className="monthband__label">{MONTH[month]}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default MonthBand;
