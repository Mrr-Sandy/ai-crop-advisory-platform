import { Home, Info, LayoutDashboard, Leaf, LogOut, Menu, MessageSquareText, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import MonthBand from "./MonthBand";
import { clearToken, getProfile } from "../api/auth";
import { today } from "../lib/seasons";
import useColorMode from "../lib/useColorMode";

// The signed-in shell: a night rail that always knows the season, and the work beside it.
function AppShell({ children }) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useColorMode();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const now = today();

  useEffect(() => {
    const controller = new AbortController();
    getProfile({ signal: controller.signal })
      .then(setProfile)
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  const link = ({ isActive }) => `raillink ${isActive ? "is-active" : ""}`;

  return (
    <div className="appshell">
      <aside className={`rail ${open ? "is-open" : ""}`} aria-label="Application">
        <div className="rail__top">
          <Link to="/" className="flex items-center gap-2 no-underline" aria-label="AI Crop Advisory, home">
            <Leaf className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="wordmark text-xl">AI Crop Advisory</span>
          </Link>
          <button type="button" className="iconkey rail__menu" aria-label="Toggle navigation menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>

        <div className="rail__body">
          <div className="rail__season">
            <p className="text-sm text-[var(--color-on-night-muted)]">{now.season.label} season</p>
            <p className="mt-1 font-display text-2xl leading-tight">{now.name}: {now.line}</p>
            <MonthBand current={now.month} className="mt-4" />
          </div>

          <nav className="grid gap-1" aria-label="Main">
            <NavLink to="/dashboard" className={link} onClick={() => setOpen(false)}>
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" /> Dashboard
            </NavLink>
            <NavLink to="/ai-assistant" className={link} onClick={() => setOpen(false)}>
              <MessageSquareText className="h-4 w-4" aria-hidden="true" /> AI Assistant
            </NavLink>
            <NavLink to="/" end className={link} onClick={() => setOpen(false)}>
              <Home className="h-4 w-4" aria-hidden="true" /> Home
            </NavLink>
            <NavLink to="/about" className={link} onClick={() => setOpen(false)}>
              <Info className="h-4 w-4" aria-hidden="true" /> About
            </NavLink>
          </nav>

          <div className="rail__foot">
            {profile?.name ? (
              <p className="min-w-0">
                <span className="block truncate font-medium">{profile.name}</span>
                {profile.email ? <span className="block truncate text-sm text-[var(--color-on-night-muted)]">{profile.email}</span> : null}
              </p>
            ) : null}
            <a href="https://github.com" className="text-sm text-[var(--color-on-night-muted)] underline underline-offset-2 hover:text-[var(--color-on-night)]">
              Project repository
            </a>
            <div className="flex gap-2">
              <button type="button" className="iconkey" aria-label="Toggle dark mode" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
              </button>
              <button type="button" className="raillink flex-1" onClick={handleLogout}>
                <LogOut className="h-4 w-4" aria-hidden="true" /> Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="appmain">{children}</div>
    </div>
  );
}

export default AppShell;
