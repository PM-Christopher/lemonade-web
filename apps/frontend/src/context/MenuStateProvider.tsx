"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { navLinks } from "../../pageLinks";

export type MenuTitle = "tribe" | "event" | "business" | "home" | "connect";

export type MenuItem = {
  menuTitle: MenuTitle;
  menuOption: string[];
  active: string;
};

const STORAGE_KEY = "menu_state_v1";

const DEFAULT_MENU_STATE: MenuItem[] = [
  { menuTitle: "tribe", menuOption: ["discover", "tln", "mine"], active: "discover" },
  { menuTitle: "event", menuOption: ["events", "organizer", "agent"], active: "events" },
  { menuTitle: "business", menuOption: ["business", "listings"], active: "business" },
  { menuTitle: "home", menuOption: [], active: "" },
  { menuTitle: "connect", menuOption: [], active: "" },
];

type Persisted = {
  menuState: MenuItem[];
  selectedMenu: MenuTitle;
};

function safeParse(raw: string | null): Persisted | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (!Array.isArray(parsed.menuState)) return null;
    if (!["tribe", "event", "business", "home", "connect"].includes(parsed.selectedMenu))
      return null;
    return parsed as Persisted;
  } catch {
    return null;
  }
}

function mergeWithDefaults(saved: Persisted): Persisted {
  const map = new Map(saved.menuState.map((m) => [m.menuTitle, m] as const));

  const mergedMenuState = DEFAULT_MENU_STATE.map((def) => {
    const existing = map.get(def.menuTitle);
    if (!existing) return def;

    const activeIsValid = def.menuOption.length ? def.menuOption.includes(existing.active) : true;

    return {
      ...def,
      active: activeIsValid && typeof existing.active === "string" ? existing.active : def.active,
    };
  });

  const selectedMenu: MenuTitle = ["tribe", "event", "business", "home", "connect"].includes(
    saved.selectedMenu,
  )
    ? saved.selectedMenu
    : "home";

  return { menuState: mergedMenuState, selectedMenu };
}

function menuTitleFromPathname(pathname: string): MenuTitle {
  const top = "/" + (pathname.split("/")[1] || "");
  const match =
    navLinks
      .filter((l) => l.path !== "/")
      .find((l) => top === l.path || pathname === l.path || pathname.startsWith(`${l.path}/`)) ??
    navLinks[0];

  return match.title as MenuTitle;
}

type Ctx = {
  menuState: MenuItem[];
  selectedMenu: MenuTitle;
  setSelectedMenu: (m: MenuTitle) => void;
  setActive: (menuTitle: MenuTitle, option: string) => void;
  getActive: (menuTitle: MenuTitle) => string | undefined;
  getMenu: (menuTitle: MenuTitle) => MenuItem | undefined;
};

const MenuCtx = React.createContext<Ctx | null>(null);

export function MenuStateProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [menuState, setMenuState] = React.useState<MenuItem[]>(DEFAULT_MENU_STATE);
  const [selectedMenu, setSelectedMenu] = React.useState<MenuTitle>("home");

  // ✅ IMPORTANT: state gate, not ref
  const [hydrated, setHydrated] = React.useState(false);

  // Hydrate once
  React.useEffect(() => {
    const saved = safeParse(window.localStorage.getItem(STORAGE_KEY));
    if (saved) {
      const merged = mergeWithDefaults(saved);
      setMenuState(merged.menuState);
      // selectedMenu is driven by route below, but you can keep this if you want:
      // setSelectedMenu(merged.selectedMenu);
    }
    setHydrated(true); // ✅ only after reading storage
  }, []);

  // Always sync selectedMenu from route
  React.useEffect(() => {
    if (!pathname) return;
    setSelectedMenu(menuTitleFromPathname(pathname));
  }, [pathname]);

  // ✅ Persist ONLY after hydration finished
  React.useEffect(() => {
    if (!hydrated) return;

    const payload: Persisted = { menuState, selectedMenu };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [hydrated, menuState, selectedMenu]);

  const setActive = React.useCallback((menuTitle: MenuTitle, option: string) => {
    setMenuState((prev) =>
      prev.map((m) => {
        if (m.menuTitle !== menuTitle) return m;
        if (!m.menuOption.includes(option)) return m;
        return { ...m, active: option };
      }),
    );
  }, []);

  const getActive = React.useCallback(
    (menuTitle: MenuTitle) => menuState.find((m) => m.menuTitle === menuTitle)?.active,
    [menuState],
  );

  const getMenu = React.useCallback(
    (menuTitle: MenuTitle) => menuState.find((m) => m.menuTitle === menuTitle),
    [menuState],
  );

  return (
    <MenuCtx.Provider
      value={{ menuState, selectedMenu, setSelectedMenu, setActive, getActive, getMenu }}
    >
      {children}
    </MenuCtx.Provider>
  );
}

export function usePersistentMenuState() {
  const ctx = React.useContext(MenuCtx);
  if (!ctx) throw new Error("usePersistentMenuState must be used within <MenuStateProvider />");
  return ctx;
}
