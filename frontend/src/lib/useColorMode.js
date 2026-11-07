import { useEffect, useState } from "react";

// The one light and dark switch, shared by the public bar and the app shell.
export default function useColorMode() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.dataset.mode = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return [darkMode, setDarkMode];
}
