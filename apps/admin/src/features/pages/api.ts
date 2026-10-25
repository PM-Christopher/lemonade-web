// Endpoints for the terms, privacy, cookie and community pages over the BFF transport (browserApi).
import { browserApi } from "@/lib/browser-api";
import { adminPageContentRoutes } from "@lemonade/api-types/generated";

export type PageCategory =
  "terms_and_conditions" | "privacy_policy" | "cookie_policy" | "community_guidelines";

export interface PolicyPage {
  category: PageCategory;
  title: string;
  // What the public page shows now: the saved text, or the starting text.
  content: string;
  is_default: boolean;
}

export interface PagesResponse {
  pages: PolicyPage[];
}

export const pagesApi = {
  getPages: () => browserApi.get<PagesResponse>(adminPageContentRoutes.SHOW),

  // Mirrors App\Http\Requests\Admin\PageContentRequest. The server cleans the HTML.
  savePage: (category: PageCategory, content: string) =>
    browserApi.post<{ content: string }>(adminPageContentRoutes.SAVE, { category, content }),
};
