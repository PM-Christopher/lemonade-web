// Endpoint layer for the subscriptions domain — see features/team/api.ts for
// the pattern this follows: the BFF proxy transport (browserApi), not the
// pre-BFF axiosInstance.
import { browserApi } from "@/lib/browser-api";
import { adminSubscriptionsRoutes, buildPath } from "@lemonade/api-types/generated";

export interface AdminSubscriptionPlanBenefits {
  verification_badge: boolean;
  tribe_creation: boolean;
  lemon_id: boolean;
  event_creation: number;
  ticket_sales_commission: number;
  service_commission: number;
  connection_range: string;
  offline_benefits: boolean;
}

export interface AdminSubscriptionPlan {
  id: string;
  title: string;
  access_type: string;
  monthly_charge_minor: number;
  // Pre-formatted display string (AdminSubscriptionPlanResource::formatAmount)
  // — render as-is, never reformat or recompute per CLAUDE.md's money rule.
  monthly_charge: string;
  yearly_charge_minor: number;
  yearly_charge: string;
  active: boolean;
  recommended: boolean;
  benefits: AdminSubscriptionPlanBenefits;
  subscriber_count?: number;
  created_at: string;
}

export interface SubscriptionPlanListResponse {
  plans: AdminSubscriptionPlan[];
}

export interface SubscriptionPlanResponse {
  plan: AdminSubscriptionPlan;
}

export interface DeletePlanResponse {
  deleted: boolean;
}

// Request body for STORE/UPDATE (SubscriptionPlanRequest::rules() on the
// backend). monthly_charge/yearly_charge are MAJOR currency units (e.g.
// naira, not kobo) — verified against SubscriptionPlanRequest::toDto(),
// which runs them through Money::fromUnits(...)->minor before persisting.
// This is a different shape from the list response's
// monthly_charge_minor/yearly_charge_minor, which are already-minor
// figures — see PlanFormModal for the conversion when pre-filling an edit.
//
// access_type and connection_range have no backend `in:` enum — the
// FormRequest only validates them as `string|max:60` (seeders/tests use
// inconsistent casing, e.g. "Full"/"Limited"/"Global"/"global") — so these
// are free-text fields here, not a fixed option set.
export interface SubscriptionPlanPayload {
  title: string;
  access_type: string;
  monthly_charge: number;
  yearly_charge: number;
  ver_badge: boolean;
  forum_creation: boolean;
  lemon_id: boolean;
  event_creation: number;
  sales_commission: number;
  service_commission: number;
  connection_range: string;
  offline_benefits: boolean;
  recommended?: boolean;
  active?: boolean;
}

export const subscriptionsApi = {
  getPlans: () => browserApi.get<SubscriptionPlanListResponse>(adminSubscriptionsRoutes.LIST),

  createPlan: (payload: SubscriptionPlanPayload) =>
    browserApi.post<SubscriptionPlanResponse>(adminSubscriptionsRoutes.STORE, payload),

  updatePlan: (id: string, payload: SubscriptionPlanPayload) =>
    browserApi.patch<SubscriptionPlanResponse>(
      buildPath(adminSubscriptionsRoutes.UPDATE, { id }),
      payload,
    ),

  activatePlan: (id: string) =>
    browserApi.patch<SubscriptionPlanResponse>(
      buildPath(adminSubscriptionsRoutes.ACTIVATE, { id }),
      {},
    ),

  deactivatePlan: (id: string) =>
    browserApi.patch<SubscriptionPlanResponse>(
      buildPath(adminSubscriptionsRoutes.DEACTIVATE, { id }),
      {},
    ),

  deletePlan: (id: string) =>
    browserApi.delete<DeletePlanResponse>(buildPath(adminSubscriptionsRoutes.DESTROY, { id })),
};
