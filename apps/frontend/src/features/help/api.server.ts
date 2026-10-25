// Server-side twin of api.ts, for pages rendered on the server.
import "server-only";
import { backendApi } from "@/lib/server-api";
import { sharedHelpRoutes, buildPath } from "@lemonade/api-types/generated";
import type { HelpCenterResponse, LegalCategory, PublicPage } from "./api";

export const helpServerApi = {
  getPage: (category: LegalCategory) =>
    backendApi.get<PublicPage>(buildPath(sharedHelpRoutes.PAGES, { category })),

  getFaqs: () => backendApi.get<HelpCenterResponse>(sharedHelpRoutes.FAQS),
};
