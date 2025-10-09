import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {axiosInstance} from "@/lib/axiosInstane";

interface transactionState {
    loading: boolean;
    error: boolean;
    transaction_data: any
}

const initialState: transactionState = {
    loading: false,
    error: false,
    transaction_data: null,
};

const verifyTransaction = createAsyncThunk("transaction/verifyTransaction", async ({data}: {data: any}, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/transaction/verify-transaction`, data);
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
    }
});

export const {  } = transactionSlice.actions
export { verifyTransaction }
export default transactionSlice.reducer;