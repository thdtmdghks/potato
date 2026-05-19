export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem(STORAGE_KEY) as Theme) ?? "system";
}

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") {
    localStorage.removeItem(STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    localStorage.setItem(STORAGE_KEY, theme);
    root.classList.toggle("dark", theme === "dark");
  }
}
