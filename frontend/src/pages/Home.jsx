import { useEffect, useState } from "react";

import Card from "../components/Card";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import { Loader } from "../components/ui";
import { getCrops } from "../api/crops";

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

  return (
    <>
      <Navbar />
      <Hero />

      <main className="bg-white dark:bg-slate-950">
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-green-700 dark:text-green-300">
                Crop directory
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                Records from the crop API
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Each card displays real fields returned by the existing backend:
              name, season, soil, and water requirement.
            </p>
          </div>

          {isLoading && <Loader text="Loading crops from the backend..." />}

          {!isLoading && error && (
            <div
              className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
              role="alert"
            >
              {error}
            </div>
          )}

          {!isLoading && !error && crops.length === 0 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              No crop records were returned by the backend.
            </div>
          )}

          {!isLoading && !error && crops.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {crops.map((crop) => (
                <Card
                  key={crop._id || crop.id || crop.name}
                  name={crop.name}
                  season={crop.season}
                  soil={crop.soil}
                  water={crop.water}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;
