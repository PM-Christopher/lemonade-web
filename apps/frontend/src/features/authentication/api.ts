// Auth endpoints: login/logout hit local BFF routes; other reads use browserApi.
import { browserApi } from "@/lib/browser-api";
import {
  userAuthRoutes,
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

export interface CurrentUser {
  id: string | number;
  email: string;
  fullname: string;
  username: string | null;
  status?: number;
  email_verified?: boolean;
  [key: string]: unknown;
}

/** Token plus user returned by signup, Google sign-in and the final onboarding step. */
export interface AuthTokenResult {
  user: CurrentUser;
  token: string;
  token_type: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResult {
  user: CurrentUser;
  needsOnboarding?: boolean;
  token?: string; // Present during unfinished onboarding only.
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
  register: (data: SignUpRequest) =>
    browserApi.post<AuthTokenResult>(userAuthRoutes.REGISTER, data),

  googleAuth: (token: string) => browserApi.post<AuthTokenResult>(userAuthRoutes.GOOGLE, { token }),

  // Onboarding steps, authorized by the onboarding cookie the BFF forwards.
  profileSetUp: (data: ProfileSetupRequest) =>
    browserApi.post<unknown>(userProfileRoutes.PROFILE_SET_UP, data),

  addressSetUp: (data: AddressRequest) =>
    browserApi.post<unknown>(userProfileRoutes.ADDRESS_SET_UP, data),

  skillsSetUp: (data: SkillsAndInterestsRequest) =>
    browserApi.post<unknown>(userProfileRoutes.SKILLS_SET_UP, data),

  socialsSetUp: (data: SocialsRequest) =>
    browserApi.post<AuthTokenResult>(userProfileRoutes.SOCIALS_SET_UP, data),

  login: (payload: LoginPayload) => postJson<LoginResult>("/api/auth/login", payload),
  logout: () => postJson<void>("/api/auth/logout"),
  getCurrentUser: () => browserApi.get<CurrentUser>(userProfileRoutes.SHOW),

  // Verify-email OTP.
  verifyAccountOtp: (data: VerifyOtpPayload) => browserApi.post<void>("/user/otp/verify", data),

  // Password-reset OTP; save `result.token` before going to reset-password.
  verifyPasswordResetOtp: (data: VerifyOtpPayload) =>
    browserApi.post<VerifyPasswordResetOtpResult>("/user/auth/check-otp", data),

  // Resend account OTP (also used by the password-reset verify screen today).
  resendOtp: () => browserApi.post<void>("/user/otp/resend"),

  forgotPassword: (data: ForgotPasswordPayload) =>
    browserApi.post<ForgotPasswordResult>("/user/auth/forgot-password", data),

  resetPassword: (data: ResetPasswordPayload) =>
    browserApi.post<void>("/user/auth/reset-password", data),

  // Shared helper for the profile settings change-* endpoints.
  updateProfileField: (url: string, data: unknown) =>
    browserApi.patch<UpdateProfileFieldResult>(url, data),

  changePassword: (data: ChangePasswordPayload) =>
    browserApi.patch<UpdateProfileFieldResult>("/user/profile/settings/change-password", data),

  changeProfileImage: (data: { profile_image: string }) =>
    browserApi.patch<UpdateProfileFieldResult>("/user/profile/settings/change-profile-image", data),

  deleteAccount: (data: DeleteAccountPayload) =>
    browserApi.post<{ user: null }>("/user/profile/settings/delete-account", data),

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
