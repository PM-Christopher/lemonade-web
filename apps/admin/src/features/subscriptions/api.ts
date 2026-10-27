// Endpoints for the subscriptions domain over the BFF transport (browserApi).
import { browserApi } from "@/lib/browser-api";
import { adminSubscriptionsRoutes, buildPath } from "@lemonade/api-types/generated";

// Plan type and connection range are a fixed choice (SubscriptionPlanRequest).
export type PlanType = "Limited" | "Unlimited";

export interface AdminSubscriptionPlanBenefits {
  verification_badge: boolean;
  tribe_creation: boolean;
  business_listing: boolean;
  lemon_id: boolean;
  event_creation: number;
  tribe_limit: number;
  thread_limit: number;
  business_limit: number;
  // Null when the plan leaves it blank and the standard rate applies.
  ticket_sales_commission: number | null;
  service_commission: number | null;
  connection_range: PlanType;
  offline_benefits: boolean;
}

export interface AdminSubscriptionPlan {
  id: string;
  title: string;
  access_type: PlanType;
  monthly_charge_minor: number;
  // Server amount in major units, e.g. "5000.00". Shown with thousands separators, never recomputed.
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
export interface SubscriptionPlanPayload {
  title: string;
  access_type: PlanType;
  monthly_charge: number;
  yearly_charge: number;
  ver_badge: boolean;
  forum_creation: boolean;
  business_listing: boolean;
  lemon_id: boolean;
  event_creation: number;
  tribe_limit: number;
  thread_limit: number;
  business_limit: number;
  // Null leaves it blank so the standard rate applies.
  sales_commission: number | null;
  service_commission: number | null;
  connection_range: PlanType;
  offline_benefits: boolean;
  recommended?: boolean;
  active?: boolean;
}

export type SubscriptionStatus = "active" | "past_due" | "cancelled" | "expired";
export type SubscriptionCycle = "free" | "monthly" | "yearly";

export interface PlanOverviewRow {
  id: string;
  title: string;
  active: boolean;
  monthly_charge_minor: number;
  subscribers: number;
  by_status: Record<SubscriptionStatus, number>;
  recurring_revenue_minor: number;
  // Pre-formatted by the backend — shown as-is.
  recurring_revenue: string;
}

export interface SubscriptionOverviewResponse {
  plans: PlanOverviewRow[];
  total_subscribers: number;
  total_recurring_revenue_minor: number;
  total_recurring_revenue: string;
}

export interface PlanSubscriber {
  id: string;
  status: SubscriptionStatus;
  billing_cycle: SubscriptionCycle;
  amount: string;
  auto_renew: boolean;
  started_at: string | null;
  current_period_end: string | null;
  cancelled_at: string | null;
  renewal_attempts: number;
  last_renewal_error: string | null;
  card: { brand: string | null; last4: string; expires: string | null } | null;
  user: { id: string; name: string; username: string | null; email: string } | null;
}

export interface PlanSubscribersFilters {
  status?: SubscriptionStatus;
  cycle?: SubscriptionCycle;
  search?: string;
  page?: number;
}

export interface PlanSubscribersResponse {
  plan: { id: string; title: string };
  subscribers: PlanSubscriber[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

export const subscriptionsApi = {
  getOverview: () =>
    browserApi.get<SubscriptionOverviewResponse>(adminSubscriptionsRoutes.OVERVIEW),

  getSubscribers: (id: string, filters?: PlanSubscribersFilters) =>
    browserApi.get<PlanSubscribersResponse>(
      buildPath(adminSubscriptionsRoutes.SUBSCRIBERS, { id }),
      {
        params: {
          status: filters?.status,
          cycle: filters?.cycle,
          search: filters?.search,
          page: filters?.page,
        },
      },
    ),

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
