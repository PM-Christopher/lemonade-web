// Endpoints for the help center articles over the BFF transport (browserApi).
import { browserApi } from "@/lib/browser-api";
import { adminFaqsRoutes, buildPath } from "@lemonade/api-types/generated";

export interface Faq {
  id: string;
  category: string;
  question: string;
  // Safe HTML, cleaned by the server.
  answer: string;
  position: number;
  is_published: boolean;
}

export interface FaqCategory {
  key: string;
  label: string;
}

export interface FaqListResponse {
  faqs: Faq[];
  categories: FaqCategory[];
}

// Mirrors App\Http\Requests\Admin\FaqRequest.
export interface FaqPayload {
  category: string;
  question: string;
  answer: string;
  is_published: boolean;
}

export const helpCenterApi = {
  list: (search?: string) =>
    browserApi.get<FaqListResponse>(adminFaqsRoutes.LIST, {
      params: search ? { search } : undefined,
    }),

  create: (payload: FaqPayload) => browserApi.post<{ faq: Faq }>(adminFaqsRoutes.CREATE, payload),

  update: (id: string, payload: FaqPayload) =>
    browserApi.patch<{ faq: Faq }>(buildPath(adminFaqsRoutes.UPDATE, { id }), payload),

  remove: (id: string) =>
    browserApi.delete<{ deleted: boolean }>(buildPath(adminFaqsRoutes.DELETE, { id })),

  // Ids in the order they should appear.
  reorder: (ids: string[]) =>
    browserApi.patch<{ reordered: number }>(adminFaqsRoutes.REORDER, { ids }),
};
