import { useRef } from "react";
import { Link } from "react-router-dom";

import MonthBand from "./MonthBand";
import SoilPlant from "./SoilPlant";
import { askLink, distinctCrops, questionFor, titleCase } from "../lib/crops";
import { SEASON_PHOTOS as HERO } from "../lib/seasonPhotos";
import { seasonOf, today } from "../lib/seasons";



function asked(crop) {
  return questionFor({ ...crop, name: titleCase(crop.name), season: titleCase(crop.season), soil: titleCase(crop.soil) });
}

function Hero({ crops = [], isLoading = false }) {
  const now = today();
  const stageRef = useRef(null);
  const photo = HERO[now.season.key];
  const inSeason = distinctCrops(crops).filter((crop) => seasonOf(crop.season)?.key === now.season.key);

  return (
    <section ref={stageRef} className="stage" aria-labelledby="hero-title">
      <figure className="stage__photo" data-slot="hero" data-alt={`Your own ${now.season.label} field, wide`}>
        <img
          src={`${photo.base}/1920px-${photo.file}`}
          srcSet={`${photo.base}/1280px-${photo.file} 1280w, ${photo.base}/1920px-${photo.file} 1920w, ${photo.base}/2560px-${photo.file} 2560w`}
          sizes="100vw"
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          fetchPriority="high"
          style={{ objectPosition: photo.position }}
        />
      </figure>
      <div className="stage__shade" aria-hidden="true" />
      <SoilPlant month={now.month} pointerTarget={stageRef} />

      <div className="shell stage__grid">
        <h1 id="hero-title" className="stage__title">
          <span>Ask before</span>
          <span>you sow.</span>
        </h1>

        <div className="stage__copy">
          <p className="stage__lead serif">Crop advice in five parts: cause, action, risk, expert, next step.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/ai-assistant" className="key key--primary">
              Explore AI Advisory
            </Link>
            <Link to="/about" className="key key--on-field">
              Discover the Platform
            </Link>
          </div>
          <p className="stage__caption">
            <span className="only-3d">Behind: </span>
            {photo.caption}
            <span className="only-3d"> In front: the same crop as it stands in {now.name}.</span>
          </p>
        </div>
      </div>

      <aside className="almanac" aria-labelledby="now-title">
        <div className="shell almanac__grid">
          <div className="almanac__now">
            <p className="text-sm text-[var(--color-on-night-muted)]">In the fields this month</p>
            <h2 id="now-title" className="mt-1">
              {now.name}: {now.line}
            </h2>
          <div className="almanac__crops mt-4">
            <p className="text-sm text-[var(--color-on-night-muted)]">Your {now.season.label} records</p>
            {isLoading ? (
              <p className="mt-2 text-sm">Loading crops from the backend…</p>
            ) : inSeason.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {inSeason.slice(0, 4).map((crop) => (
                  <Link key={crop._id || crop.id || crop.name} to={askLink(asked(crop))} className="cropchip cropchip--night">
                    Ask about {titleCase(crop.name)}, {String(crop.soil || "").toLowerCase()} soil
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm">
                No {now.season.label} crops yet. <Link className="link" to="/dashboard">Add one</Link>
              </p>
            )}
          </div>
          </div>
          <div className="almanac__band">
            <MonthBand current={now.month} />
            <p className="mt-2 text-xs text-[var(--color-on-night-muted)]">Typical windows; they shift by region and with the rains.</p>
          </div>
        </div>
      </aside>
    </section>
  );
}

export default Hero;
