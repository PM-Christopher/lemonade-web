// Endpoints for the profile domain over the BFF transport (browserApi).
import { browserApi } from "@/lib/browser-api";
import { adminAccountRoutes } from "@lemonade/api-types/generated";

export interface AdminProfile {
  id: string | number;
  unique_id: string;
  name: string;
  email: string;
  status: number;
  created_at: string;
  image: string | null;
  role: string;
}

export interface AdminProfileResponse {
  admin: AdminProfile;
}

export const profileApi = {
  getProfile: () => browserApi.get<AdminProfileResponse>(adminAccountRoutes.PROFILE),
};
