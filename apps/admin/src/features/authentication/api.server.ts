import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminAccountRoutes } from "@lemonade/api-types/generated";
import type { CurrentAdmin } from "./api";

export const authServerApi = {
  // Same unwrap as features/authentication/api.ts's client-side version —
  // GetAdminProfile::execute() (lemonade-backend) wraps the response as
  // { admin: {...} }, not flat.
  getCurrentAdmin: () =>
    backendApi.get<{ admin: CurrentAdmin }>(adminAccountRoutes.PROFILE).then((r) => r.admin),
};
