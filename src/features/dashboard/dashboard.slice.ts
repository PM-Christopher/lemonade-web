import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "@/lib/axiosInstane";
import Cookies from "js-cookie";
import {TribeInterface} from "@/interfaces/TribeInterface";
import {EventInterface} from "@/interfaces/EventInterface";
import {BusinessInterface} from "@/interfaces/BusinessInterface";

interface dashboardState {
    user: {} | null;
    tribeLoading: boolean;
    eventLoading: boolean;
    businessLoading: boolean;
    error: boolean;
    tribes: TribeInterface[];
    events: EventInterface[];
    businesses: BusinessInterface[];
}

const initialState: dashboardState = {
    user: null,
    tribeLoading: false,
    eventLoading: false,
    businessLoading: false,
    error: false,
    tribes: [],
    events: [],
    businesses: [],
};

const getDashboardTribes = createAsyncThunk("dashboard/getDashboardTribes", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/tribes?type=discover`, {
            cache: {
                ttl: 1000 * 60
            }
        });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getDashboardEvents = createAsyncThunk("dashboard/getDashboardEvents", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/events`, {
            cache: {
                ttl: 1000 * 60
            }
        });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getDashboardBusinesses = createAsyncThunk("dashboard/getDashboardBusinesses", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/business`, {
            cache: {
                ttl: 1000 * 60
            }
        });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});


const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {},
    extraReducers: (builder) => {{
        // dashboard tribes
        builder.addCase(getDashboardTribes.pending, (state) => {
            state.tribeLoading = true;
        });
        builder.addCase(getDashboardTribes.fulfilled, (state, { payload }) => {
            state.tribeLoading = false;
            state.tribes = payload?.data?.tribes
        });
        builder.addCase(getDashboardTribes.rejected, (state, error) => {
            state.tribeLoading = false;
        });

        // dashboard events
        builder.addCase(getDashboardEvents.pending, (state) => {
            state.eventLoading = true;
        });
        builder.addCase(getDashboardEvents.fulfilled, (state, { payload }) => {
            state.eventLoading = false;
            state.events = payload?.data?.upcoming
        });
        builder.addCase(getDashboardEvents.rejected, (state) => {
            state.eventLoading = false;
        });

        // dashboard businesses
        builder.addCase(getDashboardBusinesses.pending, (state) => {
            state.businessLoading = true;
        });
        builder.addCase(getDashboardBusinesses.fulfilled, (state, { payload }) => {
            state.businessLoading = false;
            state.businesses = payload?.data?.businesses
        });
        builder.addCase(getDashboardBusinesses.rejected, (state) => {
            state.businessLoading = false;
        });
    }}
});

export { getDashboardTribes, getDashboardEvents, getDashboardBusinesses }
export default dashboardSlice.reducer;