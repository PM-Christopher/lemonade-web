import { createSlice } from "@reduxjs/toolkit";
import { UserInterface } from "@/interfaces/SystemInterface";
import type { CurrentAdmin } from "./api";

interface authState {
  user: UserInterface | null;
  loading: boolean;
  error: boolean;
  authToken: string | null;
  admin: CurrentAdmin | null;
  adminToken: string | null;
  isLoggedIn: boolean;
  plan: Record<string, unknown> | null;
}

const initialState: authState = {
  user: null,
  admin: null,
  adminToken: null,
  loading: false,
  error: false,
  authToken: null,
  isLoggedIn: false,
  plan: null,
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
      state.user = action.payload.admin;
      state.authToken = action.payload.token;
      state.isLoggedIn = true;
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
      state.admin = null;
    },
    authUser: (state, action) => {
      state.loading = false;
      state.error = false;
      state.user = action.payload.user;
    },
    updateHasPin: () => {},
    updateProfileImage: () => {},
    updateCreatedAccount: () => {},
    adminUser: (state, action) => {
      state.loading = false;
      state.error = false;
      state.admin = action.payload;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    setSubscriptionId: (state, action) => {
      state.plan = action.payload.plan;
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
  adminUser,
  updateProfileImage,
  updateUser,
  setSubscriptionId,
} = authSlice.actions;

export default authSlice.reducer;
