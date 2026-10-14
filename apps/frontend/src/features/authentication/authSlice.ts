import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { SessionUser } from "./api";

// Session + small client-state slice. Server data that used to live here
// (profile edits, OTP/password-reset, notification settings, subscription
// changes) now goes through features/authentication/{api,queries,mutations}.ts
// on TanStack Query — see docs/ARCHITECTURE.md's Phase 5 status. What's left
// is genuinely client state: the logged-in user snapshot (mirrored from
// useCurrentUserQuery so the ~70 existing `state.auth.user` reads keep
// working), and small UI-only fields (a pending subscription-downgrade
// reason, which plan is mid-selection) that don't belong in a query cache.

interface authState {
  user: SessionUser | null;
  loading: boolean;
  error: boolean;
  authToken: string | null;
  isLoggedIn: boolean;
  subscription: {
    title: string;
    plan_price: string;
    payment_method: string;
    next_billing_date: string;
    id: number;
    benefits?: {
      ver_badge?: boolean;
      forum_creation?: boolean;
      lemon_id?: boolean;
      event_creation?: number;
      sales_commission?: number;
      service_commission?: number;
      connection_range?: string | number;
      offline_benefits?: boolean;
    };
  } | null;
  subscription_id: number | null;
  plan: Record<string, unknown> | null;
  appSettings: Record<string, unknown> | null;
  code: string | null;
  downgradeData: {
    reason?: string;
    sub_id?: number | null;
  };
}

const initialState: authState = {
  user: null,
  loading: false,
  error: false,
  authToken: null,
  isLoggedIn: false,
  subscription: null,
  subscription_id: null,
  plan: null,
  appSettings: null,
  code: null,
  downgradeData: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    authSuccess: (state, action) => {
      state.loading = false;
      state.error = false;
      state.user = action.payload.user;
      state.authToken = action.payload.token;
      state.isLoggedIn = true;
      state.subscription = action.payload.subscription;
    },
    loadStop: (state) => {
      state.loading = false;
    },
    authFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    resetAuth: (state) => {
      state.loading = false;
      state.error = false;
      state.user = null;
      state.authToken = null;
      state.isLoggedIn = false;
    },
    authUser: (state, action) => {
      state.loading = false;
      state.error = false;
      state.user = action.payload.user;
      state.code = action.payload.code;
    },
    // Local flags only apply once a user is loaded.
    updateHasPin: (state) => {
      if (state.user) state.user.hasPin = true;
    },
    updateProfileImage: (state, action: PayloadAction<string>) => {
      if (state.user) state.user.profile_image = action.payload;
    },
    updateCreatedAccount: (state) => {
      if (state.user) state.user.createdAccount = true;
    },
    updateUser: (state, action: PayloadAction<Partial<SessionUser>>) => {
      if (state.user) Object.assign(state.user, action.payload);
    },
    setSubscriptionId: (state, action) => {
      state.subscription_id = action.payload.id;
      state.plan = action.payload.plan;
    },
    changeSubscription: (state, { payload }) => {
      state.subscription = payload;
    },
    changeReason: (state, action: PayloadAction<{ sub_id?: number; reason?: string }>) => {
      if (!state.downgradeData) {
        state.downgradeData = {}; // ensure it's defined
      }
      if (action.payload.sub_id !== undefined) {
        state.downgradeData.sub_id = action.payload.sub_id;
      }
      if (action.payload.reason !== undefined) {
        state.downgradeData.reason = action.payload.reason;
      }
    },
    clearReason: (state) => {
      state.downgradeData = {};
    },
  },
});

export const {
  authStart,
  authSuccess,
  authFailure,
  loadStop,
  resetAuth,
  authUser,
  updateHasPin,
  updateCreatedAccount,
  updateProfileImage,
  updateUser,
  setSubscriptionId,
  changeSubscription,
  changeReason,
  clearReason,
} = authSlice.actions;

export default authSlice.reducer;
