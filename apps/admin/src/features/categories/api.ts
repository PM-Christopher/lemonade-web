// Endpoints for tribe, business and reporting categories over the BFF transport (browserApi).
import { browserApi } from "@/lib/browser-api";
import { adminCategoriesRoutes, buildPath } from "@lemonade/api-types/generated";

export const CATEGORY_TYPES = ["tribes", "business", "report"] as const;
export type CategoryType = (typeof CATEGORY_TYPES)[number];

export interface Category {
  id: string;
  type: CategoryType;
  name: string;
  slug: string;
  description: string | null;
}

export interface CategoryListResponse {
  type: CategoryType;
  label: string;
  categories: Category[];
}

// Mirrors App\Http\Requests\Admin\CategoryRequest.
export interface CategoryPayload {
  type: CategoryType;
  name: string;
  description?: string;
}

export const categoriesApi = {
  list: (type: CategoryType, search?: string) =>
    browserApi.get<CategoryListResponse>(adminCategoriesRoutes.LIST, {
      params: { type, search: search || undefined },
    }),

  create: (payload: CategoryPayload) =>
    browserApi.post<{ category: Category }>(adminCategoriesRoutes.CREATE, payload),

  update: (id: string, payload: CategoryPayload) =>
    browserApi.patch<{ category: Category }>(
      buildPath(adminCategoriesRoutes.UPDATE, { id }),
      payload,
    ),

  remove: (id: string) =>
    browserApi.delete<{ deleted: boolean }>(buildPath(adminCategoriesRoutes.DELETE, { id })),
};
