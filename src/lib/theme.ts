export const THEME_STORAGE_KEY = "theme";
export const DEFAULT_THEME = "dark";

export type ThemeSetting = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export function parseThemeSetting(
  value: string | undefined,
  fallback: ThemeSetting = DEFAULT_THEME,
): ThemeSetting {
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }
  return fallback;
}

/** En el servidor no conocemos prefers-color-scheme; system se resuelve a dark. */
export function getServerThemeClass(theme: ThemeSetting): ResolvedTheme {
  return theme === "light" ? "light" : "dark";
}

// Apply the saved preference before the page is painted, including system mode.
export const themeBootstrap = `(() => {
  const root = document.documentElement;
  let theme = root.dataset.initialTheme;
  try {
    const stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    if (stored === "light" || stored === "dark" || stored === "system") theme = stored;
  } catch {}
  const resolved = theme === "system"
    ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : theme;
  root.classList.toggle("light", resolved === "light");
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
})();`;

export function persistTheme(theme: ThemeSetting) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // ignore storage errors
  }

  document.cookie = `${THEME_STORAGE_KEY}=${theme};path=/;max-age=31536000;SameSite=Lax`;
}
