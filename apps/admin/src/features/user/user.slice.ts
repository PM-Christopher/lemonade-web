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

const getUserData = createAsyncThunk("user/getUserData", async ({ trxType }: { trxType: string }, { rejectWithValue }) => {
    try {
        const response = await userApi.getUserData(trxType);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getUserDetail = createAsyncThunk("user/getUserDetail", async ({ id }: { id: number }, { rejectWithValue }) => {
    try {
        const response = await userApi.getUserDetail(id);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});




const getAffiliateDetail = createAsyncThunk("user/getAffiliateDetail", async ({ id }: { id: number }, { rejectWithValue }) => {
    try {
        const response = await userApi.getAffiliateDetail(id);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});


const getAccountInfo = createAsyncThunk("user/getAccountInfo", async ({ id, infoType }: { id: number, infoType: string }, { rejectWithValue }) => {
    try {
        const response = await userApi.getAccountInfo(id, infoType);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const userAction = createAsyncThunk("user/userAction", async ({ id, actionType }: { id: number, actionType: string }, { rejectWithValue }) => {
    try {
        const response = await userApi.userAction(id, actionType);
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