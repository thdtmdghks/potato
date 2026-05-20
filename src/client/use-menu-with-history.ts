import { useState, useEffect, useCallback } from "react";

export const useMenuWithHistory = () => {
  const [open, setOpen] = useState(false);

  const openMenu = useCallback(() => {
    setOpen(true);
    window.history.pushState({ menuOpen: true }, "");
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  const toggle = useCallback(() => {
    if (open) {
      window.history.back();
    } else {
      openMenu();
    }
  }, [open, openMenu]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (open && !e.state?.menuOpen) {
        setOpen(false);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [open]);

  return { open, toggle, closeMenu };
};
