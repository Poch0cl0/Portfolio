export const THEME_STORAGE_KEY = "theme";
export const DEFAULT_THEME = "dark";

export type ThemeSetting = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export function parseThemeSetting(value: string | undefined): ThemeSetting {
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }
  return DEFAULT_THEME;
}

/** En el servidor no conocemos prefers-color-scheme; system se resuelve a dark. */
export function getServerThemeClass(theme: ThemeSetting): ResolvedTheme {
  return theme === "light" ? "light" : "dark";
}

export function persistTheme(theme: ThemeSetting) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // ignore storage errors
  }

  document.cookie = `${THEME_STORAGE_KEY}=${theme};path=/;max-age=31536000;SameSite=Lax`;
}
