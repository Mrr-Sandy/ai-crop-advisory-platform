import { Code2, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

const PHOTO_CREDITS = [
  {
    href: "https://commons.wikimedia.org/wiki/File:Woman_harvesting_wheat,_Raisen_district,_Madhya_Pradesh,_India_ggia_version.jpg",
    name: "Yann Forget",
    license: "CC BY-SA 3.0",
  },
  {
    href: "https://commons.wikimedia.org/wiki/File:Water_reflection_of_a_boy_feeding_hay_to_a_cow_in_a_paddy_field_at_golden_hour_in_Laos.jpg",
    name: "Basile Morin",
    license: "CC BY-SA 4.0",
  },
  {
    href: "https://commons.wikimedia.org/wiki/File:Monteregie_farmland_aerial_1_2025.jpg",
    name: "Hayden Soloviev",
    license: "CC BY 4.0",
  },
  {
    href: "https://commons.wikimedia.org/wiki/File:Po_River_Delta_aerial_2.jpg",
    name: "kallerna",
    license: "CC BY-SA 4.0",
  },
  {
    href: "https://commons.wikimedia.org/wiki/File:Wheat_and_chamomille,_Kalkense_Meersen,_Wetteren,_2026.jpg",
    name: "DimiTalen",
    license: "CC0",
  },
];

function Footer({ compact = false }) {
  if (compact) {
    return (
      <footer className="border-t border-rule">
        <div className="shell flex flex-col gap-3 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2">
            <Leaf className="h-4 w-4 shrink-0 text-ink" aria-hidden="true" />
            2026 AI Crop Advisory Platform. Built for practical crop decisions.
          </p>
          <a href="https://github.com" className="link inline-flex items-center gap-2">
            <Code2 className="h-4 w-4" aria-hidden="true" />
            Project repository
          </a>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-ink">
      <div className="shell grid gap-12 pt-20 pb-10">
        <div className="grid gap-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-end">
          <div className="grid gap-3">
            <p className="wordmark text-3xl leading-none text-ink">AI Crop Advisory</p>
            <p className="max-w-[40ch] text-muted">Crop records by season, soil and water, and an advisor that answers in five parts.</p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <Link to="/ai-assistant" className="link">AI Assistant</Link>
            <Link to="/dashboard" className="link">Dashboard</Link>
            <Link to="/about" className="link">About</Link>
            <a href="https://github.com" className="link inline-flex items-center gap-2">
              <Code2 className="h-4 w-4" aria-hidden="true" />
              Project repository
            </a>
          </nav>
        </div>
        <div className="grid gap-2 border-t border-rule pt-6 text-sm text-muted">
          <p>2026 AI Crop Advisory Platform. Built for practical crop decisions.</p>
          <p data-credits>
            Photographs:{" "}
            {PHOTO_CREDITS.map((credit, index) => (
              <span key={credit.href}>
                {index ? ", " : ""}
                <a href={credit.href} className="underline underline-offset-2">{credit.name}</a> ({credit.license}, Wikimedia Commons)
              </span>
            ))}
            .
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
