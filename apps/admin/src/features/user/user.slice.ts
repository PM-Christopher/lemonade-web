import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {userApi} from "@/features/user/api";

interface userState {
    loading: boolean;
    error: boolean;
    userData: {} | null
    user: {} | null;
    userDetail: {} | null
    userAction: {} | null
}

const initialState: userState = {
    loading: false,
    error: false,
    userData: null,
    user: null,
    userDetail: null,
    userAction: null
};

const getUserData = createAsyncThunk("user/getUserData", async ({ token, trxType }: { token: string, trxType: string }, { rejectWithValue }) => {
    try {
        const response = await userApi.getUserData(token, trxType);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getUserDetail = createAsyncThunk("user/getUserDetail", async ({ token, id }: { token: string, id: number }, { rejectWithValue }) => {
    try {
        const response = await userApi.getUserDetail(token, id);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});




const getAffiliateDetail = createAsyncThunk("user/getAffiliateDetail", async ({ token, id }: { token: string, id: number }, { rejectWithValue }) => {
    try {
        const response = await userApi.getAffiliateDetail(token, id);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});


const getAccountInfo = createAsyncThunk("user/getAccountInfo", async ({ token, id, infoType }: { token: string, id: number, infoType: string }, { rejectWithValue }) => {
    try {
        const response = await userApi.getAccountInfo(token, id, infoType);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const userAction = createAsyncThunk("user/userAction", async ({ token, id, actionType }: { token: string, id: number, actionType: string }, { rejectWithValue }) => {
    try {
        const response = await userApi.userAction(token, id, actionType);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getUserData.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getUserData.fulfilled, (state, { payload }) => {
            state.loading = false;
            // store data
            state.userData  = payload?.data
        });
        builder.addCase(getUserData.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(getUserDetail.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getUserDetail.fulfilled, (state, { payload }) => {
            state.loading = false;
            // store data
            state.user  = payload?.data?.user
        });
        builder.addCase(getUserDetail.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(getAccountInfo.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAccountInfo.fulfilled, (state, { payload }) => {
            state.loading = false;
            // store data
            state.userDetail  = payload?.data
        });
        builder.addCase(getAccountInfo.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(userAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(userAction.fulfilled, (state, { payload }) => {
            state.loading = false;
            // store data
            state.userAction  = payload?.data
        });
        builder.addCase(userAction.rejected, (state) => {
            state.loading = false;
        });

    }
});

export { getUserData, getUserDetail, getAccountInfo, userAction , getAffiliateDetail}
export default userSlice.reducer;