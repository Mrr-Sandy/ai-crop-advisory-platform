import { useRef, useState } from "react";
import { Link } from "react-router-dom";

import MonthBand from "./MonthBand";
import { askLink, distinctCrops, questionFor, titleCase } from "../lib/crops";
import { SEASONS, seasonOf, today } from "../lib/seasons";

const PHOTOS = {
  kharif: {
    base: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Water_reflection_of_a_boy_feeding_hay_to_a_cow_in_a_paddy_field_at_golden_hour_in_Laos.jpg",
    file: "Water_reflection_of_a_boy_feeding_hay_to_a_cow_in_a_paddy_field_at_golden_hour_in_Laos.jpg",
    alt: "A boy feeds hay to a cow standing in a flooded paddy field",
    position: "62% 40%",
    caption: "A flooded paddy: the monsoon field Kharif rice grows in.",
  },
  rabi: {
    base: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Wheat_and_chamomille%2C_Kalkense_Meersen%2C_Wetteren%2C_2026.jpg",
    file: "Wheat_and_chamomille%2C_Kalkense_Meersen%2C_Wetteren%2C_2026.jpg",
    alt: "Green wheat ears against a blue sky",
    position: "50% 60%",
    caption: "Wheat in ear: the Rabi crop grows through the dry winter months.",
  },
};

function asked(crop) {
  return questionFor({ ...crop, name: titleCase(crop.name), season: titleCase(crop.season), soil: titleCase(crop.soil) });
}

function SeasonShowcase({ crops = [], isLoading = false, error = "" }) {
  const now = today();
  const [active, setActive] = useState(now.season.key);
  const tabRefs = useRef({});

  const unique = distinctCrops(crops);
  const bySeason = Object.fromEntries(SEASONS.map((s) => [s.key, unique.filter((c) => seasonOf(c.season)?.key === s.key)]));
  const season = SEASONS.find((s) => s.key === active);
  const list = bySeason[active];
  const photo = PHOTOS[active];

  function onKey(event, index) {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = SEASONS[(index + step + SEASONS.length) % SEASONS.length].key;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <div className="seasontabs" role="tablist" aria-label="Cropping seasons">
        {SEASONS.map((s, index) => (
          <button
            key={s.key}
            ref={(el) => (tabRefs.current[s.key] = el)}
            type="button"
            role="tab"
            id={`tab-${s.key}`}
            aria-selected={active === s.key}
            aria-controls={`panel-${s.key}`}
            tabIndex={active === s.key ? 0 : -1}
            className="seasontab"
            style={{ "--tab-color": `var(--color-${s.key})` }}
            onClick={() => {
              setActive(s.key);
            }}
            onKeyDown={(event) => onKey(event, index)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="seasonpanel mt-12" role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`}>
        {photo ? (
          <figure className="m-0 min-w-0">
            <div className="seasonpanel__photo reveal-photo" data-slot={`season-${active}`} data-alt={`One of your own ${season.label} fields`}>
              <img
                key={active}
                src={`${photo.base}/1280px-${photo.file}`}
                srcSet={`${photo.base}/960px-${photo.file} 960w, ${photo.base}/1280px-${photo.file} 1280w, ${photo.base}/1920px-${photo.file} 1920w`}
                sizes="(min-width: 60rem) 40vw, 100vw"
                width="1280"
                height="900"
                alt={photo.alt}
                loading="lazy"
                style={{ objectPosition: photo.position }}
              />
            </div>
            <figcaption className="caption on-night-muted">{photo.caption}</figcaption>
          </figure>
        ) : (
          <div className="seasonpanel__type">
            <p className="serif text-[clamp(2.5rem,5vw,4.5rem)] leading-none">{season.window}</p>
            <p className="on-night-muted mt-4 max-w-[34ch]">The shortest season, grown on the summer heat and whatever water is stored.</p>
          </div>
        )}

        <div className="min-w-0">
          <p className="serif text-[clamp(2rem,3.4vw,3rem)] leading-[1.05]">{season.window}</p>
          <p className="on-night-muted mt-4 max-w-[46ch] text-lg">{season.note}</p>
          <MonthBand current={now.month} focus={active} className="mt-8" />

          <div className="mt-10">
            <p className="text-sm font-medium text-[var(--color-on-night-muted)]">
              Your {season.label} crops{list && !isLoading ? `, ${list.length}` : ""}
            </p>
            {isLoading ? (
              <p className="on-night-muted mt-3">Loading crops from the backend…</p>
            ) : error ? (
              <p className="mt-3" role="alert">{error}</p>
            ) : list.length ? (
              <ul className="mt-3 list-none border-b border-[var(--color-night-rule)] p-0">
                {list.map((crop) => (
                  <li key={crop._id || crop.id || crop.name} className="grid grid-cols-[minmax(0,4fr)_minmax(0,5fr)_auto] items-baseline gap-4 border-t border-[var(--color-night-rule)] py-4">
                    <span className="cropline__name">{titleCase(crop.name)}</span>
                    <span className="text-[var(--color-on-night-muted)]">
                      {titleCase(crop.soil)} soil, {String(crop.water || "").toLowerCase()} water
                    </span>
                    <Link className="link text-sm" to={askLink(asked(crop))}>
                      Ask
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="on-night-muted mt-3">
                No {season.label} crops in your records yet.{" "}
                <Link className="link" to="/dashboard">Add one</Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeasonShowcase;
