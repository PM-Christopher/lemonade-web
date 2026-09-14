import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    phone_number: "",
    calling_code: "NG",
    country_code: "+234",
    verifyError: "",
    isLoading: false,
    isRouting: false,
    showSideNav: false,
    // The "currently relevant" business job — set from several independent
    // places (a job lookup, a payment-verification redirect, a completion
    // action), read from others (dispute submission). Genuinely global UI
    // state, not server data — see features/business/mutations.ts's
    // useGetJobMutation and docs/ARCHITECTURE.md's business domain note.
    selectedJob: null as unknown,
};

const tempSlice = createSlice({
    name: "temp",
    initialState,
    reducers: {
        updateProperty(state, action) {
            if (action.payload.phone_number) {
                state.phone_number = action.payload.phone_number;
            }
        },
        getTempError(state, action) {
            state.verifyError = action.payload;
        },
        setTempLoading(state, action) {
            state.isLoading = action.payload;
        },
        setShowSideNav(state, action) {
            state.showSideNav = action.payload;
        },
        setIsRouting(state, action) {
            state.isRouting = action.payload;
        },
        setSelectedJob(state, action) {
            state.selectedJob = action.payload;
        },
    },
});

export const {
    updateProperty,
    getTempError,
    setTempLoading,
    setShowSideNav,
    setIsRouting,
    setSelectedJob,
} = tempSlice.actions;

export default tempSlice.reducer;
