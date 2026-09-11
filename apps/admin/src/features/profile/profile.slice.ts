import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {profileApi} from "@/features/profile/api";

interface userState {
    loading: boolean;
    error: boolean;
    profile: {} | any
}

const initialState: userState = {
    loading: false,
    error: false,
    profile: null
};

const getUserProfile = createAsyncThunk("user/getUserProfile", async ({ token }: { token: any }, { rejectWithValue }) => {
    try {
        const response = await profileApi.getProfile(token);
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
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getUserProfile.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getUserProfile.fulfilled, (state, { payload }) => {
            state.loading = false;
            // store data
            state.profile  = payload?.data?.admin
        });
        builder.addCase(getUserProfile.rejected, (state) => {
            state.loading = false;
        });

    }
});

export { getUserProfile }
export default profileSlice.reducer;