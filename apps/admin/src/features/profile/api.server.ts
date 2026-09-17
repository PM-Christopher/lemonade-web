import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminAccountRoutes } from "@lemonade/api-types";
import type { AdminProfileResponse } from "./api";

export const profileServerApi = {
  getProfile: () =>
    backendApi.get<AdminProfileResponse>(adminAccountRoutes.PROFILE),
};
