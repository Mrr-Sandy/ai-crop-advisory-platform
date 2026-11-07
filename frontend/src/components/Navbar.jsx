import { Leaf, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearToken, getToken } from "../api/auth";
import { today } from "../lib/seasons";
import useColorMode from "../lib/useColorMode";

function Navbar({ overlay = false }) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useColorMode();
  const [token, setTokenState] = useState(getToken());
  const [menuOpen, setMenuOpen] = useState(false);
  const now = today();

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

  const navClass = "navlink w-full sm:w-auto";

  return (
    <header className={overlay ? "topbar topbar--overlay" : "topbar"}>
      <nav className="shell flex min-h-16 flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-6">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-2 rounded-pill no-underline"
            onClick={() => setMenuOpen(false)}
            aria-label="AI Crop Advisory, home"
          >
            <Leaf className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="wordmark truncate text-xl">AI Crop Advisory</span>
          </Link>

          <p className="seasonmark max-lg:hidden" title="Typical for this month; it shifts by region and rains">
            <i style={{ background: `var(--color-${now.season.key})` }} aria-hidden="true" />
            {now.season.label} season, {now.name}
          </p>

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="iconkey sm:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>

        <div
          data-menu
          className={`w-full flex-col gap-1 sm:flex sm:w-auto sm:flex-row sm:items-center ${menuOpen ? "flex" : "hidden"}`}
        >
          <NavLink to="/" end className={navClass} onClick={() => setMenuOpen(false)}>
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

              <button type="button" onClick={handleLogout} className={`${navClass} text-left`}>
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
            className="iconkey mt-2 sm:mt-0 sm:ml-2"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
