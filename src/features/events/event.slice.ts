import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {axiosInstance} from "@/lib/axiosInstane";
import {EventInterface, PromotionInterface, TicketDetails, TicketInterface} from "@/interfaces/EventInterface";
import {likeThread} from "@/features/tribes/tribe.slice";

export type GuestListCardProps = {
    id: number;
    name: string;
    type: string;
    ticket_name: string;
    status: string;
    checked_in: boolean;
};

interface eventState {
    loading: boolean;
    error: boolean;
    tickets: TicketDetails[];
    event_tickets: TicketInterface[];
    total: number;
    event: EventInterface | null;
    newTickets: [];
    searchResults: [];
    payment_setting: any;
    free_event: any;
    filtered: boolean;
    filteredEvents: any[];
    affiliateEvents: any[];
    events: {
        trending: any[],
        this_week: any[],
        upcoming: any[],
    }
    organizer_events: {
        drafts: any[],
        past: any[],
        upcoming: any[]
    };
    affiliate_events: EventInterface[]
    affiliate_data: any[]
    ticket_data: {
        event: EventInterface,
        tickets: TicketInterface[]
    }
    guestList: any[]
    guestDetails: any
    promotions: PromotionInterface[]
    promotion: any
    programDetails: any

    eventsLoading: boolean;
    filteredLoading: boolean;
    affiliateLoading: boolean;
    affiliateDataLoading: boolean;
    guestDetailLoading: boolean;
    checkInLoading: boolean;
    promotionLoading: boolean;
    generateLinkLoading: boolean;
    generatedLink: string | null;

    searchTerm: string;
    guestSearchResults: GuestListCardProps[];
    guestSearchLoading: boolean;
}

const initialState: eventState = {
    loading: false,
    error: false,
    tickets: [],
    event_tickets: [],
    total: 0,
    event: null,
    newTickets: [],
    searchResults: [],
    payment_setting: {},
    free_event: {},
    filtered: false,
    filteredEvents: [],
    affiliateEvents: [],
    events: {
        trending: [],
        this_week: [],
        upcoming: [],
    },
    eventsLoading: false,
    filteredLoading: false,
    organizer_events: {
        drafts: [],
        past: [],
        upcoming: []
    },
    affiliate_events: [],
    affiliateLoading: false,
    affiliateDataLoading: false,
    affiliate_data: [],
    ticket_data: {
        event: {} as EventInterface,
        tickets: [] as TicketInterface[]
    },
    guestList: [],
    guestDetails: {},
    guestDetailLoading: false,
    checkInLoading: false,
    promotions: [],
    promotionLoading: false,
    promotion: {},
    programDetails: {},
    generatedLink: null,
    generateLinkLoading: false,

    searchTerm: "",
    guestSearchResults: [],
    guestSearchLoading: false,
};

const buyTicket = createAsyncThunk("event/buyTicket", async ({ event_id, data}: {event_id: number, data: any}, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/events/attendees/${event_id}/assign-tickets`, data);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const createEvent = createAsyncThunk("event/createEvent", async ({ data }: { data: any }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/events/create-event`, data );
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

const publishEvent = createAsyncThunk("event/publishEvent", async ({ id }: { id: number }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.patch(`/events/publish-event/${id}`);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getEvents = createAsyncThunk("event/getEvents", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/events/attendees`);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getEvent = createAsyncThunk("event/getEvent", async ({ id }: { id: number }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/events/${id}`);
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

const getOrganizerEvents = createAsyncThunk("event/getOrganizerEvents", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/events`);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getAffiliateEvents = createAsyncThunk("event/getAffiliateEvents", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/events/affiliate`);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getAffiliateData = createAsyncThunk("event/getAffiliateData", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/events/affiliate/data`);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getEventTicketData = createAsyncThunk("event/getEventTicketData", async ({ id }: { id: number }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/events/attendees/${id}/tickets`);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getGuestList = createAsyncThunk("event/getGuestList", async ({ id }: { id: number }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/events/${id}/guest-list`);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getGuestListDetails = createAsyncThunk("event/getGuestListDetails", async ({ id, guest_id }: { id: number, guest_id: number|null }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/events/${id}/${guest_id}/guest-details`);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const checkInGuest = createAsyncThunk("event/checkInGuest", async ({ id, guest_id }: { id: number, guest_id: number|null }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.patch(`/events/${id}/${guest_id}/check-in`);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getPromotions = createAsyncThunk("event/getPromotions", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/events/promotions`);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const payForPromotion = createAsyncThunk("event/payForPromotion", async ({id, data}: {id: number, data: any}, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/events/${id}/promote-event`, data);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getEventPromotion = createAsyncThunk("event/getEventPromotion", async ({ id, promotion_id }: { id: number, promotion_id:number }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/events/${id}/${promotion_id}/event-promotion`);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getEventTickets = createAsyncThunk("event/getEventTickets", async ({id}: {id:number}, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/events/${id}/event-tickets`);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const editEventTickets = createAsyncThunk("event/editEventTickets", async ({id, data}: {id:number, data: any}, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.patch(`/events/${id}/edit-tickets`, data);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getProgram = createAsyncThunk("event/getProgram", async ({ id }: { id: number }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/events/affiliate/${id}`);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const generateAffiliateLink = createAsyncThunk("event/generateAffiliateLink", async ({ id }: { id: number }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/events/affiliate/${id}/generate-link`);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const searchAffiliateEvent = createAsyncThunk("event/searchAffiliateEvent", async ({ data }: { data: any }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/events/search-affiliate-events`, data);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const guestSearch = createAsyncThunk("event/guestSearch", async ({ id, q }: { q: any, id: number }, { rejectWithValue, signal }) => {
    try {
        const response = await axiosInstance.post(`/events/${id}/search-guest-list`, null, {
            params: { q },
            signal
        });
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
        setSearchTerm(state, action: PayloadAction<string>) {
            state.searchTerm = action.payload;
        },
        clearSearch(state) {
            state.guestSearchResults = [];
            state.guestSearchLoading = false;
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

        builder.addCase(getEventTickets.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getEventTickets.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.event_tickets = payload?.data?.tickets
        });
        builder.addCase(getEventTickets.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(editEventTickets.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(editEventTickets.fulfilled, (state, { payload }) => {
            state.loading = false;
        });
        builder.addCase(editEventTickets.rejected, (state) => {
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
            state.event = payload?.data?.event
        });
        builder.addCase(getEvent.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(getProgram.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getProgram.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.programDetails = payload?.data
        });
        builder.addCase(getProgram.rejected, (state) => {
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
            state.filteredLoading = true;
        });
        builder.addCase(filterEvent.fulfilled, (state, { payload }) => {
            state.filteredLoading = false;
            state.filteredEvents = payload?.data?.events;
            state.filtered = true
        });
        builder.addCase(filterEvent.rejected, (state) => {
            state.filteredLoading = false;
        });

        builder.addCase(getEvents.pending, (state) => {
            state.eventsLoading = true;
        });
        builder.addCase(getEvents.fulfilled, (state, { payload }) => {
            state.eventsLoading = false;
            state.events = payload?.data
        });
        builder.addCase(getEvents.rejected, (state) => {
            state.eventsLoading = false;
        });

        builder.addCase(getOrganizerEvents.pending, (state) => {
            state.eventsLoading = true;
        });
        builder.addCase(getOrganizerEvents.fulfilled, (state, { payload }) => {
            state.eventsLoading = false;
            state.organizer_events = payload?.data
        });
        builder.addCase(getOrganizerEvents.rejected, (state) => {
            state.eventsLoading = false;
        });

        builder.addCase(getAffiliateEvents.pending, (state) => {
            state.affiliateLoading = true;
        });
        builder.addCase(getAffiliateEvents.fulfilled, (state, { payload }) => {
            state.affiliateLoading = false;
            state.affiliate_events = payload?.data?.events
        });
        builder.addCase(getAffiliateEvents.rejected, (state) => {
            state.affiliateLoading = false;
        });

        builder.addCase(getAffiliateData.pending, (state) => {
            state.affiliateDataLoading = true;
        });
        builder.addCase(getAffiliateData.fulfilled, (state, { payload }) => {
            state.affiliateDataLoading = false;
            state.affiliate_data = payload?.data
        });
        builder.addCase(getAffiliateData.rejected, (state) => {
            state.affiliateDataLoading = false;
        });

        builder.addCase(getEventTicketData.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getEventTicketData.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.ticket_data = payload?.data
        });
        builder.addCase(getEventTicketData.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(getGuestList.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getGuestList.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.guestList = payload?.data?.guest_list;
        });
        builder.addCase(getGuestList.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(getGuestListDetails.pending, (state) => {
            state.guestDetailLoading = true;
        });
        builder.addCase(getGuestListDetails.fulfilled, (state, { payload }) => {
            state.guestDetailLoading = false;
            state.guestDetails = payload?.data?.guest_details;
        });
        builder.addCase(getGuestListDetails.rejected, (state) => {
            state.guestDetailLoading = false;
        });

        builder.addCase(checkInGuest.pending, (state) => {
            state.checkInLoading = true;
        });
        builder.addCase(checkInGuest.fulfilled, (state, { payload }) => {
            state.checkInLoading = false;
            const updatedGuest = payload?.data?.guest_details;
            // modify guest-list
            state.guestDetails = updatedGuest
            const index = state.guestList?.findIndex((g) => g.id === updatedGuest?.id) ?? -1
            if (index !== -1) {
                state.guestList[index] = {
                    ...state.guestList[index],
                    ...updatedGuest,
                    id: updatedGuest?.id,
                }
            } else {
                state.guestList = [...(state.guestList ?? []), updatedGuest]
            }
        });
        builder.addCase(checkInGuest.rejected, (state) => {
            state.checkInLoading = false;
        });

        builder.addCase(getPromotions.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getPromotions.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.promotions = payload?.data?.promotions;
        });
        builder.addCase(getPromotions.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(payForPromotion.pending, (state) => {
            state.promotionLoading = true;
        });
        builder.addCase(payForPromotion.fulfilled, (state, { payload }) => {
            state.promotionLoading = false;
            state.promotions = payload?.data?.promotions;
        });
        builder.addCase(payForPromotion.rejected, (state) => {
            state.promotionLoading = false;
        });

        builder.addCase(getEventPromotion.pending, (state) => {
            state.promotionLoading = true;
        });
        builder.addCase(getEventPromotion.fulfilled, (state, { payload }) => {
            state.promotionLoading = false;
            state.promotion = payload?.data?.promotion;
        });
        builder.addCase(getEventPromotion.rejected, (state) => {
            state.promotionLoading = false;
        });

        builder.addCase(publishEvent.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(publishEvent.fulfilled, (state, { payload }) => {
            state.loading = false;

            // --- 1. Remove the event from organizer drafts
            const draftIndex = state.organizer_events.drafts.findIndex(
                (event) => event.id === payload?.data?.event?.id
            );

            if (draftIndex !== -1) {
                const [publishedEvent] = state.organizer_events.drafts.splice(draftIndex, 1);

                // --- 2. Add it to organizer upcoming
                state.organizer_events.upcoming.push(publishedEvent);

                // --- 3. Add it to global events for users
                // Prevent duplicates
                const existsInUpcoming = state.events.upcoming.some(
                    (event) => event.id === payload.id
                );

                if (!existsInUpcoming) {
                    state.events.upcoming.push(publishedEvent);
                }

            }
        });
        builder.addCase(publishEvent.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(generateAffiliateLink.pending, (state) => {
            state.generateLinkLoading = true;
        });
        builder.addCase(generateAffiliateLink.fulfilled, (state, { payload }) => {
            state.generateLinkLoading = false;
            state.generatedLink = payload?.data?.referral_id;
            state.programDetails.events = payload?.data?.events
        });
        builder.addCase(generateAffiliateLink.rejected, (state) => {
            state.generateLinkLoading = false;
        });

        builder.addCase(searchAffiliateEvent.pending, (state) => {
            state.affiliateLoading = true;
        });
        builder.addCase(searchAffiliateEvent.fulfilled, (state, { payload }) => {
            state.affiliateLoading = false;
            state.affiliateEvents = payload?.data?.events
        });
        builder.addCase(searchAffiliateEvent.rejected, (state) => {
            state.affiliateLoading = false;
        });

        builder.addCase(guestSearch.pending, (state) => {
            state.guestSearchLoading = true;
        });
        builder.addCase(guestSearch.fulfilled, (state, { payload }) => {
            state.guestSearchLoading = false;
            state.guestSearchResults = payload?.data?.guest_list
            console.log(payload?.data?.guest_list)
        });
        builder.addCase(guestSearch.rejected, (state) => {
            state.guestSearchLoading = false;
        });

    }
});

export const { addTickets, addEvent, createTickets, resetEventState, freeEventState, resetFreeEventState, resetFilter, setSearchTerm, clearSearch } = eventSlice.actions
export { buyTicket, createEvent, editEvent, searchEvent, getEvent, getPaymentSetting, updatePaymentSetting, filterEvent, getEvents, getOrganizerEvents, getAffiliateEvents, getAffiliateData, getEventTicketData, getGuestList, getGuestListDetails, checkInGuest, getPromotions, payForPromotion, getEventPromotion, publishEvent, getEventTickets, editEventTickets, getProgram, generateAffiliateLink, searchAffiliateEvent, guestSearch }
export default eventSlice.reducer;