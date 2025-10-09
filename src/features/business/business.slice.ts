import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {axiosInstance} from "@/lib/axiosInstane";
import {TicketDetails} from "@/interfaces/EventInterface";
import {BusinessInterface} from "@/interfaces/BusinessInterface";

interface businessState {
    loading: boolean;
    error: boolean;
    job: any
    businesses: BusinessInterface[];
    business: any
}

const initialState: businessState = {
    loading: false,
    error: false,
    job: null,
    businesses: [],
    business: null
};

const getBusinesses = createAsyncThunk("business/getBusinesses", async ({ token }: { token: string }, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.get(`/business`, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getBusiness = createAsyncThunk("business/getBusiness", async ({id}: {id: number}, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/business/${id}`);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

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

const filterBusiness = createAsyncThunk("business/filterBusiness", async ({ token, value}: {token: string, value: { location: string, category: string, service_type: string, start_range: string, end_range: string } }, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.get(`/business/filter-business?location=${value.location}&category=${value.category}&service_type=${value.service_type}&start_range=${value.start_range}&end_range=${value.end_range}`, { headers });
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
        builder.addCase(getBusinesses.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getBusinesses.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.businesses = payload.data.businesses;
        });
        builder.addCase(getBusinesses.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(getBusiness.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getBusiness.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.business = payload.data.business;
        });
        builder.addCase(getBusiness.rejected, (state) => {
            state.loading = false;
        });


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

        builder.addCase(filterBusiness.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(filterBusiness.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.businesses = payload.data.businesses;
        });
        builder.addCase(filterBusiness.rejected, (state) => {
            state.loading = false;
        });

    }
});

export const { addJob } = businessSlice.actions
export { requestService, getJob, filterBusiness, getBusinesses, getBusiness }
export default businessSlice.reducer;