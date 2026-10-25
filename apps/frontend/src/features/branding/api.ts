// Public platform branding (logo and name) over the BFF transport (browserApi).
import { browserApi } from "@/lib/browser-api";
import { adminSettingsRoutes } from "@lemonade/api-types/generated";

export interface Branding {
  platform_name: string;
  logo_url: string | null;
  // Days a deleted account can still be restored by signing in.
  account_deletion_grace_days: number;
}

export const brandingApi = {
  get: () => browserApi.get<Branding>(adminSettingsRoutes.BRANDING),
};
