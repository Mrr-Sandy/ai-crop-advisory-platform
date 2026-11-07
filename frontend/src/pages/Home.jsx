import { AlertTriangle, Microscope, Phone, Sprout, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import SeasonShowcase from "../components/SeasonShowcase";
import { getCrops } from "../api/crops";
import { countBy, distinctCrops } from "../lib/crops";
import { today } from "../lib/seasons";

const RIVER = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Po_River_Delta_aerial_2.jpg";
const RIVER_FILE = "Po_River_Delta_aerial_2.jpg";
// The closing photograph never repeats the open season panel (Rabi shows the wheat ears).
const CLOSE = {
  ears: { base: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Wheat_and_chamomille%2C_Kalkense_Meersen%2C_Wetteren%2C_2026.jpg", file: "Wheat_and_chamomille%2C_Kalkense_Meersen%2C_Wetteren%2C_2026.jpg", width: 5568, height: 3712 },
  fields: { base: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Monteregie_farmland_aerial_1_2025.jpg", file: "Monteregie_farmland_aerial_1_2025.jpg", width: 4000, height: 3000 },
};

// An example built from the project's own prompt notes (PROMPTS.md), set the way the advisor answers.
const example = [
  [Microscope, "Likely cause", "Constant rain keeps leaves wet and soil waterlogged, which is when pests and fungus spread fastest."],
  [Zap, "Act now", "Remove affected leaves and improve field drainage so water does not stand around the plants."],
  [AlertTriangle, "Watch for", "Inspect plants every day; damage moves quickly between wet, crowded rows."],
  [Phone, "Call an expert", "If you cannot name the pest, ask your local extension officer which crop and pest are involved."],
  [Sprout, "Recommendation", "Use traps or approved controls only once you know what you are treating."],
];

function useReveal() {
  useEffect(() => {
    document.documentElement.classList.add("js");
    const items = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }),
      { rootMargin: "0px 0px -10% 0px" }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Home() {
  const [crops, setCrops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCrops() {
      try {
        setIsLoading(true);
        setError("");
        const data = await getCrops({ signal: controller.signal });
        setCrops(data);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        setError(
          "Unable to load crops. Please make sure the backend server is running."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchCrops();

    return () => controller.abort();
  }, []);

  useReveal();

  const unique = useMemo(() => distinctCrops(crops), [crops]);
  const water = useMemo(() => countBy(unique, "water"), [unique]);
  const lead = water[0];
  const close = today().season.key === "rabi" ? CLOSE.fields : CLOSE.ears;

  return (
    <>
      <Navbar overlay />
      <Hero crops={crops} isLoading={isLoading} />

      <main>
        {/* The farming year */}
        <section className="night pt-48 pb-36 max-lg:pt-24" aria-labelledby="year-title">
          <div className="shell">
            <div className="mb-16 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end">
              <h2 id="year-title" className="rise-type max-w-[16ch]">Three seasons decide what grows.</h2>
              <p className="serif on-night-muted text-[clamp(1.25rem,1.6vw,1.5rem)] leading-snug">
                Pick a season to see when it runs and which of your crops belong to it.
              </p>
            </div>
            <SeasonShowcase crops={crops} isLoading={isLoading} error={error} />
          </div>
        </section>

        {/* The advisory demonstration */}
        <section className="py-36" aria-labelledby="demo-title">
          <div className="shell demo">
            <div className="demo__ask">
              <h2 id="demo-title" className="rise-type">One question, five answers.</h2>
              <p className="mt-8 text-sm font-medium text-ink-2">Example question</p>
              <p className="demo__q serif mt-3">“How do I reduce pest damage in a rainy season vegetable crop?”</p>
              <div className="mt-10">
                <Link to="/ai-assistant" className="key key--ink">
                  Ask your own
                </Link>
              </div>
            </div>
            <ol className="m-0 list-none p-0" aria-label="Example answer in five parts">
              {example.map(([Icon, label, text], index) => (
                <li key={label} className={`part ${index === example.length - 1 ? "part--last" : ""}`} data-reveal style={{ "--i": index }}>
                  <span className="part__icon" aria-hidden="true">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="part__label">{label}</p>
                    <p className="mt-2 max-w-[52ch] text-lg text-ink-2">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Water, cut on the bias */}
        <section className="bias" aria-labelledby="water-title">
          <figure className="bias__photo" data-slot="water" data-alt="Water reaching your own fields: a canal, a channel or flooded rows">
            <img
              src={`${RIVER}/1920px-${RIVER_FILE}`}
              srcSet={`${RIVER}/1280px-${RIVER_FILE} 1280w, ${RIVER}/1920px-${RIVER_FILE} 1920w`}
              sizes="100vw"
              width="5590"
              height="3968"
              alt=""
              loading="lazy"
            />
          </figure>
          <div className="shell">
            <h2 id="water-title" className="bigword">Water</h2>
          </div>
          <div className="shell mt-10 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end">
            <div className="min-w-0">
              <p className="serif on-night-muted max-w-[30ch] text-[clamp(1.375rem,2vw,1.875rem)] leading-snug">
                High, medium or low: how much a crop asks for between the rains.
              </p>
            </div>
            {!isLoading && !error && lead ? (
              <div className="min-w-0 border-t border-[var(--color-night-rule)] pt-6">
                <p className="figure-xl">
                  {lead.items.length}
                  <span className="on-night-muted ml-3 align-baseline text-[0.36em] tracking-normal">of {unique.length}</span>
                </p>
                <p className="mt-3 text-lg">
                  crops in your records need {lead.label.toLowerCase()} water.
                </p>
                {water.length > 1 ? (
                  <ul className="mt-6 list-none p-0 text-[var(--color-on-night-muted)]">
                    {water.slice(1).map((group) => (
                      <li key={group.label} className="tnum border-t border-[var(--color-night-rule)] py-2">
                        {group.items.length} need {group.label.toLowerCase()} water
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>

        {/* The product, layered */}
        <section className="bg-paper-3 py-36" aria-labelledby="product-title">
          <div className="shell">
            <div className="mb-16 grid gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:items-end">
              <h2 id="product-title" className="rise-type max-w-[14ch]">The farming year, on one screen.</h2>
              <p className="lead text-muted">
                The dashboard lays your crops across the farming year; the advisor answers with your records beside it.
              </p>
            </div>
            <div className="preview">
              <figure className="shot shot--back reveal-photo" data-kind="product">
                <img src="/screens/dashboard.png" width="1440" height="900" alt="The dashboard: a season calendar of crop records, soil and water panels, and the records ledger" loading="lazy" />
              </figure>
              <figure className="shot shot--front" data-kind="product">
                <img src="/screens/assistant.png" width="1440" height="900" alt="The AI assistant answering a question in five labelled parts, with the crop's facts beside it" loading="lazy" />
              </figure>
            </div>
          </div>
        </section>

        {/* The last call */}
        <section className="finale" aria-labelledby="finale-title">
          <figure className="finale__photo" data-slot="finale" data-alt="A crop of your own close up, in ear or in flower">
            <img
              src={`${close.base}/1920px-${close.file}`}
              srcSet={`${close.base}/1280px-${close.file} 1280w, ${close.base}/1920px-${close.file} 1920w`}
              sizes="100vw"
              width={close.width}
              height={close.height}
              alt=""
              loading="lazy"
            />
          </figure>
          <div className="shell grid gap-10 pb-24 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:items-end">
            <h2 id="finale-title" className="rise-type text-[clamp(4rem,10vw,9rem)] leading-[0.88] tracking-[-0.04em] max-w-none text-[var(--color-on-night)]">Bring one crop.</h2>
            <div className="grid gap-3 lg:justify-items-end">
              <Link to="/ai-assistant" className="key key--primary">
                Explore AI Advisory
              </Link>
              <Link to="/register" className="key key--on-field">
                Create an account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;
