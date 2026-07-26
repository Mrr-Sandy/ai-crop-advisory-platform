import { Leaf, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearToken, getToken } from "../api/auth";

function Navbar() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  const [token, setTokenState] = useState(getToken());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const handleAuthChange = () => {
      setTokenState(getToken());
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    clearToken();
    setTokenState(null);
    setMenuOpen(false);
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    `w-full whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-medium transition-colors sm:w-auto sm:px-3 sm:text-sm ${
      isActive
        ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <nav className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-2 text-slate-950 dark:text-white"
            onClick={() => setMenuOpen(false)}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-700 text-white">
              <Leaf className="h-5 w-5" aria-hidden="true" />
            </span>

            <span className="truncate text-sm font-semibold sm:text-base">
              AI Crop Advisory
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 sm:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>

        <div
          className={`w-full flex-col gap-2 sm:flex sm:flex-row sm:flex-wrap sm:items-center lg:w-auto lg:justify-end ${
            menuOpen ? "flex" : "hidden"
          }`}
        >
          <NavLink to="/" className={navClass} onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>

          <NavLink to="/about" className={navClass} onClick={() => setMenuOpen(false)}>
            About
          </NavLink>

          <NavLink to="/ai-assistant" className={navClass} onClick={() => setMenuOpen(false)}>
            AI Assistant
          </NavLink>

          {token ? (
            <>
              <NavLink to="/dashboard" className={navClass} onClick={() => setMenuOpen(false)}>
                Dashboard
              </NavLink>

              <button
                onClick={handleLogout}
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950 sm:w-auto"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass} onClick={() => setMenuOpen(false)}>
                Login
              </NavLink>

              <NavLink to="/register" className={navClass} onClick={() => setMenuOpen(false)}>
                Register
              </NavLink>
            </>
          )}

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 sm:h-10 sm:w-10"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
