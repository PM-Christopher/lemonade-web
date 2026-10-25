// Endpoints for the policy pages and the help center over the BFF transport (browserApi).
import { browserApi } from "@/lib/browser-api";
import { sharedHelpRoutes, buildPath } from "@lemonade/api-types/generated";

export type LegalCategory = "terms_and_conditions" | "privacy_policy" | "cookie_policy";

export interface PublicPage {
  category: string;
  title: string;
  // Safe HTML, cleaned by the server.
  content: string;
  // Null until an admin has saved their own text.
  updated_at: string | null;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqSection {
  key: string;
  label: string;
  faqs: FaqItem[];
}

export interface HelpCenterResponse {
  sections: FaqSection[];
  support: { email: string | null; phone: string | null };
}

export const helpApi = {
  getPage: (category: LegalCategory) =>
    browserApi.get<PublicPage>(buildPath(sharedHelpRoutes.PAGES, { category })),

  getFaqs: (search?: string) =>
    browserApi.get<HelpCenterResponse>(sharedHelpRoutes.FAQS, {
      params: search ? { search } : undefined,
    }),
};
