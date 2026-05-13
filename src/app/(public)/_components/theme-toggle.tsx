"use client";

import { useState, useEffect } from "react";
import { getStoredTheme, setTheme, type Theme } from "@/client/theme";

export default function ThemeToggle() {
  const [theme, setLocal] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocal(getStoredTheme());
    setMounted(true);
  }, []);

  const cycle = () => {
    const next: Theme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(next);
    setLocal(next);
  };

  const icon = theme === "dark" ? "🌙" : theme === "light" ? "☀️" : "💻";

  return (
    <button
      onClick={cycle}
      aria-label={`테마: ${theme}`}
      className="text-lg"
      suppressHydrationWarning
    >
      {mounted ? icon : null}
    </button>
  );
}
