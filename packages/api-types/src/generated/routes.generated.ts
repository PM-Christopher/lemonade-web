// GENERATED FILE — do not hand-edit. Run `node tooling/generate-api-types/generate.mjs`.
// Source: lemonade-backend's registered v1/* routes (introspect.php).
//
// Canonical route-constant source for both apps — import from
// "@lemonade/api-types/generated", not the top-level package export.
// See this directory's README.

export const adminAccountRoutes = Object.freeze({
  CHANGE_PASSWORD: "/admin/account/change-password", // PATCH
  CHANGE_PROFILE_IMAGE: "/admin/account/change-profile-image", // PATCH
  DASHBOARD: "/admin/account/dashboard", // GET
  DEVICE_TOKEN: "/admin/account/device-token", // POST
  EXPORT: "/admin/account/export", // GET
  GET_TABLES: "/admin/account/get-tables", // GET
  PROFILE: "/admin/account/profile", // GET
});

export const adminAffiliatesRoutes = Object.freeze({
  LIST: "/admin/affiliates", // GET
  SHOW: "/admin/affiliates/{id}", // GET
});

export const adminAnnouncementRoutes = Object.freeze({
  CREATE: "/admin/announcement", // POST
  LIST: "/admin/announcement", // GET
  SHOW: "/admin/announcement/{id}", // GET
});

export const adminAuthRoutes = Object.freeze({
  CHECK_OTP: "/admin/auth/check-otp", // POST
  FORGOT_PASSWORD: "/admin/auth/forgot-password", // POST
  LOGIN: "/admin/auth/login", // POST
  LOGOUT: "/admin/auth/logout", // POST
  REFRESH: "/admin/auth/refresh", // POST
  RESET_PASSWORD: "/admin/auth/reset-password", // PATCH
});

export const adminBusinessesRoutes = Object.freeze({
  APPROVE: "/admin/businesses/{id}/approve", // PATCH
  DELETE: "/admin/businesses/{id}", // DELETE
  LIST: "/admin/businesses", // GET
  REACTIVATE: "/admin/businesses/{id}/reactivate", // PATCH
  REJECT: "/admin/businesses/{id}/reject", // PATCH
  SHOW: "/admin/businesses/{id}", // GET
  SUSPEND: "/admin/businesses/{id}/suspend", // PATCH
});

export const adminEventPromotionsRoutes = Object.freeze({
  COMPLETED: "/admin/event-promotions/{id}/completed", // PATCH
  LIST: "/admin/event-promotions", // GET
  SCHEDULE: "/admin/event-promotions/{id}/schedule", // POST
  SHOW: "/admin/event-promotions/{id}", // GET
});

export const adminEventsRoutes = Object.freeze({
  ACTIVATE: "/admin/events/{id}/activate-event", // PATCH
  APPROVE: "/admin/events/{id}/approve", // PATCH
  DELETE: "/admin/events/{id}/delete-event", // DELETE
  FILTER: "/admin/events/filter-events", // GET
  LIST: "/admin/events", // GET
  PENDING: "/admin/events/pending", // GET
  REJECT: "/admin/events/{id}/reject", // PATCH
  SEARCH: "/admin/events/search-events", // GET
  SHOW: "/admin/events/{id}", // GET
  SUSPEND: "/admin/events/{id}/suspend-event", // PATCH
  UPDATE_COMMISSION_CHARGE: "/admin/events/update-commission-charge", // PATCH
});

export const adminModerationRoutes = Object.freeze({
  CONTENT_DELETE: "/admin/moderation/content/{type}/{id}", // DELETE
  CONTENT_LIST: "/admin/moderation/content/{type}", // GET
  CONTENT_RESTORE: "/admin/moderation/content/{type}/{id}/restore", // PATCH
  CONTENT_SHOW: "/admin/moderation/content/{type}/{id}", // GET
  FORUMS_STATUS: "/admin/moderation/forums/{id}/status", // PATCH
  QUEUE: "/admin/moderation/queue", // GET
});

export const adminPageContentRoutes = Object.freeze({
  SAVE: "/admin/page-content", // POST
  SHOW: "/admin/page-content", // GET
});

export const adminPromotionsRoutes = Object.freeze({
  CREATE: "/admin/promotions", // POST
  DELETE: "/admin/promotions/{id}", // DELETE
  LIST: "/admin/promotions", // GET
  SHOW: "/admin/promotions/{id}", // GET
  UPDATE: "/admin/promotions/{id}", // PATCH
});

export const adminReportsRoutes = Object.freeze({
  DELETE_CONTENT: "/admin/reports/{id}/delete-content", // PATCH
  LIST: "/admin/reports", // GET
  MARK_COMPLETED: "/admin/reports/{id}", // PATCH
  SHOW: "/admin/reports/{id}", // GET
});

export const adminSubscriptionsRoutes = Object.freeze({
  ACTIVATE: "/admin/subscriptions/{id}/activate", // PATCH
  DEACTIVATE: "/admin/subscriptions/{id}/deactivate", // PATCH
  DESTROY: "/admin/subscriptions/{id}", // DELETE
  LIST: "/admin/subscriptions", // GET
  OVERVIEW: "/admin/subscriptions/overview", // GET
  STORE: "/admin/subscriptions", // POST
  SUBSCRIBERS: "/admin/subscriptions/{id}/subscribers", // GET
  UPDATE: "/admin/subscriptions/{id}", // PATCH
});

export const adminTeamMembersRoutes = Object.freeze({
  CHANGE_PASSWORD: "/admin/team-members/change-password/{id}", // PATCH
  CREATE: "/admin/team-members", // POST
  DELETE: "/admin/team-members/delete-admin/{id}", // DELETE
  LIST: "/admin/team-members", // GET
  ROLES: "/admin/team-members/roles", // GET
  SHOW: "/admin/team-members/{id}", // GET
});

export const adminTransactionRoutes = Object.freeze({
  BOOSTS: "/admin/transaction/boosts", // GET
  EVENT: "/admin/transaction/event/{id}", // GET
  EVENTS: "/admin/transaction/events", // GET
  LEDGER: "/admin/transaction/ledger", // GET
  LIST: "/admin/transaction", // GET
  PROMOTIONS: "/admin/transaction/promotions", // GET
  SERVICES: "/admin/transaction/services", // GET
  SUBSCRIPTION: "/admin/transaction/plan-subscription/{id}", // GET
  SUBSCRIPTIONS: "/admin/transaction/plan-subscription", // GET
  WALLET_WITHDRAWAL: "/admin/transaction/wallet-withdrawal/{id}", // GET
  WALLET_WITHDRAWALS: "/admin/transaction/wallet-withdrawals", // GET
});

export const adminTribesRoutes = Object.freeze({
  ADD_THREAD: "/admin/tribes/{id}/add-thread", // POST
  CREATE: "/admin/tribes/create-tribe", // POST
  DELETE: "/admin/tribes/{id}", // DELETE
  DELETE_THREAD: "/admin/tribes/{id}/delete-thread", // DELETE
  LIST: "/admin/tribes", // GET
  REACTIVATE: "/admin/tribes/{id}/reactivate-tribe", // PATCH
  REMOVE_MEMBER: "/admin/tribes/{id}/remove-user/{user_id}", // DELETE
  RESTRICT: "/admin/tribes/{id}/restrict-tribe", // PATCH
  SHOW: "/admin/tribes/{id}", // GET
});

export const adminUsersRoutes = Object.freeze({
  ACCOUNT_PLAN: "/admin/users/{id}/account-plan", // GET
  AFFILIATES_DETAIL: "/admin/users/affiliates/{id}/detail", // GET
  AFFILIATES_LOG: "/admin/users/affiliates/log", // GET
  CANCEL_PLAN: "/admin/users/{id}/cancel-plan", // PATCH
  CHANGE_PLAN: "/admin/users/{id}/change-plan", // PATCH
  DEACTIVATE: "/admin/users/{id}/deactivate-user", // PATCH
  EVENTS: "/admin/users/{id}/user-events", // GET
  LIST: "/admin/users", // GET
  LOGS: "/admin/users/{id}/user-logs", // GET
  REACTIVATE: "/admin/users/{id}/reactivate-user", // PATCH
  SHOW: "/admin/users/{id}", // GET
  SUSPEND: "/admin/users/{id}/suspend-user", // PATCH
  TRIBE: "/admin/users/{id}/user-tribe/{tribe_id}", // GET
  TRIBES: "/admin/users/{id}/user-tribes", // GET
  WALLET: "/admin/users/{id}/user-wallet", // GET
});

export const adminUtilitiesRoutes = Object.freeze({
  UPLOAD: "/admin/utilities/upload", // POST
  UPLOAD_MULTIPLE: "/admin/utilities/upload-multiple", // POST
});

export const adminWalletRoutes = Object.freeze({
  DASHBOARD: "/admin/wallet", // GET
  UPDATE_WITHDRAWAL_THRESHOLD: "/admin/wallet/update-withdrawal-threshold", // PATCH
  USER_ADD: "/admin/wallet/user/{id}/add", // PATCH
  USER_DEDUCT: "/admin/wallet/user/{id}/deduct", // PATCH
  USER_SHOW: "/admin/wallet/user/{id}", // GET
  USER_WITHDRAWAL_REQUEST: "/admin/wallet/user/{id}/withdrawal-request", // PATCH
  WITHDRAWALS_RETRY: "/admin/wallet/withdrawals/{id}/retry", // PATCH
});

export const sharedPaymentRoutes = Object.freeze({
  PAYSTACK_WEBHOOK: "/shared/payment/paystack/webhook", // POST
  VERIFY: "/shared/payment/verify", // POST
});

export const sharedUtilitiesRoutes = Object.freeze({
  ALL_BANKS: "/shared/utilities/get-all-banks", // GET
  APP_SETTINGS: "/shared/utilities/app-settings", // GET
  ATTENDEE_DATA: "/shared/utilities/attendee-data", // GET
  BUSINESS_CATEGORIES: "/shared/utilities/business-categories", // GET
  EVENT_CATEGORIES: "/shared/utilities/event-categories", // GET
  FIND_USER: "/shared/utilities/get-user", // GET
  GENERATE_QR_CODE: "/shared/utilities/generate-qr-code", // POST
  INDUSTRIES: "/shared/utilities/get-industries", // GET
  SEND_PUSH_NOTIFICATION: "/shared/utilities/send-push-notification", // POST
  TAGS: "/shared/utilities/get-tags", // GET
  TEST_PUSH_NOTIFICATION: "/shared/utilities/test-push-notification", // POST
  TRIBES_CATEGORIES: "/shared/utilities/tribes-categories", // GET
  UPLOAD: "/shared/utilities/upload", // POST
  UPLOAD_MULTIPLE: "/shared/utilities/upload-multiple", // POST
  VERIFY_ACCOUNT: "/shared/utilities/verify-account", // POST
});

export const userAuthRoutes = Object.freeze({
  CHECK_OTP: "/user/auth/check-otp", // POST
  FORGOT_PASSWORD: "/user/auth/forgot-password", // POST
  GOOGLE: "/user/auth/google", // POST
  LOGIN: "/user/auth/login", // POST
  REFRESH: "/user/auth/refresh", // POST
  REGISTER: "/user/auth/register", // POST
  RESET_PASSWORD: "/user/auth/reset-password", // POST
});

export const userBusinessRoutes = Object.freeze({
  BOOST: "/user/business/{id}/boost-business", // POST
  FILTER: "/user/business/filter-business", // GET
  JOBS_COMPLETED: "/user/business/jobs/completed", // GET
  JOBS_DISPUTE: "/user/business/jobs/{id}/dispute", // POST
  JOBS_IN_PROGRESS: "/user/business/jobs/in-progress", // GET
  JOBS_LIST: "/user/business/jobs/all", // GET
  JOBS_MARK: "/user/business/jobs/{id}/mark-job", // POST
  JOBS_MARK_COMPLETED: "/user/business/jobs/{id}/mark-completed", // POST
  JOBS_PAY: "/user/business/jobs/{id}/pay", // POST
  JOBS_REVIEW: "/user/business/jobs/{id}/review", // POST
  JOBS_SENT_OFFERS: "/user/business/jobs/sent-offers", // GET
  JOBS_SHOW: "/user/business/jobs/job/{id}", // GET
  LIST: "/user/business", // GET
  REQUEST_SERVICE: "/user/business/{id}/request-service", // POST
  REVIEWS: "/user/business/{id}/business-reviews", // GET
  SHOW: "/user/business/{id}", // GET
  WRITE_REVIEW: "/user/business/{id}/write-review", // POST
});

export const userConnectRoutes = Object.freeze({
  FIND_USER: "/user/connect/find-user", // GET
  INDEX: "/user/connect", // GET
  INVITES_LIST: "/user/connect/get-invites", // GET
  INVITES_RESPOND: "/user/connect/invite-response/{id}", // POST
  INVITES_SEND: "/user/connect/send-invite", // POST
  INVITES_SHOW: "/user/connect/get-invite/{id}", // GET
  UPDATE_LOCATION: "/user/connect/update-location", // PATCH
  UPDATE_VISIBILITY: "/user/connect/update-visibility", // PATCH
});

export const userDashboardRoutes = Object.freeze({
  BUSINESSES: "/user/dashboard/businesses", // GET
  EVENTS: "/user/dashboard/events", // GET
  TRIBES: "/user/dashboard/tribes", // GET
});

export const userEventsRoutes = Object.freeze({
  AFFILIATE_DATA: "/user/events/affiliate/data", // GET
  AFFILIATE_GENERATE_LINK: "/user/events/affiliate/{id}/generate-link", // POST
  AFFILIATE_LIST: "/user/events/affiliate", // GET
  AFFILIATE_SHOW: "/user/events/affiliate/{id}", // GET
  ATTENDEES_ASSIGN_TICKETS: "/user/events/attendees/{id}/assign-tickets", // POST
  ATTENDEES_LIST: "/user/events/attendees", // GET
  ATTENDEES_MY_TICKET: "/user/events/attendees/my-ticket/{id}", // GET
  ATTENDEES_MY_TICKETS: "/user/events/attendees/my-tickets", // GET
  ATTENDEES_TICKETS: "/user/events/attendees/{id}/tickets", // GET
  CHECK_IN: "/user/events/{id}/{guest_id}/check-in", // PATCH
  CREATE: "/user/events/create-event", // POST
  DELETE: "/user/events/delete-event/{id}", // DELETE
  EDIT_TICKETS: "/user/events/{id}/edit-tickets", // PATCH
  EVENT_PROMOTION: "/user/events/{id}/{promo_id}/event-promotion", // GET
  EVENT_TICKETS: "/user/events/{id}/event-tickets", // GET
  FILTER: "/user/events/filter-event", // GET
  GUEST_DETAILS: "/user/events/{id}/{guest_id}/guest-details", // GET
  GUEST_LIST: "/user/events/{id}/guest-list", // GET
  LIST: "/user/events", // GET
  PAYMENT_SETTING_SHOW: "/user/events/get-payment-setting", // GET
  PAYMENT_SETTING_UPDATE: "/user/events/update-payment-setting", // PATCH
  PROMOTE: "/user/events/{id}/promote-event", // POST
  PROMOTIONS: "/user/events/promotions", // GET
  PUBLISH: "/user/events/publish-event/{id}", // PATCH
  SEARCH: "/user/events/search-events", // POST
  SEARCH_AFFILIATE: "/user/events/search-affiliate-events", // POST
  SEARCH_GUEST_LIST: "/user/events/{id}/search-guest-list", // POST
  SHOW: "/user/events/{id}", // GET
  UPDATE: "/user/events/update-event/{id}", // PUT
});

export const userForumRoutes = Object.freeze({
  ADD_MEMBER: "/user/forum/add-member/{forum_id}", // POST
  CREATE: "/user/forum/create-forum", // POST
  JOIN: "/user/forum/join-forum/{forum_id}", // POST
  LIST: "/user/forum", // GET
  REMOVE_MEMBER: "/user/forum/remove-member/{forum_id}", // DELETE
  SHOW: "/user/forum/{id}", // GET
  THREADS_CREATE: "/user/forum/{forum}/threads/create-thread", // POST
  THREADS_LIST: "/user/forum/{forum}/threads/all", // GET
  THREADS_SHOW: "/user/forum/{forum}/threads/{thread}", // GET
});

export const userListingRoutes = Object.freeze({
  BOOST: "/user/listing/boost-business/{id}", // POST
  BOOSTS: "/user/listing/boosts", // GET
  CREATE: "/user/listing", // POST
  DELETE: "/user/listing/{id}", // DELETE
  JOB_DATA: "/user/listing/{id}/job-data", // GET
  JOBS_DISPUTE: "/user/listing/jobs/{id}/dispute", // POST
  JOBS_MARK: "/user/listing/jobs/{id}/mark-job", // POST
  JOBS_REQUEST_PAYMENT: "/user/listing/jobs/{id}/request-payment", // PATCH
  JOBS_SHOW: "/user/listing/jobs/job/{id}", // GET
  LIST: "/user/listing", // GET
  SHOW: "/user/listing/{id}", // GET
  UPDATE: "/user/listing/{id}", // PATCH
});

export const userMessagesRoutes = Object.freeze({
  CHAT: "/user/messages/chat", // GET
  HISTORY: "/user/messages", // GET
  SEND: "/user/messages", // POST
  TYPING: "/user/messages/typing", // POST
});

export const userNotificationRoutes = Object.freeze({
  LIST: "/user/notification", // GET
  SHOW: "/user/notification/{id}", // GET
});

export const userOtpRoutes = Object.freeze({
  RESEND: "/user/otp/resend", // POST
  VERIFY: "/user/otp/verify", // POST
});

export const userProfileRoutes = Object.freeze({
  ADDRESS_SET_UP: "/user/profile/address-set-up", // POST
  BANK_ACCOUNT_CREATE: "/user/profile/bank-account/create-account", // POST
  BANK_ACCOUNT_SHOW: "/user/profile/bank-account", // GET
  BANK_ACCOUNT_UPDATE: "/user/profile/bank-account/update-account", // PATCH
  LOGOUT: "/user/profile/logout", // POST
  NOTIFICATION_SETTINGS_DEVICE_TOKEN: "/user/profile/notification-settings/device-token", // POST
  NOTIFICATION_SETTINGS_SHOW: "/user/profile/notification-settings", // GET
  NOTIFICATION_SETTINGS_UPDATE_ALL_NOTIFICATION:
    "/user/profile/notification-settings/update-all-notification", // PATCH
  NOTIFICATION_SETTINGS_UPDATE_PUSH_NOTIFICATION:
    "/user/profile/notification-settings/update-push-notification", // PATCH
  PROFILE_SET_UP: "/user/profile/profile-set-up", // POST
  REFERRAL_ACTIVITY: "/user/profile/referral/referral-activity", // GET
  REFERRAL_SHOW: "/user/profile/referral", // GET
  SETTINGS_CHANGE_ADDRESS: "/user/profile/settings/change-address", // PATCH
  SETTINGS_CHANGE_BIO: "/user/profile/settings/change-bio", // PATCH
  SETTINGS_CHANGE_PASSWORD: "/user/profile/settings/change-password", // PATCH
  SETTINGS_CHANGE_PROFESSION: "/user/profile/settings/change-profession", // PATCH
  SETTINGS_CHANGE_PROFILE_IMAGE: "/user/profile/settings/change-profile-image", // PATCH
  SETTINGS_CHANGE_SKILLS: "/user/profile/settings/change-skills", // PATCH
  SETTINGS_CHANGE_SOCIALS: "/user/profile/settings/change-socials", // PATCH
  SETTINGS_CHANGE_USERNAME: "/user/profile/settings/change-username", // PATCH
  SETTINGS_DELETE_ACCOUNT: "/user/profile/settings/delete-account", // POST
  SETTINGS_REQUEST_ACCOUNT_DELETION: "/user/profile/settings/request-account-deletion", // POST
  SETTINGS_VERIFY_ACCOUNT_DELETION: "/user/profile/settings/verify-account-deletion", // POST
  SHOW: "/user/profile/user", // GET
  SKILLS_SET_UP: "/user/profile/skills-set-up", // POST
  SOCIALS_SET_UP: "/user/profile/socials-set-up", // POST
  SUBSCRIPTION_BILLING_HISTORY: "/user/profile/subscription/billing-history", // GET
  SUBSCRIPTION_CANCEL: "/user/profile/subscription/cancel", // POST
  SUBSCRIPTION_CHANGE_PLAN: "/user/profile/subscription/change-plan", // POST
  SUBSCRIPTION_RENEW: "/user/profile/subscription/renew", // POST
  SUBSCRIPTION_RESUME: "/user/profile/subscription/resume", // POST
  SUBSCRIPTION_SHOW: "/user/profile/subscription", // GET
  WALLET_REQUEST_PAYOUT: "/user/profile/wallet/request-payout", // POST
  WALLET_SHOW: "/user/profile/wallet", // GET
});

export const userSubscriptionRoutes = Object.freeze({
  LIST: "/user/subscription", // GET
  SHOW: "/user/subscription/{id}", // GET
});

export const userThreadsRoutes = Object.freeze({
  COMMENTS: "/user/threads/{tribe_id}/{id}/comments", // GET
  DELETE: "/user/threads/{id}/delete-thread", // DELETE
  LIKE_COMMENT: "/user/threads/{thread_id}/like-comment/{comment_id}", // POST
  PIN: "/user/threads/{id}/pin-thread", // POST
  PINNED: "/user/threads/{id}/pinned", // GET
  POLL_ACTION: "/user/threads/{tribe_id}/{thread_id}/{poll_id}/poll-action", // POST
  POST_COMMENT: "/user/threads/{tribe_id}/{id}/post-comment", // POST
  POST_LIKE: "/user/threads/{tribe_id}/{id}/post-like", // POST
  REPORT: "/user/threads/{id}/report-thread", // POST
  VIEW_PROFILE: "/user/threads/view-profile/{id}", // GET
});

export const userTransactionRoutes = Object.freeze({
  VERIFY: "/user/transaction/verify-transaction", // POST
});

export const userTribesRoutes = Object.freeze({
  ADD_MEMBER: "/user/tribes/add-member/{id}", // POST
  CHANGE_TYPE: "/user/tribes/change-tribe-type/{id}", // PATCH
  CREATE: "/user/tribes/create-tribe", // POST
  EXIT: "/user/tribes/exit-tribe/{id}", // DELETE
  JOIN: "/user/tribes/join-tribe/{id}", // POST
  LIST: "/user/tribes", // GET
  MEMBERS: "/user/tribes/{id}/members", // GET
  REMOVE_MEMBER: "/user/tribes/remove-member/{id}", // DELETE
  SEARCH: "/user/tribes/search-tribe", // POST
  SHOW: "/user/tribes/{id}", // GET
  THREADS_CREATE: "/user/tribes/{forum}/threads/create-thread", // POST
  THREADS_LIST: "/user/tribes/{forum}/threads/all", // GET
  THREADS_SHOW: "/user/tribes/{forum}/threads/{thread}", // GET
  THREADS_SORT: "/user/tribes/{forum}/threads/sort-thread", // POST
});

export const userWalletRoutes = Object.freeze({
  AFFILIATE_HISTORY: "/user/wallet/affiliate-history", // GET
  EARNINGS: "/user/wallet/earnings", // GET
  REFERRAL_HISTORY: "/user/wallet/referral-history", // GET
  TRIBE_HISTORY: "/user/wallet/tribe-history", // GET
});
