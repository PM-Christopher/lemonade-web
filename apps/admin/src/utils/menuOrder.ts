import { routes } from "@/lib/routes";
import type { PageLink } from "@/utils/pageLinks";

export interface MenuPreferencesInput {
  menu_order: string[];
  hidden_menu: string[];
  menu_labels?: Record<string, string>;
}

/** Puts links in the saved order (new pages go last), drops the hidden ones and uses the admin's own names. Overview never hides. */
export function applyMenuPreferences(
  links: PageLink[],
  preferences: MenuPreferencesInput | undefined,
): PageLink[] {
  if (!preferences) return links;

  const rank = new Map(preferences.menu_order.map((path, index) => [path, index]));
  const hidden = new Set(preferences.hidden_menu);
  const labels = preferences.menu_labels ?? {};

  return links
    .filter((link) => link.path === routes.HOME || !hidden.has(link.path))
    .map((link) => (labels[link.path]?.trim() ? { ...link, name: labels[link.path].trim() } : link))
    .map((link, index) => ({ link, index }))
    .sort((a, b) => {
      const first = rank.get(a.link.path) ?? Number.MAX_SAFE_INTEGER;
      const second = rank.get(b.link.path) ?? Number.MAX_SAFE_INTEGER;
      return first - second || a.index - b.index;
    })
    .map(({ link }) => link);
}
