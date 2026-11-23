"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  DEFAULT_THEME,
  type ResolvedTheme,
  type ThemeSetting,
  THEME_STORAGE_KEY,
  getServerThemeClass,
  parseThemeSetting,
  persistTheme,
} from "@/lib/theme";

interface ThemeContextValue {
  theme?: ThemeSetting;
  resolvedTheme?: ResolvedTheme;
  setTheme: (theme: ThemeSetting) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(theme: ThemeSetting): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme;
}

function applyTheme(theme: ThemeSetting) {
  const resolved = resolveTheme(theme);
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(resolved);
  document.documentElement.style.colorScheme = resolved;
}

function readStoredTheme(initialTheme: ThemeSetting): ThemeSetting {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return parseThemeSetting(stored ?? undefined, initialTheme);
  } catch {
    return initialTheme;
  }
}

// The setting is read after hydration. Changes in this tab are set explicitly.
function subscribeToInitialPreference() {
  return () => {};
}

function subscribeToSystemTheme(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  function handleChange() {
    applyTheme("system");
    onChange();
  }

  media.addEventListener("change", handleChange);
  return () => media.removeEventListener("change", handleChange);
}

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: ThemeSetting;
}

export function ThemeProvider({ children, initialTheme = DEFAULT_THEME }: ThemeProviderProps) {
  const [selectedTheme, setSelectedTheme] = useState<ThemeSetting>();
  const storedTheme = useSyncExternalStore(
    subscribeToInitialPreference,
    () => readStoredTheme(initialTheme),
    () => initialTheme,
  );
  const theme = selectedTheme ?? storedTheme;
  const resolvedTheme = useSyncExternalStore(
    theme === "system" ? subscribeToSystemTheme : subscribeToInitialPreference,
    () => resolveTheme(theme),
    () => getServerThemeClass(initialTheme),
  );

  useEffect(() => {
    const stored = readStoredTheme(initialTheme);
    applyTheme(stored);
    persistTheme(stored);
  }, [initialTheme]);

  const setTheme = useCallback((nextTheme: ThemeSetting) => {
    setSelectedTheme(nextTheme);
    applyTheme(nextTheme);
    persistTheme(nextTheme);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
