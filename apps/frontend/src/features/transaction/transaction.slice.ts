import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {transactionApi} from "@/features/transaction/api";

interface transactionState {
    loading: boolean;
    error: boolean;
    transaction_data: any
    banks: any[]
}

const initialState: transactionState = {
    loading: false,
    error: false,
    transaction_data: null,
    banks: [],
};

const verifyTransaction = createAsyncThunk("transaction/verifyTransaction", async ({data}: {data: any}, { rejectWithValue }) => {
    try {
        const response = await transactionApi.verifyTransaction(data);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getBanks = createAsyncThunk("transaction/getBanks", async (_, { rejectWithValue }) => {
    try {
        const response = await transactionApi.getBanks();
        return response.data;
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
        builder.addCase(verifyTransaction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(verifyTransaction.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.transaction_data = payload.data
        });
        builder.addCase(verifyTransaction.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(getBanks.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getBanks.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.banks = payload.banks
        });
        builder.addCase(getBanks.rejected, (state) => {
            state.loading = false;
        });
    }
});

export const {  } = transactionSlice.actions
export { verifyTransaction, getBanks }
export default transactionSlice.reducer;