import { useMemo } from "react";
import { pageLinks, type PageLink } from "@/utils/pageLinks";
import { applyMenuPreferences } from "@/utils/menuOrder";
import { useCurrentAdminQuery } from "@/features/authentication/queries";
import { useAdminSettingsQuery } from "@/features/settings/queries";

// The menu this admin sees: their permissions, then their saved order and hidden pages.
export function useMenuLinks(): PageLink[] {
  const { data: currentAdmin } = useCurrentAdminQuery();
  const { data: settings } = useAdminSettingsQuery();
  const permissions = currentAdmin?.permissions;
  const preferences = settings?.preferences;

  return useMemo(() => {
    const allowed = pageLinks.filter(
      (item) => !item.permission || permissions?.includes(item.permission),
    );
    return applyMenuPreferences(allowed, preferences);
  }, [permissions, preferences]);
}
