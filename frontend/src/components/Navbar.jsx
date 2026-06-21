import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <nav className="bg-green-700 text-white px-4 py-4 dark:bg-green-800">
      <div className="max-w-6xl mx-auto grid justify-items-center gap-3 md:grid-cols-[auto_1fr_auto_auto] md:items-center md:justify-items-stretch">
        <h1 className="font-bold text-lg sm:text-xl">AI Crop Advisory</h1>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm sm:text-base md:justify-end">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/login">Login</Link>
        </div>

        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className="rounded border border-white px-3 py-1 text-sm"
          aria-label="Toggle dark mode"
        >
          {darkMode ? "Light" : "Dark"}
        </button>

        <span>👤</span>
      </div>
    </nav>
  );
}

export default Navbar;
