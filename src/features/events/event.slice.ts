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
}

const initialState: tribeState = {
    loading: false,
    error: false,
    tickets: [],
    total: 0,
    event: null,
    newTickets: [],
    searchResults: [],
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
        }
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
    }
});

export const { addTickets, addEvent, createTickets, resetEventState } = eventSlice.actions
export { buyTicket, createEvent, editEvent, searchEvent, getEvent }
export default eventSlice.reducer;