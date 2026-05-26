"use client";

import { useSyncExternalStore } from "react";
import { getStoredTheme, setTheme, subscribe, type Theme } from "@/client/theme";

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getStoredTheme, () => "system" as Theme);

  const cycle = () => {
    const next: Theme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(next);
  };

  const icon = theme === "dark" ? "🌙" : theme === "light" ? "☀️" : "💻";

  return (
    <button
      onClick={cycle}
      aria-label={`테마: ${theme}`}
      className="text-lg"
      suppressHydrationWarning
    >
      {icon}
    </button>
  );
}
