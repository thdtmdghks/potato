export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

let listeners: (() => void)[] = [];

export const subscribe = (listener: () => void) => {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

const emitChange = () => {
  for (const listener of listeners) {
    listener();
  }
};

export const getStoredTheme = (): Theme => {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem(STORAGE_KEY) as Theme) ?? "system";
};

export const setTheme = (theme: Theme) => {
  const root = document.documentElement;
  if (theme === "system") {
    localStorage.removeItem(STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    localStorage.setItem(STORAGE_KEY, theme);
    root.classList.toggle("dark", theme === "dark");
  }
  emitChange();
};
