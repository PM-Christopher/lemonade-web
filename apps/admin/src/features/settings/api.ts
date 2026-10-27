// Endpoints for platform settings and menu preferences over the BFF transport (browserApi).
import { browserApi } from "@/lib/browser-api";
import { adminSettingsRoutes, adminUtilitiesRoutes } from "@lemonade/api-types/generated";

export interface Branding {
  platform_name: string;
  logo_url: string | null;
  support_email: string | null;
  support_phone: string | null;
  account_deletion_grace_days: number;
}

export interface PlatformSettings extends Branding {
  inactivity_timeout_minutes: number;
  // Days before old logs are removed; 0 keeps them forever.
  audit_retention_days: number;
  user_activity_retention_days: number;
  // Days a deleted account can still be restored by signing in.
  account_deletion_grace_days: number;
  // Percent of the subscription fee a referrer earns: first time, and on each renewal.
  referral_subscribe_percent: number;
  referral_renewal_percent: number;
}

// Menu paths, like "/tribes". An empty order means the default A to Z menu.
export interface MenuPreferences {
  menu_order: string[];
  hidden_menu: string[];
  // Own names for menu pages, by path. A page without one keeps its default name.
  menu_labels: Record<string, string>;
}

export interface AdminSettings {
  platform: PlatformSettings;
  preferences: MenuPreferences;
}

export interface PlatformSettingsPayload {
  platform_name: string;
  logo_url: string | null;
  inactivity_timeout_minutes: number;
  support_email: string | null;
  support_phone: string | null;
  audit_retention_days: number;
  user_activity_retention_days: number;
  account_deletion_grace_days: number;
  referral_subscribe_percent: number;
  referral_renewal_percent: number;
}

export const settingsApi = {
  branding: () => browserApi.get<Branding>(adminSettingsRoutes.BRANDING),

  get: () => browserApi.get<AdminSettings>(adminSettingsRoutes.SHOW),

  updatePlatform: (payload: PlatformSettingsPayload) =>
    browserApi.patch<AdminSettings>(adminSettingsRoutes.UPDATE_PLATFORM, payload),

  updatePreferences: (payload: MenuPreferences) =>
    browserApi.patch<AdminSettings>(adminSettingsRoutes.UPDATE_PREFERENCES, payload),

  // Uploads the picture and gives back its address, to save with the platform settings.
  uploadLogo: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const uploaded = await browserApi.post<{ image: string }>(
      adminUtilitiesRoutes.UPLOAD,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return uploaded.image;
  },
};
