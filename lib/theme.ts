export const THEME_STORAGE_KEY = "settled-theme";
export const THEME_COOKIE_NAME = "settled-theme";

export const THEME_MODES = ["light", "dark"] as const;

export type ThemeMode = (typeof THEME_MODES)[number];

export function parseThemeMode(value: string | undefined): ThemeMode | null {
  if (!value) {
    return null;
  }

  return THEME_MODES.find((themeMode) => themeMode === value) ?? null;
}
