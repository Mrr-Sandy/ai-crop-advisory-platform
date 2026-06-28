import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Footer from "../components/Footer";

const CROPS_API_URL = "http://localhost:5000/api/crops";

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

        const response = await fetch(CROPS_API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch crops");
        }

        const data = await response.json();
        setCrops(Array.isArray(data) ? data : []);
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

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {isLoading && (
          <p className="rounded-lg bg-white p-6 text-center text-gray-600 shadow-md dark:bg-gray-800 dark:text-gray-300">
            Loading crops...
          </p>
        )}

        {!isLoading && error && (
          <p className="rounded-lg bg-white p-6 text-center text-red-600 shadow-md dark:bg-gray-800 dark:text-red-300">
            {error}
          </p>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {crops.map((crop) => (
              <Card
                key={crop.id}
                name={crop.name}
                season={crop.season}
                soil={crop.soil}
                water={crop.water}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}

export default Home;
