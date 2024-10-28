import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {axiosInstance} from "@/lib/axiosInstane";

interface tribeState {
    loading: boolean;
    error: boolean;
}

const initialState: tribeState = {
    loading: false,
    error: false,
};

const eventSlice = createSlice({
    name: "event",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
    }
});

export const {  } = eventSlice.actions
export {  }
export default eventSlice.reducer;