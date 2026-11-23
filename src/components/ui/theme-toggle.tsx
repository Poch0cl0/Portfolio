"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { useDictionary } from "@/i18n/dictionary-provider";
import styles from "@/components/layout/navbar.module.css";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { dict } = useDictionary();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={dict.common.header.darkMode}
      className={`${styles.themeSwitch} motion-transition-colors`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span className={styles.themeScenery} aria-hidden="true" />
      <span className={styles.themeThumb} aria-hidden="true">
        <Sun className={styles.sun} size={17} />
        <Moon className={styles.moon} size={16} />
      </span>
    </button>
  );
}
