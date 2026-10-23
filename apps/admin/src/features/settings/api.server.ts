import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminSettingsRoutes } from "@lemonade/api-types/generated";
import type { AdminSettings, Branding } from "./api";

export const settingsServerApi = {
  getBranding: () => backendApi.get<Branding>(adminSettingsRoutes.BRANDING),
  getSettings: () => backendApi.get<AdminSettings>(adminSettingsRoutes.SHOW),
};
