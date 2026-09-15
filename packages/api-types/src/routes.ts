// Route path constants — relative to a guard's `/v1/<guard>` base, matching
// the shape @customer-portal/routes uses in the sibling customer-portal
// project (one frozen object per domain, UPPER_SNAKE_CASE keys, plain path
// strings — a route-builder/base-URL concern lives in the consumer, not
// here). Adopted specifically so route strings are never typed by hand at
// call sites — see docs/ARCHITECTURE.md §11, "Query keys are hierarchical
// and produced by factories" applies the same reasoning to paths.
//
// TODO(Phase 2): fold into the same generator as index.ts once
// tooling/generate-api-types exists — these paths already come from the
// same Postman collection that types will be generated from
// (lemonade-backend/postman/Lemonade-API.postman_collection.json), so this
// is hand-written only because the generator isn't built yet, not because
// the domain is exempt from the "generated, never hand-written" rule.
// Every feature domain both apps' Redux slices actually call is covered as
// of 2026-09-11 (auth, events, business, connect, dashboard, settings/profile,
// tribes, transaction, and admin's account/announcements/team/reporting/
// transaction/wallet/user/events/promotions). A handful of call sites were
// deliberately left as raw axiosInstance strings rather than migrated —
// see each domain's features/x/api.ts for the ones that reference a route
// not in the current 290-route backend contract at all, which needs a
// product/backend decision, not a guess. File uploads (still calling
// sharedUtilityRoutes' UPLOAD/UPLOAD_MULTIPLE constants directly from
// component code, not through a service function) and the two apps' OTP/
// password-reset auth sub-flows are the other notable gaps — small, but
// not yet done. This is transport-agnostic: every function below still
// calls the pre-BFF axiosInstance, same as before this pass. Moving to
// @lemonade/api-client + TanStack Query is separate, larger work (Phase 5).

export const userAuthRoutes = Object.freeze({
  LOGIN: "/user/auth/login",
  REGISTER: "/user/auth/register",
  REFRESH: "/user/auth/refresh",
  GOOGLE: "/user/auth/google",
  FORGOT_PASSWORD: "/user/auth/forgot-password",
  CHECK_OTP: "/user/auth/check-otp",
  RESET_PASSWORD: "/user/auth/reset-password",
  // Lives under /user/profile/*, not /user/auth/*, on the backend — kept
  // here anyway so every auth-lifecycle route (sign in, refresh, sign out)
  // has one home instead of splitting logout into a separate routes object
  // for a single entry.
  LOGOUT: "/user/profile/logout",
});

export const adminAuthRoutes = Object.freeze({
  LOGIN: "/admin/auth/login",
  REFRESH: "/admin/auth/refresh",
  LOGOUT: "/admin/auth/logout",
  FORGOT_PASSWORD: "/admin/auth/forgot-password",
  CHECK_OTP: "/admin/auth/check-otp",
  RESET_PASSWORD: "/admin/auth/reset-password",
});

// Only distinct top-level path prefixes get their own constant. Where
// several endpoints just append a different suffix to the same prefix (the
// common case — /user/events/:id/guest-list, /user/events/:id/event-tickets,
// ...), they share ONE constant (BASE below) and the suffix is built once,
// inside the one features/x/api.ts service function that owns that
// endpoint — never re-typed at a UI call site. This mirrors
// customer-portal/src/app/_core/services/api/bankingService.ts, e.g.
// `${bankingRoutes.BENEFICIARIES_ROUTE}/${payload.id}`.
export const userEventRoutes = Object.freeze({
  BASE: "/user/events", // GET (organizer list); + /:id, /:id/guest-list, /:id/:guest_id/guest-details, /:id/:guest_id/check-in, /:id/event-tickets, /:id/edit-tickets, /:id/:promotion_id/event-promotion, /:id/promote-event, /:id/search-guest-list
  ATTENDEES: "/user/events/attendees", // GET; + /:event_id/assign-tickets (POST), /:id/tickets (GET)
  CREATE: "/user/events/create-event",
  UPDATE: "/user/events/update-event", // + /:id
  PUBLISH: "/user/events/publish-event", // + /:id
  SEARCH: "/user/events/search-events",
  GET_PAYMENT_SETTING: "/user/events/get-payment-setting",
  UPDATE_PAYMENT_SETTING: "/user/events/update-payment-setting",
  FILTER: "/user/events/filter-event",
  AFFILIATE: "/user/events/affiliate", // GET; + /data, /:id (GET), /:id/generate-link (POST)
  PROMOTIONS: "/user/events/promotions",
  SEARCH_AFFILIATE_EVENTS: "/user/events/search-affiliate-events",
});

// --- apps/admin route constants below. Every path is prefixed /admin/... ---

// BUG FIX while migrating, not a behavior-preserving extraction: the admin
// dashboard/profile/export slices were calling /admin/dashboard,
// /admin/profile and /admin/export directly — the real backend routes
// (confirmed against the Postman-derived route list, routes/v1/admin/account.php)
// all live under /admin/account/*. These were silently 404ing. Fixed here.
export const adminAccountRoutes = Object.freeze({
  DASHBOARD: "/admin/account/dashboard",
  PROFILE: "/admin/account/profile",
  EXPORT: "/admin/account/export", // ?table=<table>&type=csv
  GET_TABLES: "/admin/account/get-tables",
  CHANGE_PASSWORD: "/admin/account/change-password",
  CHANGE_PROFILE_IMAGE: "/admin/account/change-profile-image",
});

export const adminAnnouncementRoutes = Object.freeze({
  BASE: "/admin/announcement", // GET (list); + /:id (GET)
});

export const userTransactionRoutes = Object.freeze({
  VERIFY: "/user/transaction/verify-transaction",
});

// Lives under /shared/utilities/*, not a guard prefix — reachable from
// either app. See docs/ARCHITECTURE.md §7 on @lemonade/domain/api-types
// being the two-consumer-shared layer.
export const sharedUtilityRoutes = Object.freeze({
  GET_ALL_BANKS: "/shared/utilities/get-all-banks",
  APP_SETTINGS: "/shared/utilities/app-settings",
  UPLOAD: "/shared/utilities/upload",
  UPLOAD_MULTIPLE: "/shared/utilities/upload-multiple",
  VERIFY_ACCOUNT: "/shared/utilities/verify-account",
  TRIBES_CATEGORIES: "/shared/utilities/tribes-categories",
  BUSINESS_CATEGORIES: "/shared/utilities/business-categories",
});

export const adminTeamRoutes = Object.freeze({
  BASE: "/admin/team-members", // GET (list) + POST (create); + /:id (GET), /change-password/:id (PATCH), /delete-admin/:id (DELETE)
  ROLES: "/admin/team-members/roles",
});

export const userBusinessRoutes = Object.freeze({
  BASE: "/user/business", // GET (list); + /:id (GET), /:id/request-service (POST), /jobs/:id/pay (POST), /jobs/:id/mark-completed (POST), /jobs/:id/dispute (POST)
  LISTING: "/user/listing", // GET (list) + POST (create); + /:id (GET/PATCH), /jobs/:id/mark-job (POST), /jobs/:id/request-payment (PATCH), /boost-business/:id (POST)
  JOBS_ALL: "/user/business/jobs/all",
  FILTER: "/user/business/filter-business",
});

export const adminReportRoutes = Object.freeze({
  BASE: "/admin/reports", // GET (list); + /:id (GET/PATCH), /:id/delete-content (PATCH)
});

export const adminTransactionRoutes = Object.freeze({
  BASE: "/admin/transaction",
  PLAN_SUBSCRIPTION: "/admin/transaction/plan-subscription", // GET (list); + /:id (GET)
  WALLET_WITHDRAWALS: "/admin/transaction/wallet-withdrawals",
  WALLET_WITHDRAWAL: "/admin/transaction/wallet-withdrawal", // + /:id
  EVENTS: "/admin/transaction/events",
  EVENT: "/admin/transaction/event", // + /:id
  BOOSTS: "/admin/transaction/boosts",
  SERVICES: "/admin/transaction/services",
  PROMOTIONS: "/admin/transaction/promotions",
  LEDGER: "/admin/transaction/ledger",
});

export const adminWalletRoutes = Object.freeze({
  BASE: "/admin/wallet", // GET (platform wallet); + /user/:id (GET)
  UPDATE_WITHDRAWAL_THRESHOLD: "/admin/wallet/update-withdrawal-threshold",
  USER: "/admin/wallet/user", // + /:id/{add,deduct,withdrawal-request} (PATCH)
});

export const userConnectRoutes = Object.freeze({
  BASE: "/user/connect", // GET (connection info); + /invite-response/:id (POST)
  MESSAGES: "/user/messages", // GET (list) + POST (send, ?receiver_id=); + /chat (GET, ?receiver_id=)
  FIND_USER: "/user/connect/find-user",
  SEND_INVITE: "/user/connect/send-invite",
  GET_INVITES: "/user/connect/get-invites",
  UPDATE_VISIBILITY: "/user/connect/update-visibility",
});

export const userDashboardRoutes = Object.freeze({
  TRIBES: "/user/dashboard/tribes",
  EVENTS: "/user/dashboard/events",
  BUSINESSES: "/user/dashboard/businesses",
});

export const userSettingsRoutes = Object.freeze({
  PROFILE: "/user/profile/user", // GET current user
  CHANGE_PASSWORD: "/user/profile/settings/change-password",
  CHANGE_PROFILE_IMAGE: "/user/profile/settings/change-profile-image",
  WALLET: "/user/profile/wallet", // GET earnings summary + payout history
  REQUEST_PAYOUT: "/user/profile/wallet/request-payout",
  BANK_ACCOUNT_CREATE: "/user/profile/bank-account/create-account",
});

export const userTribeRoutes = Object.freeze({
  BASE: "/user/tribes", // GET (list, ?type=); + /:id (GET), /:id/threads/all (GET), /add-member/:id, /remove-member/:id, /exit-tribe/:id, /change-tribe-type/:id, /:id/members
  CREATE: "/user/tribes/create-tribe",
  SEARCH: "/user/tribes/search-tribe",
  THREADS_VIEW_PROFILE: "/user/threads/view-profile", // + /:id
  THREADS_PINNED: "/user/threads", // + /:id/pinned (GET), /:id/pin-thread (POST), /:id/report-thread (POST), /:id/delete-thread (DELETE), /:tribe_id/:id/post-comment, /:tribe_id/:id/comments, /:thread_id/like-comment/:comment_id
});

export const adminUserRoutes = Object.freeze({
  BASE: "/admin/users", // GET (list); + /:id (GET), /:id/{user-logs,user-tribes,user-events,user-wallet} (GET), /:id/{suspend-user,deactivate-user,reactivate-user} (PATCH)
  AFFILIATES_LOG: "/admin/users/affiliates/log",
  AFFILIATES_DETAIL: "/admin/users/affiliates", // + /:id/detail
});

export const adminEventRoutes = Object.freeze({
  BASE: "/admin/events", // GET (list); + /:id (GET), /:id/{suspend-event,activate-event} (PATCH), /:id/delete-event (DELETE)
  UPDATE_COMMISSION_CHARGE: "/admin/events/update-commission-charge",
  AFFILIATES: "/admin/affiliates",
  PROMOTIONS_QUEUE: "/admin/event-promotions", // distinct from adminPromotionRoutes below — this is the moderation queue for event promotions specifically
});

export const adminPromotionRoutes = Object.freeze({
  BASE: "/admin/promotions", // GET (list) + POST (create); + /:id (GET/PATCH/DELETE)
});
