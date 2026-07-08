import { Database, ShieldCheck, Users } from "lucide-react";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function About() {
  const items = [
    {
      icon: Users,
      title: "Built for agricultural users",
      text: "Farmers, agriculture officers, students, and researchers can review crop requirements in a clear interface.",
    },
    {
      icon: Database,
      title: "Real backend data",
      text: "Crop information is loaded from the existing Express API backed by MongoDB Atlas.",
    },
    {
      icon: ShieldCheck,
      title: "Backend-safe frontend",
      text: "The UI improves presentation while preserving API URLs, request methods, and response structures.",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 dark:bg-slate-950">
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-normal text-green-700 dark:text-green-300">
              About the platform
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">
              Practical crop intelligence with a production SaaS interface.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              AI Crop Advisory Platform helps users understand crop season,
              soil, and water requirements through a clean frontend connected
              to the completed backend.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <Icon className="h-5 w-5 text-green-700" aria-hidden="true" />
                  <h2 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default About;
