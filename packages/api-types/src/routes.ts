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
// Only the auth domain is covered so far — the rest of the ~290 routes stay
// as string literals at their current call sites until each feature domain
// migrates in Phase 5, same as api-client itself.

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
