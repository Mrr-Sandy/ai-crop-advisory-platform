import { Link } from "react-router-dom";

import Footer from "../components/Footer";
import MonthBand from "../components/MonthBand";
import Navbar from "../components/Navbar";
import { SEASON_PHOTOS } from "../lib/seasonPhotos";
import { SEASONS, today } from "../lib/seasons";

const facts = [
  ["Season", "Kharif, Rabi or Zaid: when the crop goes in, and which rains it lives through."],
  ["Soil", "Clay, loam or sandy loam: how the field holds water and feeds the roots."],
  ["Water", "High, medium or low: how much the crop asks for between rains."],
];

const items = [
  {
    title: "Built for agricultural users",
    text: "Farmers, agriculture officers, students, and researchers can review crop requirements in a clear interface.",
  },
  {
    title: "Your own crop records",
    text: "Each record you add is saved to your account and laid across the farming year on the dashboard.",
  },
  {
    title: "Answers in five parts",
    text: "Every reply from the advisor names the likely cause, what to do now, what to watch for, when to call an expert, and a recommendation.",
  },
];

function About() {
  const now = today();
  const photo = SEASON_PHOTOS[now.season.key];

  return (
    <>
      <Navbar overlay />

      <main>
        <section className="stage min-h-[86dvh]" aria-labelledby="about-title">
          <figure className="stage__photo" data-slot="about" data-alt={`Your own ${now.season.label} field, wide`}>
            <img
              src={`${photo.base}/1920px-${photo.file}`}
              srcSet={`${photo.base}/1280px-${photo.file} 1280w, ${photo.base}/1920px-${photo.file} 1920w`}
              sizes="100vw"
              width={photo.width}
              height={photo.height}
              alt={photo.alt}
              fetchPriority="high"
              style={{ objectPosition: photo.position }}
            />
          </figure>
          <div className="stage__shade" aria-hidden="true" />
          <div className="shell stage__grid">
            <h1 id="about-title" className="stage__title text-[clamp(3.5rem,8vw,7.5rem)]!">
              <span>An advisor that</span>
              <span>knows the month.</span>
            </h1>
            <div className="stage__copy">
              <p className="stage__lead serif">
                AI Crop Advisory Platform helps users understand crop season, soil, and water requirements, then ask what to do next.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/ai-assistant" className="key key--primary">
                  Explore AI Advisory
                </Link>
                <Link to="/register" className="key key--on-field">
                  Create an account
                </Link>
              </div>
              <p className="stage__caption">{photo.caption}</p>
            </div>
          </div>
        </section>

        <section className="night py-32" aria-labelledby="facts-title">
          <div className="shell grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div className="min-w-0">
              <h2 id="facts-title">Three facts behind every answer.</h2>
              <p className="serif on-night-muted mt-6 text-[clamp(1.25rem,1.6vw,1.5rem)] leading-snug">
                {now.name}: {now.line}. The band below is the farming year from the monsoon.
              </p>
              <MonthBand current={now.month} className="mt-8" />
              <ul className="mt-6 list-none p-0 text-sm text-[var(--color-on-night-muted)]">
                {SEASONS.map((season) => (
                  <li key={season.key} className="flex items-center gap-3 border-t border-[var(--color-night-rule)] py-2">
                    <span className="swatch" style={{ background: `var(--color-${season.key})` }} aria-hidden="true" />
                    <span className="text-[var(--color-on-night)]">{season.label}</span>
                    <span className="ml-auto">{season.window}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-[var(--color-on-night-muted)]">Typical windows; they shift by region and with the rains.</p>
            </div>
            <dl className="m-0 grid content-start">
              {facts.map(([term, text]) => (
                <div key={term} className="facts-row grid gap-2 py-8 sm:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] sm:gap-8">
                  <dt className="font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-none">{term}</dt>
                  <dd className="on-muted m-0 self-end text-lg">{text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="py-32" aria-labelledby="platform-title">
          <div className="shell">
            <h2 id="platform-title" className="sr-only">
              About the platform
            </h2>
            <ul className="m-0 list-none border-b border-ink p-0">
              {items.map((item) => (
                <li key={item.title} className="grid gap-4 border-t border-ink py-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
                  <h3 className="text-section">{item.title}</h3>
                  <p className="lead text-muted">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default About;
