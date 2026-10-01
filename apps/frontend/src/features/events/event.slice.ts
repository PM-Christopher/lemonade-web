import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventInterface, TicketDetails } from "@/interfaces/EventInterface";

// Client-only wizard/cart state, kept in Redux (persisted — see store.ts's
// whitelist) because it's genuinely carried across route navigations, not
// server data: the multi-page create-event → add-ticket → BankAccountModal
// draft, and the buy-ticket → assign-ticket ticket cart. Everything that
// used to live here as server data (events, tickets, affiliate data, guest
// lists, ...) now lives in features/events/queries.ts and mutations.ts.
interface eventState {
  tickets: TicketDetails[];
  total: number;
  event: EventInterface | null;
  newTickets: unknown[];
  free_event: { completed?: boolean } | null;
  eventReferrals?: Record<string, string>;
}

const initialState: eventState = {
  tickets: [],
  total: 0,
  event: null,
  newTickets: [],
  free_event: {},
  eventReferrals: {},
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    addTickets: (state, { payload }) => {
      state.total = payload.total;
      state.tickets = payload.tickets;
    },
    addEvent: (state, { payload }) => {
      state.event = payload;
    },
    createTickets: (state, { payload }) => {
      state.newTickets = payload.tickets;
    },
    resetEventState: (state) => {
      state.event = null;
      state.newTickets = [];
    },
    freeEventState: (state, { payload }) => {
      state.free_event = payload;
    },
    resetFreeEventState: (state) => {
      state.free_event = null;
    },
    setEventReferral: (
      state,
      action: PayloadAction<{ eventId: number | string; code: string }>,
    ) => {
      const key = String(action.payload.eventId);

      // ✅ guard for rehydrated/old state shape
      if (!state.eventReferrals) state.eventReferrals = {};

      state.eventReferrals[key] = action.payload.code;
    },

    clearEventReferral: (state, action: PayloadAction<{ eventId: number | string }>) => {
      const key = String(action.payload.eventId);
      if (!state.eventReferrals) return;
      delete state.eventReferrals[key];
    },
  },
});

export const {
  addTickets,
  addEvent,
  createTickets,
  resetEventState,
  freeEventState,
  resetFreeEventState,
  setEventReferral,
  clearEventReferral,
} = eventSlice.actions;
export default eventSlice.reducer;
