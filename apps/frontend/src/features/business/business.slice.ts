import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {axiosInstance} from "@/lib/axiosInstane";
import {TicketDetails} from "@/interfaces/EventInterface";
import {BusinessInterface} from "@/interfaces/BusinessInterface";

interface businessState {
    loading: boolean;
    error: boolean;
    job: any
    businesses: BusinessInterface[];
    featured: BusinessInterface[];
    listings: BusinessInterface[];
    business: any
    listing: any
    jobData: any
    jobDataLoading: boolean
    jobLoading: boolean
    markLoading: boolean
    requestPLoading: boolean
    payLoading: boolean
    completedLoading: boolean
    disputeLoading: boolean
}

const initialState: businessState = {
    loading: false,
    error: false,
    job: null,
    businesses: [],
    featured: [],
    listings: [],
    business: null,
    listing: null,
    jobData: null,
    jobDataLoading: false,
    jobLoading: false,
    markLoading: false,
    requestPLoading: false,
    payLoading: false,
    completedLoading: false,
    disputeLoading: false,
};

const getListings = createAsyncThunk("business/getListings", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/listing`);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getListing = createAsyncThunk("business/getListing", async ({id}: {id: number}, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/listing/${id}`);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getJobsData = createAsyncThunk("business/getJobsData", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/business/jobs/all`);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getBusinesses = createAsyncThunk("business/getBusinesses", async (_, { rejectWithValue }) => {

    try {
        const response = await axiosInstance.get(`/business`);
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

const getJob = createAsyncThunk("business/getJob", async ({ id, type}: {id: number, type: string}, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/${type}/jobs/job/${id}`);
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

const markJobRequest = createAsyncThunk("business/markJobRequest", async ({ id, data}: {id: number, data: any}, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`listing/jobs/${id}/mark-job`, data);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const requestJobPayment = createAsyncThunk("business/requestJobPayment", async ({ id }: {id: number}, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.patch(`listing/jobs/${id}/request-payment`);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const makeJobPayment = createAsyncThunk("business/makeJobPayment", async ({ id, data }: {id: number, data: any}, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`business/jobs/${id}/pay`, data);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const markJobCompleted = createAsyncThunk("business/markJobCompleted", async ({ id }: {id: number}, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`business/jobs/${id}/mark-completed`);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const disputeJob = createAsyncThunk("business/disputeJob", async ({ url, data }: {url: string, data: any}, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(url, data);
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
            state.featured = payload.data.featured;
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

        builder.addCase(getListings.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getListings.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.listings = payload.data.listings;
        });
        builder.addCase(getListings.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(getListing.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getListing.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.listing = payload.data.listing;
        });
        builder.addCase(getListing.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(getJobsData.pending, (state) => {
            state.jobDataLoading = true;
        });
        builder.addCase(getJobsData.fulfilled, (state, { payload }) => {
            state.jobDataLoading = false;
            state.jobData = payload.data;
        });
        builder.addCase(getJobsData.rejected, (state) => {
            state.jobDataLoading = false;
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
            state.jobLoading = true;
        });
        builder.addCase(getJob.fulfilled, (state, { payload }) => {
            state.jobLoading = false;
            state.job = payload.data.job
        });
        builder.addCase(getJob.rejected, (state) => {
            state.jobLoading = false;
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

        builder.addCase(markJobRequest.pending, (state) => {
            state.markLoading = true;
        });
        builder.addCase(markJobRequest.fulfilled, (state, { payload }) => {
            state.markLoading = false;
        });
        builder.addCase(markJobRequest.rejected, (state) => {
            state.markLoading = false;
        });

        builder.addCase(requestJobPayment.pending, (state) => {
            state.requestPLoading = true;
        });
        builder.addCase(requestJobPayment.fulfilled, (state, { payload }) => {
            state.requestPLoading = false;
        });
        builder.addCase(requestJobPayment.rejected, (state) => {
            state.requestPLoading = false;
        });

        builder.addCase(makeJobPayment.pending, (state) => {
            state.payLoading = true;
        });
        builder.addCase(makeJobPayment.fulfilled, (state, { payload }) => {
            state.payLoading = false;
        });
        builder.addCase(makeJobPayment.rejected, (state) => {
            state.payLoading = false;
        });

        builder.addCase(markJobCompleted.pending, (state) => {
            state.completedLoading = true;
        });
        builder.addCase(markJobCompleted.fulfilled, (state, { payload }) => {
            state.completedLoading = false;

            const jobId = payload.data?.job

            // 1. Find the job in in_progress
            const job = state.jobData.in_progress.find((item: any) => item.id === jobId?.id);
            if (!job) return;

            state.jobData.in_progress = state.jobData.in_progress.filter((item: any) => item.id !== jobId?.id);

            state.jobData.completed.push({
                ...job,
                status: jobId.status,
            });
        });
        builder.addCase(markJobCompleted.rejected, (state) => {
            state.completedLoading = false;
        });

        builder.addCase(disputeJob.pending, (state) => {
            state.disputeLoading = true;
        });
        builder.addCase(disputeJob.fulfilled, (state, { payload }) => {
            state.disputeLoading = false;
        });
        builder.addCase(disputeJob.rejected, (state) => {
            state.disputeLoading = false;
        });

    }
});

export const { addJob } = businessSlice.actions
export { requestService, getJob, filterBusiness, getBusinesses, getBusiness, getListings, getListing, getJobsData, markJobRequest, requestJobPayment, makeJobPayment, markJobCompleted, disputeJob }
export default businessSlice.reducer;