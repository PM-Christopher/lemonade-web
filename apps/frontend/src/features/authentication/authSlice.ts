import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {axiosInstance} from "@/lib/axiosInstane";
import {buyTicket} from "@/features/events/event.slice";
import {headers} from "next/headers";

interface authState {
    user: any | null;
    loading: boolean;
    error: boolean;
    authToken: string | null;
    admin: any;
    adminToken: string | null;
    isLoggedIn: boolean;
    subscription: {
        title: string
        plan_price: string
        payment_method: string
        next_billing_date: string
        id: number
    } | any | null,
    subscription_id: number | null,
    plan: {} | null,
    appSettings: {} | null
    code: string | null;
    upgradeLoading: boolean;
    downgradeData: {
        reason?: string;
        sub_id?: number | null;
    }
    pricing: any
}

const initialState: authState = {
    user: null,
    admin: null,
    adminToken: null,
    loading: false,
    error: false,
    authToken: null,
    isLoggedIn: false,
    subscription: null,
    subscription_id: null,
    plan: null,
    appSettings: null,
    code: null,
    upgradeLoading: false,
    downgradeData: {},
    pricing: null
};

const verifyEmailOtp = createAsyncThunk("auth/verifyEmailOtp", async ({ data, url, token }: { data: any, url: string, token: string }, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.post(`${url}`, data, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const resendOtp = createAsyncThunk("auth/resendOtp", async ({ token }: { token: string }, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.post(`/user/otp/resend`, {}, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const forgotPassword = createAsyncThunk("auth/forgotPassword", async ({ data }: { data: { email: string } }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/user/auth/forgot-password`, data);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const resetPassword = createAsyncThunk("auth/resetPassword", async ({ data, token }: { data: { password: string, confirm_password: string }, token: string }, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };
    try {
        const response = await axiosInstance.post(`/user/auth/reset-password`, data, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const updateUserData = createAsyncThunk("auth/updateUser", async ({ data, token, url }: { data: any, token: string, url: string }, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.patch(`${url}`, data, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const changePassword = createAsyncThunk("auth/changePassword", async ({ data, token }: { data: any, token: string }, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.patch(`/user/profile/settings/change-password`, data, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const updateUserImage = createAsyncThunk("auth/updateImage", async ({ data, token }: { data: any, token: string }, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.patch(`/user/profile/settings/change-profile-image`, data, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const deleteAccount = createAsyncThunk("auth/deleteAccount", async ({ data, token }: { data: any, token: string }, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.post(`/user/profile/settings/delete-account`, data, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const updateAppSettings = createAsyncThunk("auth/updateAppSettings", async ({ data, token }: { data: any, token: string }, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };
    try {
        const response = await axiosInstance.patch(`/user/profile/notification-settings/update-all-notification`, data, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const changePlan = createAsyncThunk("auth/changePlan", async ({ data }: { data: any }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/user/profile/subscription/change-plan`, data);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

// logout used to live here as a createAsyncThunk — replaced by
// useLogoutMutation() in features/authentication/mutations.ts (TanStack
// Query), which calls the httpOnly-cookie-aware /api/auth/logout route
// instead of building an Authorization header from a Redux-stored token.

const getSubscription = createAsyncThunk("auth/getSubscription", async ({ id }: { id: number }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/user/subscription/${id}`);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});


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
            state.subscription = action.payload.subscription
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
            state.code = action.payload.code;
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
        updateHasBankAccount: (state) => {
            state.user = { ...state.user, has_bank_account: true };
        },
        adminUser: (state, action) => {
            state.loading = false;
            state.error = false;
            state.admin = action.payload;
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
        setSubscriptionId: (state, action) => {
            state.subscription_id = action.payload.id;
            state.plan = action.payload.plan
        },
        changeSubscription: (state, {payload}) => {
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
        }
    },
    extraReducers: (builder) => {
        builder.addCase(updateUserData.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateUserData.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.user = payload.data.user
        });
        builder.addCase(updateUserData.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(verifyEmailOtp.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(verifyEmailOtp.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.error = false
        });
        builder.addCase(verifyEmailOtp.rejected, (state) => {
            state.loading = false;
            state.error = true;
        });

        builder.addCase(resendOtp.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(resendOtp.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.error = false
        });
        builder.addCase(resendOtp.rejected, (state) => {
            state.loading = false;
            state.error = true;
        });

        builder.addCase(forgotPassword.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(forgotPassword.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.error = false
        });
        builder.addCase(forgotPassword.rejected, (state) => {
            state.loading = false;
            state.error = true;
        });

        builder.addCase(resetPassword.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(resetPassword.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.error = false
        });
        builder.addCase(resetPassword.rejected, (state) => {
            state.loading = false;
            state.error = true;
        });


        builder.addCase(changePassword.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(changePassword.fulfilled, (state, { payload }) => {
            state.loading = false;
        });
        builder.addCase(changePassword.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(deleteAccount.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteAccount.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.user = null
            state.authToken = null
            state.isLoggedIn = false
        });
        builder.addCase(deleteAccount.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(updateAppSettings.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateAppSettings.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.appSettings = payload.data.appSettings
        });
        builder.addCase(updateAppSettings.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(updateUserImage.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateUserImage.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.user = payload.data.user
        });
        builder.addCase(updateUserImage.rejected, (state) => {
            state.loading = false;
        });


        builder.addCase(changePlan.pending, (state) => {
            state.upgradeLoading = true;
        });
        builder.addCase(changePlan.fulfilled, (state, { payload }) => {
            state.upgradeLoading = false;
            state.subscription = payload?.data?.subscription
        });
        builder.addCase(changePlan.rejected, (state) => {
            state.upgradeLoading = false;
        });

        builder.addCase(getSubscription.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getSubscription.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.pricing = payload.data
        });
        builder.addCase(getSubscription.rejected, (state) => {
            state.loading = false;
        });
    }
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
    changeSubscription,
    changeReason,
    clearReason,
    updateHasBankAccount
} = authSlice.actions;

export { updateUserData, changePassword, deleteAccount, updateAppSettings, updateUserImage, verifyEmailOtp, resendOtp, forgotPassword, resetPassword, changePlan, getSubscription }

export default authSlice.reducer;