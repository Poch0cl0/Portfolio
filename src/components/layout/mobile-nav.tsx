"use client";

import { Menu, X } from "lucide-react";
import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useDictionary } from "@/i18n/dictionary-provider";
import styles from "./navbar.module.css";

export function MobileNav({ children }: { children: (close: () => void) => ReactNode }) {
  const { dict } = useDictionary();
  const [menu, setMenu] = useState<"closed" | "open" | "restore-focus">("closed");
  const open = menu === "open";
  const panelId = useId();
  const trigger = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (menu === "restore-focus") trigger.current?.focus();
  }, [menu]);

  function close() {
    setMenu("restore-focus");
  }

  return (
    <div className={styles.mobile}
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          event.stopPropagation();
          close();
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        className={styles.menuButton}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? dict.common.header.closeMenu : dict.common.header.openMenu}
        onClick={() => setMenu(open ? "closed" : "open")}
      >
        {open ? <X aria-hidden="true" size={19} /> : <Menu aria-hidden="true" size={19} />}
      </button>
      <div id={panelId} className={styles.mobilePanel} data-open={open} inert={!open}>
        <div className={styles.mobilePanelClip}>{children(close)}</div>
      </div>
    </div>
  );
}
