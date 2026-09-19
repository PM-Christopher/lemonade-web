// Endpoint layer for the auth/session domain — the first domain migrated
// to TanStack Query (see queries.ts/mutations.ts), proving the pattern
// docs/ARCHITECTURE.md §11 lays out before the other ~18 domains migrate
// off Redux thunks. Two transports, deliberately:
//   - login/logout call this app's OWN Next.js Route Handlers
//     (/api/auth/login, /api/auth/logout) directly — those aren't under
//     the /v1 BFF proxy prefix, they ARE the broker that talks to the
//     backend and sets the httpOnly cookie server-side.
//   - getCurrentUser calls the real backend through browserApi (the BFF
//     proxy), same as every other authenticated read.
import { browserApi } from "@/lib/browser-api";
import {
  userProfileRoutes,
  userSubscriptionRoutes,
  buildPath,
} from "@lemonade/api-types/generated";

export interface CurrentUser {
  id: string | number;
  email: string;
  fullname: string;
  username: string | null;
  [key: string]: unknown;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResult {
  user: CurrentUser;
  needsOnboarding?: boolean;
  token?: string; // only present when needsOnboarding — see app/api/auth/login/route.ts
}

async function postJson<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const envelope = await response.json();

  if (!response.ok) {
    throw Object.assign(new Error(envelope?.message ?? "Request failed"), {
      status: response.status,
      errorCode: envelope?.error_code,
      fieldErrors: envelope?.errors,
    });
  }

  return envelope.data as T;
}

// Pre-login onboarding endpoints (email verification, password reset).
// These don't take a token param — the BFF proxy reads the JS-readable
// ONBOARDING_TOKEN_COOKIE ("newToken") server-side as a fallback bearer
// token whenever there's no main session cookie (see
// app/api/v1/[...path]/route.ts and lib/cookie-names.ts). The old thunks
// built a manual Authorization header from a token passed in as a param —
// that header would just get stripped by browserApi's interceptor now, so
// this isn't a corner cut, it's the fix that already shipped for
// getUserProfile applied consistently here.
export interface VerifyOtpPayload {
  code: string;
}

export interface VerifyPasswordResetOtpResult {
  token: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResult {
  token: string;
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
  confirm_password: string;
}

export interface UpdateProfileFieldResult {
  user: CurrentUser;
}

export interface ChangePasswordPayload {
  password: string;
  new_password: string;
  new_password_confirmation?: string;
}

// NOTE: this call is deeper than a field mismatch — two independent
// problems, confirmed live:
// 1. DeleteAccountRequest requires `confirmation` (exact string "DELETE")
//    and doesn't validate `password` at all; ConfirmDeletePage's form
//    collects and sends only `password`, so this field never matches.
// 2. Even with that fixed, the route requires a Sanctum token scoped to
//    the `account_deletion` ability specifically (CheckForAnyAbility:
//    account_deletion) — the user's normal session token (`access_token`
//    ability) gets "Invalid ability provided", confirmed live. Getting an
//    account_deletion-scoped token means going through a completely
//    separate OTP flow first (RequestAccountDeletionAction ->
//    VerifyAccountDeletionAction, POST .../request-account-deletion then
//    .../verify-account-deletion) that has no UI anywhere in this app —
//    ConfirmDeletePage calls delete-account directly with the regular
//    session.
// So account deletion cannot work from this UI at all today, independent
// of the transport migration. Not fixed here — this is a missing feature
// (the OTP-confirmation step and its UI), not a one-line correction.
// Documented in docs/ARCHITECTURE.md.
export interface DeleteAccountPayload {
  password?: string;
  confirmation?: string;
}

export interface NotificationSettingsPayload {
  type: string;
  settings: {
    email: boolean;
    in_app_notification: boolean;
  };
}

export interface ChangePlanPayload {
  reason?: string;
  subscription_id: number | string | null | undefined;
  type: string | null;
  mode: string | null;
  redirect_url: string;
}

// change-plan's response shape genuinely varies by branch: switching to (or
// staying on) a free plan returns `subscription` only; a plan that requires
// payment returns `payment`/`reference` instead (see
// ChangeUserSubscriptionPlan — fixed earlier this session to return a real
// URL under `payment`, not the whole Paystack init array).
export interface ChangePlanResult {
  subscription?: unknown;
  payment?: string;
  reference?: string;
  credit_applied_minor?: number;
  amount_due_minor?: number;
  amount_due?: string;
}

export interface NotificationSettingChannels {
  email: boolean;
  in_app_notification: boolean;
}

export interface AppSettings {
  id: string;
  push_notification: boolean;
  new_thread: NotificationSettingChannels;
  thread_engagements: NotificationSettingChannels;
  ticket_sales: NotificationSettingChannels;
  ticket_payout: NotificationSettingChannels;
  service_offer: NotificationSettingChannels;
  service_status: NotificationSettingChannels;
  service_payout: NotificationSettingChannels;
  connect_request: NotificationSettingChannels;
  new_message: NotificationSettingChannels;
}

export interface AppSettingsResponse {
  app_settings: AppSettings | null;
}

export interface SubscriptionBenefits {
  verification_badge: boolean;
  tribe_creation: boolean;
  lemon_id: boolean;
  event_creation: boolean;
  ticket_sales_commission: number;
  service_commission: number;
  connection_range: number;
  offline_benefits: boolean;
}

export interface SubscriptionSummary {
  title: string;
  payment_method: string;
  plan_price: string;
  next_billing_date: string;
}

export interface SubscriptionResponse {
  subscription: SubscriptionSummary & { benefits: SubscriptionBenefits };
}

export interface BillingHistoryItem {
  title: string;
  amount: number;
  created_at: string;
}

export interface BillingHistoryResponse {
  plan: SubscriptionSummary;
  histories: BillingHistoryItem[];
}

export const authApi = {
  login: (payload: LoginPayload) =>
    postJson<LoginResult>("/api/auth/login", payload),
  logout: () => postJson<void>("/api/auth/logout"),
  getCurrentUser: () => browserApi.get<CurrentUser>(userProfileRoutes.SHOW),

  // Post-signup email verification — the "verify-email" page's flow.
  verifyAccountOtp: (data: VerifyOtpPayload) =>
    browserApi.post<void>("/user/otp/verify", data),

  // Password-reset OTP check — the "verify-code" page's flow.
  // VerifyForgotPasswordAction (backend) deletes the forgot-password
  // token this call authenticates with and issues a NEW, differently-
  // scoped one (ability "password_reset", not
  // "password_reset_verification") in the response — reset-password only
  // accepts that new token. Confirmed live: reusing the old cookie value
  // 403s "Invalid Token" even though this call itself succeeds. The
  // caller (verify-code/page.tsx) must overwrite its `newToken` cookie
  // with `result.token` before navigating to /reset-password.
  verifyPasswordResetOtp: (data: VerifyOtpPayload) =>
    browserApi.post<VerifyPasswordResetOtpResult>("/user/auth/check-otp", data),

  // Resends an EMAIL_VERIFICATION-type OTP (ResendAccountOtp, backend) —
  // the only resend endpoint that exists. The password-reset ("verify-code")
  // flow calls this same one; ResendAccountOtp hardcodes
  // OtpType::EMAIL_VERIFICATION, not a password-reset type, which is
  // likely wrong for that flow — found, not fixed, since it's a backend
  // action/routing decision, not a transport-migration fix. Documented in
  // docs/ARCHITECTURE.md.
  resendOtp: () => browserApi.post<void>("/user/otp/resend"),

  forgotPassword: (data: ForgotPasswordPayload) =>
    browserApi.post<ForgotPasswordResult>("/user/auth/forgot-password", data),

  resetPassword: (data: ResetPasswordPayload) =>
    browserApi.post<void>("/user/auth/reset-password", data),

  // Generic profile-field editor — one function backing the 6
  // /user/profile/settings/change-* endpoints UpdateModal.tsx already
  // dispatches by url; kept generic rather than 6 near-identical
  // functions since the frontend genuinely treats these as one flow.
  updateProfileField: (url: string, data: unknown) =>
    browserApi.patch<UpdateProfileFieldResult>(url, data),

  changePassword: (data: ChangePasswordPayload) =>
    browserApi.patch<UpdateProfileFieldResult>(
      "/user/profile/settings/change-password",
      data,
    ),

  changeProfileImage: (data: { profile_image: string }) =>
    browserApi.patch<UpdateProfileFieldResult>(
      "/user/profile/settings/change-profile-image",
      data,
    ),

  deleteAccount: (data: DeleteAccountPayload) =>
    browserApi.post<{ user: null }>(
      "/user/profile/settings/delete-account",
      data,
    ),

  getNotificationSettings: () =>
    browserApi.get<AppSettingsResponse>(
      userProfileRoutes.NOTIFICATION_SETTINGS_SHOW,
    ),

  updateNotificationSettings: (data: NotificationSettingsPayload) =>
    browserApi.patch<{ app_settings: unknown }>(
      userProfileRoutes.NOTIFICATION_SETTINGS_UPDATE_ALL_NOTIFICATION,
      data,
    ),

  getSubscription: () =>
    browserApi.get<SubscriptionResponse>(userProfileRoutes.SUBSCRIPTION_SHOW),

  getBillingHistory: () =>
    browserApi.get<BillingHistoryResponse>(
      userProfileRoutes.SUBSCRIPTION_BILLING_HISTORY,
    ),

  changePlan: (data: ChangePlanPayload) =>
    browserApi.post<ChangePlanResult>(
      userProfileRoutes.SUBSCRIPTION_CHANGE_PLAN,
      data,
    ),

  // A single subscription plan's fresh details, fetched by id
  // (PricingCard's "Subscribe" click). SubscriptionResource nests a real
  // `pricing` array inside `subscription` (fixed monthly/yearly entries)
  // plus `has_charge` — settings/plan/page.tsx unwraps
  // `result.subscription.pricing` before handing it to UpgradePlanModal
  // as the `pricing` prop it maps over, so this isn't the single-object-
  // vs-array mismatch it looks like at first glance.
  getSubscriptionPlan: (id: number | string) =>
    browserApi.get<{ subscription: SubscriptionDetail }>(
      buildPath(userSubscriptionRoutes.SHOW, { id }),
    ),

  // The public plan catalog (settings/plan/page.tsx) — loosely typed, same
  // as PricingCard.tsx's own `subscription: any` prop, since the resource
  // isn't otherwise modeled here.
  getSubscriptionPlans: () =>
    browserApi.get<{ subscriptions: unknown[] }>(userSubscriptionRoutes.LIST),
};

export interface SubscriptionDetail {
  id: number | string;
  title: string;
  access_type: string;
  monthly_charge: string;
  yearly_charge: string;
  has_charge: boolean;
  recommended: boolean;
  pricing: {
    type: "monthly" | "yearly";
    amount_minor: number;
    amount: string;
    title: string;
    pay_by: string;
    id: number;
  }[];
  [key: string]: unknown;
}
