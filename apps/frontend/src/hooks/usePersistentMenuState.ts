"use client"

import * as React from "react";

export type MenuItem = {
    menuTitle: 'tribe' | 'event' | 'business' | 'home' | 'connect';
    menuOption: string[];
    active: string
}

const STORAGE_KEY = 'menu_state_v1'

const DEFAULT_MENU_STATE: MenuItem[] = [
    { menuTitle: "tribe", menuOption: ["discover", "tln", "mine"], active: "discover" },
    { menuTitle: "event", menuOption: ["events", "organizer", "agent"], active: "events" },
    { menuTitle: "business", menuOption: ["business", "listing"], active: "business" },
    { menuTitle: "home", menuOption: [], active: "" },
    { menuTitle: "connect", menuOption: [], active: "" },
]

type Persisted = {
    menuState: MenuItem[],
    selectedMenu: MenuItem["menuTitle"]
}

const DEFAULT_PERSISTED: Persisted = {
    menuState: DEFAULT_MENU_STATE,
    selectedMenu: "home"
}

function safeParse(raw: string | null): Persisted | null {
    if(!raw) return null
    try {
        const parsed = JSON.parse(raw)

        if (!parsed || typeof parsed !== 'object') return null
        if (!Array.isArray(parsed.menuState)) return null
        if(!["tribe", "event", "business", "home", "connect"].includes(parsed.selectedMenu)) return null

        return parsed as Persisted
    }
    catch {
        return null
    }
}

const mergeWithDefaults = (saved: Persisted) : Persisted => {
    const map = new Map(saved.menuState.map((m) => [m.menuTitle, m] as const))

    const mergedMenuState = DEFAULT_MENU_STATE.map((def) => {
        const existing = map.get(def.menuTitle)
        if (!existing) return def;

        const activeIsValid = def.menuOption.includes(existing.active)
        return {
            ...def,
            active: activeIsValid ? existing.active : def.active
        }
    })
    const selectedMenu = ["tribe", "event", "business", "home", "connect"].includes(saved.selectedMenu) ? saved.selectedMenu : "home"

    return { menuState: mergedMenuState, selectedMenu}
}

const usePersistentMenuState = () => {
    const [menuState, setMenuState] = React.useState<MenuItem[]>(DEFAULT_MENU_STATE)
    const [selectedMenu, setSelectedMenu] = React.useState<MenuItem["menuTitle"]>(DEFAULT_PERSISTED.selectedMenu)

    const hydrated = React.useRef(false)

    React.useEffect(() =>{
        const saved = safeParse(window.localStorage.getItem(STORAGE_KEY))
        if(saved) {
            const merged = mergeWithDefaults(saved)
            setMenuState(merged.menuState)
            setSelectedMenu(merged.selectedMenu)
        }
        hydrated.current = true
    }, [])

    React.useEffect(() => {
        if (!hydrated.current) return;
        const payload: Persisted = { menuState, selectedMenu };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }, [menuState, selectedMenu]);

    const setActive = (menuTitle: MenuItem["menuTitle"], option: string) => {
        setMenuState((prev) =>
            prev.map((m) => {
                if (m.menuTitle !== menuTitle) return m
                if (!m.menuOption.includes(option)) return m
                return {...m, active:option}
            })
        )
    }

    const getActive = (menuTitle: MenuItem["menuTitle"]) =>
        menuState.find((m) => m.menuTitle === menuTitle)?.active

    const getMenu = (menuTitle: MenuItem["menuTitle"]) =>
        menuState.find((m) => m.menuTitle === menuTitle)

    return {
        menuState,
        selectedMenu,
        setSelectedMenu,
        setActive,
        getActive,
        getMenu
    }
}

