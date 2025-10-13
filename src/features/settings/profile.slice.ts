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

const getUserProfile = createAsyncThunk("profile/getUserProfile", async ({ token }: { token: string }, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.get(`/profile/user`, { headers });
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
    }
});

export const {  } = profileSlice.actions
export { getUserProfile }
export default profileSlice.reducer;