import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {axiosInstance} from "@/lib/axiosInstane";
import {TribeInterface, TribeThreadInterface} from "@/interfaces/TribeInterface";

interface tribeState {
    user: {} | null;
    loading: boolean;
    error: boolean;
    threads: TribeThreadInterface[],
    tribes: TribeInterface[],
    tribe: TribeThreadInterface | null,
    thread: TribeThreadInterface | null
}

interface JoinTribeParams {
    id: number;
    token: string;
}

interface CreateThreadParams {
    id: number;
    token: string;
    data: {}
}

interface TribeResponse {
    thread: TribeThreadInterface
}

interface JoinTribeSuccessPayload {
    data: TribeResponse;
}

const initialState: tribeState = {
    user: null,
    loading: false,
    error: false,
    threads: [],
    tribes: [],
    tribe: null,
    thread: null
};

const joinTribe = createAsyncThunk<JoinTribeSuccessPayload, JoinTribeParams>("tribe/joinTribe", async ({id, token}: JoinTribeParams, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.post(`/tribes/join-tribe/${id}`, {}, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const createThread = createAsyncThunk<JoinTribeSuccessPayload, CreateThreadParams>("tribe/createThread", async ({id, token, data}: CreateThreadParams, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.post(`/tribes/${id}/threads/create-thread`, data, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const likeThread = createAsyncThunk("tribe/likeThread", async ({id, tribe_id, token}: {id: number, tribe_id: number, token: string}, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.post(`/threads/${tribe_id}/${id}/post-like`, {}, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const tribeSlice = createSlice({
    name: "tribe",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(joinTribe.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(joinTribe.fulfilled, (state, { payload }) => {
            state.loading = false;
        });
        builder.addCase(joinTribe.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(createThread.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createThread.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.threads = [...state.threads, payload.data.thread]
        });
        builder.addCase(createThread.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(likeThread.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(likeThread.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.threads = payload.data.threads
        });
        builder.addCase(likeThread.rejected, (state) => {
            state.loading = false;
        });
    }
});

export const {  } = tribeSlice.actions
export { joinTribe, createThread , likeThread}
export default tribeSlice.reducer;