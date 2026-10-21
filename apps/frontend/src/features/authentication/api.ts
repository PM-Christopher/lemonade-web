// Auth endpoints: login/logout hit local BFF routes; other reads use browserApi.
import { createApiClient } from "@lemonade/api-client";
import { browserApi } from "@/lib/browser-api";
import { rememberApiMessage } from "@/lib/api-message";
import {
  userAuthRoutes,
  userOtpRoutes,
  userProfileRoutes,
  userSubscriptionRoutes,
  buildPath,
} from "@lemonade/api-types/generated";
import type {
  AddressRequest,
  ProfileSetupRequest,
  SignUpRequest,
  SkillsAndInterestsRequest,
  SocialsRequest,
} from "@lemonade/api-types/generated";

export interface UserAddress {
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
}

export interface UserSocial {
  name: string;
  value: string;
}

/** The signed-in user, as the backend's UserResource returns it, plus client-only flags. */
export interface SessionUser {
  id: string;
  fullname: string;
  email: string;
  username: string | null;
  referred_by?: string | null;
  lemon_id?: string | null;
  bio?: string | null;
  industry?: string | null;
  profile_image?: string | null;
  status?: number;
  verified?: boolean;
  email_verified?: boolean;
  skills?: string[];
  interests?: string[];
  socials?: UserSocial[];
  address?: UserAddress | null;
  referral_code?: string | null;
}

export type CurrentUser = SessionUser;

/** Token plus user returned by signup (the token is the onboarding token). */
export interface AuthTokenResult {
  user: CurrentUser;
  token: string;
  token_type: string;
}

export interface GoogleAuthPayload {
  token: string;
  /** Sent once, to link Google to an email/password account. */
  password?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/** A finished account gets a server-side session; an unfinished one gets its onboarding token. */
export type LoginResult =
  | { user: CurrentUser; needsOnboarding?: false }
  | { user: CurrentUser; needsOnboarding: true; token: string; token_type?: string };

// Same-origin /api/auth/* Route Handlers that own the httpOnly session cookies.
const authBff = createApiClient({ baseURL: "/api/auth", onSuccessMessage: rememberApiMessage });

// Pre-login flows; the BFF sends the onboarding cookie as the bearer token.
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

// Account deletion needs a dedicated OTP token and UI; not wired end-to-end yet.
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

// Free-plan changes return `subscription`; paid changes return `payment` / `reference`.
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

// Matches RegisterDeviceTokenRequest on the backend.
export interface RegisterDeviceTokenPayload {
  device_token: string;
  device_type?: string | null;
  platform?: string | null;
}

export interface SubscriptionBenefits {
  verification_badge: boolean;
  tribe_creation: boolean;
  business_listing?: boolean;
  lemon_id: boolean;
  event_creation: number;
  ticket_sales_commission: number;
  service_commission: number;
  connection_range: string | number;
  offline_benefits: boolean;
}

export interface SubscriptionSummary {
  title: string;
  payment_method: string;
  plan_price: string;
  next_billing_date: string;
  is_member?: boolean;
}

export interface SubscriptionResponse {
  subscription: SubscriptionSummary & { benefits: SubscriptionBenefits };
}

// The shape the plan pages read from Redux (state.auth.subscription).
export function toSubscriptionState(response: SubscriptionResponse) {
  const { benefits, ...summary } = response.subscription;
  return {
    ...summary,
    id: 0,
    benefits: {
      ver_badge: benefits.verification_badge,
      forum_creation: benefits.tribe_creation,
      business_listing: benefits.business_listing,
      lemon_id: benefits.lemon_id,
      event_creation: benefits.event_creation,
      sales_commission: benefits.ticket_sales_commission,
      service_commission: benefits.service_commission,
      connection_range: benefits.connection_range,
      offline_benefits: benefits.offline_benefits,
    },
  };
}

export interface BillingHistoryItem {
  title: string;
  // Naira, e.g. "5000.00"; amount_minor is the same in kobo.
  amount: string;
  amount_minor: number;
  created_at: string;
}

export interface BillingPlan extends SubscriptionSummary {
  plan_price_amount: string;
  plan_price_minor: number;
  billing_cycle: "month" | "year";
}

export interface BillingHistoryResponse {
  plan: BillingPlan;
  histories: BillingHistoryItem[];
}

export const authApi = {
  register: (data: SignUpRequest) =>
    browserApi.post<AuthTokenResult>(userAuthRoutes.REGISTER, data),

  // The BFF stores the session for finished accounts and only returns a token mid-onboarding.
  googleAuth: (payload: GoogleAuthPayload) => authBff.post<LoginResult>("/google", payload),

  // Onboarding steps, authorized by the onboarding cookie the BFF forwards.
  profileSetUp: (data: ProfileSetupRequest) =>
    browserApi.post<unknown>(userProfileRoutes.PROFILE_SET_UP, data),

  addressSetUp: (data: AddressRequest) =>
    browserApi.post<unknown>(userProfileRoutes.ADDRESS_SET_UP, data),

  skillsSetUp: (data: SkillsAndInterestsRequest) =>
    browserApi.post<unknown>(userProfileRoutes.SKILLS_SET_UP, data),

  // Last onboarding step; the BFF turns it into a full session.
  completeOnboarding: (data: SocialsRequest) =>
    authBff.post<{ user: CurrentUser }>("/complete-onboarding", data),

  login: (payload: LoginPayload) => authBff.post<LoginResult>("/login", payload),
  logout: () => authBff.post<void>("/logout"),
  getCurrentUser: () => browserApi.get<CurrentUser>(userProfileRoutes.SHOW),

  // Verify-email OTP.
  verifyAccountOtp: (data: VerifyOtpPayload) => browserApi.post<void>(userOtpRoutes.VERIFY, data),

  // Password-reset OTP; save `result.token` before going to reset-password.
  verifyPasswordResetOtp: (data: VerifyOtpPayload) =>
    browserApi.post<VerifyPasswordResetOtpResult>(userAuthRoutes.CHECK_OTP, data),

  // Resend account OTP (also used by the password-reset verify screen today).
  resendOtp: () => browserApi.post<void>(userOtpRoutes.RESEND),

  forgotPassword: (data: ForgotPasswordPayload) =>
    browserApi.post<ForgotPasswordResult>(userAuthRoutes.FORGOT_PASSWORD, data),

  resetPassword: (data: ResetPasswordPayload) =>
    browserApi.post<void>(userAuthRoutes.RESET_PASSWORD, data),

  // Shared helper for the profile settings change-* endpoints.
  updateProfileField: (url: string, data: unknown) =>
    browserApi.patch<UpdateProfileFieldResult>(url, data),

  changePassword: (data: ChangePasswordPayload) =>
    browserApi.patch<UpdateProfileFieldResult>(userProfileRoutes.SETTINGS_CHANGE_PASSWORD, data),

  changeProfileImage: (data: { profile_image: string }) =>
    browserApi.patch<UpdateProfileFieldResult>(
      userProfileRoutes.SETTINGS_CHANGE_PROFILE_IMAGE,
      data,
    ),

  deleteAccount: (data: DeleteAccountPayload) =>
    browserApi.post<{ user: null }>(userProfileRoutes.SETTINGS_DELETE_ACCOUNT, data),

  getNotificationSettings: () =>
    browserApi.get<AppSettingsResponse>(userProfileRoutes.NOTIFICATION_SETTINGS_SHOW),

  updateNotificationSettings: (data: NotificationSettingsPayload) =>
    browserApi.patch<{ app_settings: unknown }>(
      userProfileRoutes.NOTIFICATION_SETTINGS_UPDATE_ALL_NOTIFICATION,
      data,
    ),

  // Register the browser FCM token (needs a full signed-in session).
  registerDeviceToken: (data: RegisterDeviceTokenPayload) =>
    browserApi.post<{ device_token: unknown }>(
      userProfileRoutes.NOTIFICATION_SETTINGS_DEVICE_TOKEN,
      data,
    ),

  getSubscription: () => browserApi.get<SubscriptionResponse>(userProfileRoutes.SUBSCRIPTION_SHOW),

  getBillingHistory: () =>
    browserApi.get<BillingHistoryResponse>(userProfileRoutes.SUBSCRIPTION_BILLING_HISTORY),

  changePlan: (data: ChangePlanPayload) =>
    browserApi.post<ChangePlanResult>(userProfileRoutes.SUBSCRIPTION_CHANGE_PLAN, data),

  // One plan by id (pricing lives under `subscription.pricing`).
  getSubscriptionPlan: (id: number | string) =>
    browserApi.get<{ subscription: SubscriptionDetail }>(
      buildPath(userSubscriptionRoutes.SHOW, { id }),
    ),

  // Public subscription plan list.
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
