import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {transactionApi} from "@/features/transaction/api";

interface transactionState {
    loading: boolean;
    error: boolean;
    trxData: {} | null
    subscription: {} | null;
    wallet: {} | null
    event: {} | null
}

const initialState: transactionState = {
    loading: false,
    error: false,
    trxData: null,
    subscription: null,
    wallet: null,
    event: null,
};

const getPlanSubscriptions = createAsyncThunk("transaction/getPlanSubscriptions", async ({ token }: { token: string }, { rejectWithValue }) => {
    try {
        const response = await transactionApi.getPlanSubscriptions(token);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getPlanSubscription = createAsyncThunk("transaction/getPlanSubscription", async ({ token, id }: { token: string, id: number }, { rejectWithValue }) => {
    try {
        const response = await transactionApi.getPlanSubscription(token, id);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getWalletDetail = createAsyncThunk("transaction/getWalletDetail", async ({ token, id }: { token: string, id: number }, { rejectWithValue }) => {
    try {
        const response = await transactionApi.getWalletWithdrawal(token, id);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getEventDetail = createAsyncThunk("transaction/getEventDetail", async ({ token, id }: { token: string, id: number }, { rejectWithValue }) => {
    try {
        const response = await transactionApi.getEventDetail(token, id);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getTransactionData = createAsyncThunk("transaction/getTransactionData", async ({ token, trxType }: { token: string, trxType: string }, { rejectWithValue }) => {
    try {
        const response = await transactionApi.getTransactionData(token, trxType);
        return response?.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const transactionSlice = createSlice({
    name: "transaction",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getPlanSubscriptions.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getPlanSubscriptions.fulfilled, (state, { payload }) => {
            state.loading = false;
            // store data
            state.trxData  = payload?.data
        });
        builder.addCase(getPlanSubscriptions.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(getTransactionData.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getTransactionData.fulfilled, (state, { payload }) => {
            state.loading = false;
            // store data
            state.trxData  = payload?.data
        });
        builder.addCase(getTransactionData.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(getPlanSubscription.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getPlanSubscription.fulfilled, (state, { payload }) => {
            state.loading = false;
            // store data
            state.subscription  = payload?.data
        });
        builder.addCase(getPlanSubscription.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(getWalletDetail.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getWalletDetail.fulfilled, (state, { payload }) => {
            state.loading = false;
            // store data
            state.wallet  = payload?.data
        });
        builder.addCase(getWalletDetail.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(getEventDetail.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getEventDetail.fulfilled, (state, { payload }) => {
            state.loading = false;
            // store data
            state.event  = payload?.data
        });
        builder.addCase(getEventDetail.rejected, (state) => {
            state.loading = false;
        });
    }
});

export { getPlanSubscriptions, getTransactionData, getPlanSubscription, getWalletDetail, getEventDetail }
export default transactionSlice.reducer;