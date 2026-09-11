import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { walletApi } from "@/features/wallet/api";

interface walletState {
  user: {} | null;
  loading: boolean;
  error: boolean;
  walletData: {} | null;
  withdrawalRequests: {} | null;
  walletDetail: {} | null;
}

const initialState: walletState = {
  user: null,
  loading: false,
  error: false,
  walletData: null,
  withdrawalRequests: {},
  walletDetail: null,
};

const getWalletData = createAsyncThunk(
  "wallet/getWalletData",
  async ({ token }: { token: string }, { rejectWithValue }) => {
    try {
      const response = await walletApi.getWalletData(token);
      return response.data;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const getWithdrawalRequest = createAsyncThunk(
  "wallet/getWithdrawalRequest",
  async ({ token }: { token: string }, { rejectWithValue }) => {
    try {
      const response = await walletApi.getWithdrawalRequests(token);
      return response.data;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const getWalletDetail = createAsyncThunk(
  "wallet/getWalletDetail",
  async ({ token, id }: { token: string; id: number }, { rejectWithValue }) => {
    try {
      const response = await walletApi.getWalletDetail(token, id);
      return response.data;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const updateWithdrawalThreshold = createAsyncThunk(
  "wallet/updateThreshold",
  async (
    {
      token,
      threshold,
    }: {
      token: string;
      threshold: string;
    },
    { rejectWithValue }
  ) => {
    try {
      let response = await walletApi.updateWithdrawalThreshold(token, parseInt(threshold));
      return response.data;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const withdrawalRequestDecison = createAsyncThunk(
  "wallet/requestDecision",
  async (
    {
      token,
      type,
      id,
    }: {
      token: string;
      type: string;
      id: any;
    },
    { rejectWithValue }
  ) => {
    try {
      let response = await walletApi.withdrawalRequestDecision(token, id, type);
      return response.data;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const withdrawaladdition = createAsyncThunk(
  "wallet/add",
  async (
    {
      token,
      amount,
      id,
    }: {
      token: string;
      amount: string;
      id: any;
    },
    { rejectWithValue }
  ) => {
    try {
      let response = await walletApi.addToWallet(token, id, amount);
      return response.data;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);



const withdrawaldeduction = createAsyncThunk(
  "wallet/deduct",
  async (
    {
      token,
      amount,
      id,
    }: {
      token: string;
      amount: string;
      id: any;
    },
    { rejectWithValue }
  ) => {
    try {
      let response = await walletApi.deductFromWallet(token, id, amount);
      return response.data;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getWalletData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getWalletData.fulfilled, (state, { payload }) => {
      state.loading = false;
      // store metrics
      state.walletData = payload?.data;
    });
    builder.addCase(getWalletData.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(getWithdrawalRequest.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getWithdrawalRequest.fulfilled, (state, { payload }) => {
      state.loading = false;
      // store metrics
      state.withdrawalRequests = payload?.data;
    });
    builder.addCase(getWithdrawalRequest.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(getWalletDetail.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getWalletDetail.fulfilled, (state, { payload }) => {
      state.loading = false;
      // store wallet detail
      state.walletDetail = payload.data;
    });
    builder.addCase(getWalletDetail.rejected, (state) => {
      state.loading = false;
    });
  },
});

export {
  getWalletData,
  getWithdrawalRequest,
  getWalletDetail,
  updateWithdrawalThreshold,
  withdrawalRequestDecison,
  withdrawaladdition,
  withdrawaldeduction
};
export default walletSlice.reducer;
