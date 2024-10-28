import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {axiosInstance} from "@/lib/axiosInstane";
import {TicketDetails} from "@/interfaces/EventInterface";

interface businessState {
    loading: boolean;
    error: boolean;
    job: any
}

const initialState: businessState = {
    loading: false,
    error: false,
    job: null
};

const requestService = createAsyncThunk("business/requestService", async ({ id, token, data}: {id: number, token: string, data: any}, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.post(`/business/${id}/request-service`, data, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getJob = createAsyncThunk("business/getJob", async ({ id, token, type}: {id: number, token: string, type: string}, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.get(`/${type}/jobs/job/${id}`, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const businessSlice = createSlice({
    name: "business",
    initialState,
    reducers: {
        addJob: (state, { payload }) =>  {
            state.job = payload.job
        },
    },
    extraReducers: (builder) => {

        builder.addCase(requestService.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(requestService.fulfilled, (state, { payload }) => {
            state.loading = false;
        });
        builder.addCase(requestService.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(getJob.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getJob.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.job = payload.data.job
        });
        builder.addCase(getJob.rejected, (state) => {
            state.loading = false;
        });

    }
});

export const { addJob } = businessSlice.actions
export { requestService, getJob }
export default businessSlice.reducer;