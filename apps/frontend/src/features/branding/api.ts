// Public platform branding (logo and name) over the BFF transport (browserApi).
import { browserApi } from "@/lib/browser-api";
import { adminSettingsRoutes } from "@lemonade/api-types/generated";

export interface Branding {
  platform_name: string;
  logo_url: string | null;
}

export const brandingApi = {
  get: () => browserApi.get<Branding>(adminSettingsRoutes.BRANDING),
};
