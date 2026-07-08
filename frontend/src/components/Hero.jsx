import { ArrowRight, BarChart3, Database, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
        <div>
          <p className="inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-medium text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
            AI-powered crop records and advisory workflows
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl dark:text-white">
            AI Crop Advisory Platform
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
            A clean SaaS workspace for browsing crop information, managing crop
            records, and turning agricultural data into better field decisions.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/dashboard"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
            >
              Open dashboard
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/about"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Learn more
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-4">
            {[
              {
                icon: Database,
                title: "Real crop records",
                text: "The interface reads from the existing Express and MongoDB crop API.",
              },
              {
                icon: BarChart3,
                title: "Operational summaries",
                text: "Dashboard metrics are derived from live crop responses.",
              },
              {
                icon: ShieldCheck,
                title: "Backend-safe UI",
                text: "Routes, methods, response shapes, and database logic remain untouched.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                >
                  <Icon className="h-5 w-5 text-green-700" aria-hidden="true" />
                  <h2 className="mt-3 text-base font-semibold text-slate-950 dark:text-white">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
