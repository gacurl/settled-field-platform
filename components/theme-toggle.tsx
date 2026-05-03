'use client';

import { useEffect, useState } from "react";
import {
  THEME_COOKIE_NAME,
  THEME_STORAGE_KEY,
  type ThemeMode,
} from "@/lib/theme";

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  document.cookie = `${THEME_COOKIE_NAME}=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      className="theme-toggle__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2.75v2.5" />
      <path d="M12 18.75v2.5" />
      <path d="M21.25 12h-2.5" />
      <path d="M5.25 12h-2.5" />
      <path d="M18.54 5.46l-1.77 1.77" />
      <path d="M7.23 16.77l-1.77 1.77" />
      <path d="M18.54 18.54l-1.77-1.77" />
      <path d="M7.23 7.23 5.46 5.46" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      className="theme-toggle__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a8.5 8.5 0 1 0 9.5 9.5Z" />
    </svg>
  );
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    const documentTheme = document.documentElement.dataset.theme;

    if (documentTheme === "dark" || documentTheme === "light") {
      return documentTheme;
    }

    return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  function handleToggle() {
    const nextTheme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
  }

  return (
    <button
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="theme-toggle"
      onClick={handleToggle}
      type="button"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
