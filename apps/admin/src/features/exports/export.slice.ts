import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { exportsApi } from "@/features/exports/api";

// Define the state type for better type safety
interface ExportState {
  loading: boolean;
  data: any; // Replace with more specific type if possible
  error: any;
}

const initialState: ExportState = {
  loading: false,
  data: null,
  error: null
};

const getCSV = createAsyncThunk(
  "utils/getCSV",
  async (
    { table }: { table: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await exportsApi.getCSV(table);
      return response.data;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const exportSlice = createSlice({
  name: "exports",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(getCSV.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getCSV.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.data = payload;
    });
    builder.addCase(getCSV.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });
  },
});

export { getCSV };

export default exportSlice.reducer;