import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {axiosInstance} from "@/lib/axiosInstane";

interface profileState {
    loading: boolean;
    error: boolean;
    data: any
}

const initialState: profileState = {
    loading: false,
    error: false,
    data: {}
};

const getUserProfile = createAsyncThunk("profile/getUserProfile", async ({token}: {token: string}, { rejectWithValue }) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`,
        }
        const response = await axiosInstance.get(`/profile/user`, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const requestPayout = createAsyncThunk("profile/requestPayout", async ({ data }: { data: any }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/profile/wallet/request-payout`, data);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});


const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUserProfile.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getUserProfile.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.data = payload.data
        });
        builder.addCase(getUserProfile.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(requestPayout.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(requestPayout.fulfilled, (state, { payload }) => {
            state.loading = false;
        });
        builder.addCase(requestPayout.rejected, (state) => {
            state.loading = false;
        });
    }
});

export const {  } = profileSlice.actions
export { getUserProfile, requestPayout }
export default profileSlice.reducer;