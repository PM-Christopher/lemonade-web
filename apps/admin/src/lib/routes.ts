/** In-app routes for the admin console — use instead of path string literals. */
export const routes = {
  HOME: "/",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY_CODE: "/verify-code",
  RESET_PASSWORD: "/reset-password",
  PROFILE: "/profile",
  PROFILE_SETUP: "/profile-setup",

  USERS: "/users",
  USER_DETAIL: (id: string | number) => `/users/${id}` as const,
  USER_AFFILIATE: (id: string | number) => `/users/affiliate/${id}` as const,

  TRIBES: "/tribes",
  TRIBE_DETAIL: (id: string | number) => `/tribes/${id}` as const,

  EVENTS: "/events",
  EVENT_DETAIL: (id: string | number) => `/events/${id}` as const,
  EVENT_PROMOTIONS: (id: string | number) => `/events/${id}/promotions` as const,
  EVENT_AFFILIATES: (id: string | number) => `/events/${id}/affiliates` as const,
  EVENTS_ADD_PROMOTIONS: "/events/add-promotions",

  BUSINESSES: "/businesses",
  BUSINESS_DETAIL: (id: string | number) => `/businesses/${id}` as const,
  DISPUTES: "/disputes",
  DISPUTE_DETAIL: (id: string | number) => `/disputes/${id}` as const,

  TRANSACTIONS: "/transactions",
  TRANSACTION_WALLET: (id: string | number) => `/transactions/${id}/wallet-details` as const,
  TRANSACTION_EVENT: (id: string | number) => `/transactions/${id}/event-details` as const,
  TRANSACTION_SUBSCRIPTION: (id: string | number) =>
    `/transactions/${id}/subscription-details` as const,
  TRANSACTION_PROMOTION: (id: string | number) => `/transactions/${id}/promotion-details` as const,
  TRANSACTION_BOOSTING: (id: string | number) => `/transactions/${id}/boosting-details` as const,
  TRANSACTION_SERVICE: (id: string | number) => `/transactions/${id}/service-details` as const,
  TRANSACTION_TRIBE: (id: string | number) => `/transactions/${id}/tribe-details` as const,

  WALLET_MANAGEMENT: "/wallet-management",
  WALLET_DETAIL: (id: string | number) => `/wallet-management/${id}` as const,

  SUBSCRIPTIONS: "/subscriptions",
  FORUM: "/forum",
  TEAM: "/team",
  TEAM_DETAIL: (id: string | number) => `/team/${id}` as const,
  REPORTING: "/reporting",
  REPORTING_DETAIL: (id: string | number) => `/reporting/${id}` as const,
  ANNOUNCEMENTS: "/announcements",
  ANNOUNCEMENT_DETAIL: (id: string | number) => `/announcements/${id}` as const,
} as const;
