import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminAccountRoutes } from "@lemonade/api-types/generated";
import type { AdminProfileResponse } from "./api";

export const profileServerApi = {
  getProfile: () => backendApi.get<AdminProfileResponse>(adminAccountRoutes.PROFILE),
};
