import { createSlice } from "@reduxjs/toolkit";

interface authState {
    user: {} | null;
    loading: boolean;
    error: boolean;
    authToken: string | null;
    admin: any;
    adminToken: string | null;
    isLoggedIn: boolean;
}

const initialState: authState = {
    user: null,
    admin: null,
    adminToken: null,
    loading: false,
    error: false,
    authToken: null,
    isLoggedIn: false,
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
            state.isLoggedIn = true;
            state.admin = null;
        },
        authUser: (state, action) => {
            state.loading = false;
            state.error = false;
            state.user = action.payload.user;
        },
        updateHasPin: (state) => {
            state.user = { ...state.user, hasPin: true };
        },
        updateProfileImage: (state, action) => {
            state.user = { ...state.user, profile_image: action.payload };
        },
        updateCreatedAccount: (state) => {
            state.user = { ...state.user, createdAccount: true };
        },
        adminUser: (state, action) => {
            state.loading = false;
            state.error = false;
            state.admin = action.payload;
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
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
} = authSlice.actions;

export default authSlice.reducer;