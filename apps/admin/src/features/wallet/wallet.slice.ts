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
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await walletApi.getWalletData();
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
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await walletApi.getWithdrawalRequests();
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
  async ({ id }: { id: number }, { rejectWithValue }) => {
    try {
      const response = await walletApi.getWalletDetail(id);
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
      threshold,
    }: {
      threshold: string;
    },
    { rejectWithValue }
  ) => {
    try {
      let response = await walletApi.updateWithdrawalThreshold(parseInt(threshold));
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
      type,
      id,
    }: {
      type: string;
      id: any;
    },
    { rejectWithValue }
  ) => {
    try {
      let response = await walletApi.withdrawalRequestDecision(id, type);
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
      amount,
      id,
    }: {
      amount: string;
      id: any;
    },
    { rejectWithValue }
  ) => {
    try {
      let response = await walletApi.addToWallet(id, amount);
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
      amount,
      id,
    }: {
      amount: string;
      id: any;
    },
    { rejectWithValue }
  ) => {
    try {
      let response = await walletApi.deductFromWallet(id, amount);
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
