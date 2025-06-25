import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {axiosInstance} from "@/lib/axiosInstane";
import {TicketDetails} from "@/interfaces/EventInterface";
import {likeThread} from "@/features/tribes/tribe.slice";

interface tribeState {
    loading: boolean;
    error: boolean;
    tickets: TicketDetails[];
    total: number,
    event: null,
    newTickets: [],
    searchResults: [],
    payment_setting: any,
    free_event: any,
    filtered: boolean,
    filteredEvents: any[]
}

const initialState: tribeState = {
    loading: false,
    error: false,
    tickets: [],
    total: 0,
    event: null,
    newTickets: [],
    searchResults: [],
    payment_setting: {},
    free_event: {},
    filtered: false,
    filteredEvents: [],
};

const buyTicket = createAsyncThunk("event/buyTicket", async ({ event_id, token, data}: {event_id: number, token: string, data: any}, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.post(`/events/attendees/${event_id}/assign-tickets`, data, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const createEvent = createAsyncThunk("event/createEvent", async ({ data, token }: { data: any, token: string }, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.post(`/events/create-event`, data, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const editEvent = createAsyncThunk("event/editEvent", async ({ data, token, id }: { data: any, token: string, id: number }, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.put(`/events/update-event/${id}`, data, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getEvent = createAsyncThunk("event/getEvent", async ({ token, id }: { token: string, id: number }, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.get(`/events/${id}`, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const searchEvent = createAsyncThunk("event/searchEvent", async ({ data}: { data: any }, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    try {
        const response = await axiosInstance.post(`/events/search-events`, data, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getPaymentSetting = createAsyncThunk("event/getPaymentSetting", async ({ token }: { token: string }, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.get(`/events/get-payment-setting`, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const updatePaymentSetting = createAsyncThunk("event/updatePaymentSetting", async ({ token, data }: { token: string, data: any }, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.patch(`/events/update-payment-setting`, data, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const filterEvent = createAsyncThunk("event/filterEvent", async ({ token, data }: { token: string, data: any }, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        let url = `/events/filter-event?category=${data.category}&period=${data.period}&start_date=${data.start_date}&end_date=${data.end_date}&location=${data.location}`
        const response = await axiosInstance.get(url, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});


const eventSlice = createSlice({
    name: "event",
    initialState,
    reducers: {
        addTickets: (state, { payload }) =>  {
            state.total = payload.total
            state.tickets = payload.tickets
        },
        addEvent: (state, {payload}) => {
            state.event = payload
        },
        createTickets: (state, { payload }) =>  {
            state.newTickets = payload.tickets
        },
        resetEventState: (state) => {
            state.event = null
            state.newTickets = []
        },
        freeEventState: (state, {payload}) => {
            state.free_event = payload
        },
        resetFreeEventState: (state) => {
            state.free_event = null
        },
        resetFilter: (state) => {
            state.filtered = false
            state.filteredEvents = []
        },
    },
    extraReducers: (builder) => {
        builder.addCase(buyTicket.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(buyTicket.fulfilled, (state, { payload }) => {
            state.loading = false;
        });
        builder.addCase(buyTicket.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(createEvent.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createEvent.fulfilled, (state, { payload }) => {
            state.loading = false;
        });
        builder.addCase(createEvent.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(getEvent.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getEvent.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.event = payload?.data
        });
        builder.addCase(getEvent.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(editEvent.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(editEvent.fulfilled, (state, { payload }) => {
            state.loading = false;
        });
        builder.addCase(editEvent.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(searchEvent.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(searchEvent.fulfilled, (state, { payload }) => {
            state.loading = false;
            console.log({events: payload?.data?.events});
            state.searchResults = payload?.data?.events;
        });
        builder.addCase(searchEvent.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(getPaymentSetting.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getPaymentSetting.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.payment_setting = payload?.data?.payment_setting;
        });
        builder.addCase(getPaymentSetting.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(updatePaymentSetting.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updatePaymentSetting.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.payment_setting = payload?.data?.payment_setting;
        });
        builder.addCase(updatePaymentSetting.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(filterEvent.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(filterEvent.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.filteredEvents = payload?.data?.events;
            state.filtered = true
        });
        builder.addCase(filterEvent.rejected, (state) => {
            state.loading = false;
        });
    }
});

export const { addTickets, addEvent, createTickets, resetEventState, freeEventState, resetFreeEventState, resetFilter } = eventSlice.actions
export { buyTicket, createEvent, editEvent, searchEvent, getEvent, getPaymentSetting, updatePaymentSetting, filterEvent }
export default eventSlice.reducer;