import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {axiosInstance} from "@/lib/axiosInstane";
import {tribesApi} from "@/features/tribes/api";
import {
    TribeInterface,
    TribeThreadInterface,
} from "@/interfaces/TribeInterface";

interface IPinned {
    topic: string;
    image: string;
    id: number;
}

interface tribeState {
    user: {} | null;
    loading: boolean;
    error: boolean;
    threads: TribeThreadInterface[];
    tribes: TribeInterface[];
    tribe: TribeInterface | null;
    thread: TribeThreadInterface | null;
    pinnedThreads: IPinned[];
    searchResults: [];
    comments: [];
    commentsLoading: boolean;
    searchLoading: boolean
}

interface JoinTribeParams {
    id: string;
    token: string;
}

interface CreateThreadParams {
    id: number;
    token: string;
    data: {};
}

interface TribeResponse {
    thread: TribeThreadInterface;
}

interface JoinTribeSuccessPayload {
    data: any;
}

const initialState: tribeState = {
    user: null,
    loading: false,
    error: false,
    threads: [],
    tribes: [],
    tribe: null,
    thread: null,
    pinnedThreads: [],
    searchResults: [],
    comments: [],
    commentsLoading: false,
    searchLoading: false
};

const getTribes = createAsyncThunk(
    "tribe/getTribes",
    async ({tribe_type}: {tribe_type: string}, {rejectWithValue}) => {

        try {
            const response = await tribesApi.getTribes(tribe_type);
            return response.data;
        } catch (err: any) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);


const getTribe = createAsyncThunk<JoinTribeSuccessPayload, JoinTribeParams>(
    "tribe/getTribe",
    async ({id, token}: JoinTribeParams, {rejectWithValue}) => {

        try {
            const response = await tribesApi.getTribe(id);
            return response.data;
        } catch (err: any) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

const joinTribe = createAsyncThunk(
    "tribe/joinTribe",
    async ({id, token, data}: { id: any, token: string, data: any }, {rejectWithValue}) => {
        try {
            const response = await tribesApi.joinTribe(id, data);
            return response.data;
        } catch (err: any) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

const verifyTribePayment = createAsyncThunk(
    "tribe/verifyTribePayment",
    async (
        {reference, token}: { reference: string; token: string },
        {rejectWithValue}
    ) => {
        try {
            const response = await axiosInstance.get(
                `/tribes/payment/verify?reference=${reference}`
            );
            return response.data;
        } catch (err: any) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

const createThread = createAsyncThunk<
    JoinTribeSuccessPayload,
    CreateThreadParams
>(
    "tribe/createThread",
    async ({id, token, data}: CreateThreadParams, {rejectWithValue}) => {
        try {
            const response = await tribesApi.createThread(id, data);
            return response.data;
        } catch (err: any) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

const likeThread = createAsyncThunk(
    "tribe/likeThread",
    async (
        {id, tribe_id, token}: { id: number; tribe_id: number; token: string },
        {rejectWithValue}
    ) => {
        try {
            const response = await tribesApi.likeThread(tribe_id, id);
            return response.data;
        } catch (err: any) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

const submitVote = createAsyncThunk(
    "tribe/submitVote",
    async (
        {
            tribe_id,
            thread_id,
            poll_id,
            data,
            token,
        }: {
            tribe_id: number;
            thread_id: number;
            poll_id: number;
            data: any;
            token: string;
        },
        {rejectWithValue}
    ) => {
        try {
            const response = await tribesApi.submitVote(tribe_id, thread_id, poll_id, data);
            return response.data;
        } catch (err: any) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

const getThreads = createAsyncThunk(
    "tribe/getThreads",
    async ({id, token}: { id: string; token: string }, {rejectWithValue}) => {
        try {
            const response = await tribesApi.getThreads(id);
            return response.data;
        } catch (err: any) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

const filterThreads = createAsyncThunk(
    "tribe/filterThreads",
    async (
        {id, token, data}: { id: number; token: string; data: any },
        {rejectWithValue}
    ) => {
        try {
            const response = await tribesApi.filterThreads(id, data);
            return response.data;
        } catch (err: any) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

const viewProfile = createAsyncThunk(
    "tribe/viewProfile",
    async ({id, token}: { id: number; token: string }, {rejectWithValue}) => {
        try {
            const response = await tribesApi.viewProfile(id);
            return response.data;
        } catch (err: any) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

const pinThread = createAsyncThunk(
    "tribe/pinThread",
    async ({id, token}: { id: number; token: string }, {rejectWithValue}) => {
        try {
            const response = await tribesApi.pinThread(id);
            return response.data;
        } catch (err: any) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

const getPinThreads = createAsyncThunk(
    "tribe/getPinThreads",
    async ({id, token}: { id: string; token: string }, {rejectWithValue}) => {
        try {
            const response = await tribesApi.getPinThreads(id);
            return response.data;
        } catch (err: any) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

const reportThread = createAsyncThunk(
    "tribe/reportThread",
    async (
        {id, token, data}: { id: number | null; token: string; data: any },
        {rejectWithValue}
    ) => {
        try {
            const response = await tribesApi.reportThread(id, data);
            return response.data;
        } catch (err: any) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

const deleteThread = createAsyncThunk(
    "tribe/deleteThread",
    async (
        {id, token}: { id: number | null; token: string },
        {rejectWithValue}
    ) => {
        try {
            const response = await tribesApi.deleteThread(id);
            return response.data;
        } catch (err: any) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

const searchTribe = createAsyncThunk(
    "tribe/searchTribe",
    async ({data}: { data: any }, {rejectWithValue}) => {
        try {
            const response = await tribesApi.searchTribe(data);
            return response.data;
        } catch (err: any) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

const addTribeMember = createAsyncThunk(
    "tribe/addTribeMember",
    async (
        {data, id, token}: { data: any; id: any; token: string },
        {rejectWithValue}
    ) => {
        try {
            const response = await tribesApi.addTribeMember(id, data);
            return response.data;
        } catch (err: any) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

const postComment = createAsyncThunk(
    "tribe/postComment",
    async (
        {
            data,
            tribe_id,
            thread_id,
            token,
        }: { data: any; tribe_id: number; thread_id: number; token: string },
        {rejectWithValue}
    ) => {
        try {
            const response = await tribesApi.postComment(tribe_id, thread_id, data);
            return response.data;
        } catch (err: any) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

const getComments = createAsyncThunk(
    "tribe/getComments",
    async (
        {
            tribe_id,
            thread_id,
            token,
        }: { tribe_id: number; thread_id: number; token: string },
        {rejectWithValue}
    ) => {
        try {
            const response = await tribesApi.getComments(tribe_id, thread_id);
            return response.data;
        } catch (err: any) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

const tribeSlice = createSlice({
    name: "tribe",
    initialState,
    reducers: {
        setTribeUser: (state, {payload}) => {
            state.loading = false;
            state.error = false;
            state.user = payload;
        },
        removeTribeUser: (state) => {
            state.loading = false;
            state.error = false;
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getTribes.pending, (state) => {
            state.loading = true;
            state.tribes = [];
        });
        builder.addCase(getTribes.fulfilled, (state, {payload}) => {
            state.loading = false;
            state.tribes = payload?.data?.tribes;
        });
        builder.addCase(getTribes.rejected, (state) => {
            state.loading = false;
            state.tribes = [];
        });

        builder.addCase(getTribe.pending, (state) => {
            state.loading = true;
            state.tribe = null;
        });
        builder.addCase(getTribe.fulfilled, (state, {payload}) => {
            state.loading = false;
            state.tribe = payload?.data?.tribe;
        });
        builder.addCase(getTribe.rejected, (state) => {
            state.loading = false;
            state.tribe = null;
        });

        builder.addCase(joinTribe.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(joinTribe.fulfilled, (state, {payload}) => {
            state.loading = false;
            if (state.tribe) {
                state.tribe.has_joined = true;
            }
        });
        builder.addCase(joinTribe.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(createThread.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createThread.fulfilled, (state, {payload}) => {
            state.loading = false;
            state.threads = [...state.threads, payload.data.thread];
        });
        builder.addCase(createThread.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(likeThread.pending, (state) => {
            // state.loading = true;
        });
        builder.addCase(likeThread.fulfilled, (state, {payload}) => {
            state.loading = false;
            // state.threads = state.threads.map((thread) =>
            //   thread.id === payload.data.thread.id ? payload.data.thread : thread
            // );
        });
        builder.addCase(likeThread.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(submitVote.pending, (state) => {
            // state.loading = true;
        });
        builder.addCase(submitVote.fulfilled, (state, {payload}) => {
            state.loading = false;
            state.threads = state.threads.map((thread) =>
                thread.id === payload.data.thread.id ? payload.data.thread : thread
            );
        });
        builder.addCase(submitVote.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(getThreads.pending, (state) => {
            state.loading = true;
            state.threads = [];
        });
        builder.addCase(getThreads.fulfilled, (state, {payload}) => {
            state.loading = false;
            state.threads = payload?.data?.threads;
        });
        builder.addCase(getThreads.rejected, (state) => {
            state.loading = false;
            state.threads = [];
        });

        builder.addCase(getPinThreads.pending, (state) => {
            state.loading = true;
            state.pinnedThreads = [];
        });
        builder.addCase(getPinThreads.fulfilled, (state, {payload}) => {
            state.loading = false;
            state.pinnedThreads = payload?.data?.threads;
        });
        builder.addCase(getPinThreads.rejected, (state) => {
            state.loading = false;
            state.pinnedThreads = [];
        });

        builder.addCase(filterThreads.pending, (state) => {
            state.loading = true;
            state.threads = [];
        });
        builder.addCase(filterThreads.fulfilled, (state, {payload}) => {
            state.loading = false;
            state.threads = payload?.data?.threads;
        });
        builder.addCase(filterThreads.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(viewProfile.pending, (state) => {
            // state.loading = true;
            state.user = null;
        });
        builder.addCase(viewProfile.fulfilled, (state, {payload}) => {
            state.loading = false;
            state.user = payload?.data?.user;
        });
        builder.addCase(viewProfile.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(pinThread.pending, (state) => {
            // state.loading = true;
        });
        builder.addCase(pinThread.fulfilled, (state, {payload}) => {
            state.loading = false;
            console.log(payload.message);
            if (payload?.message === "Pinned thread") {
                const pinnedThread = payload.data.message;

                // ✅ Add to pinnedThreads if not already there
                if (!state.pinnedThreads.some((t) => t.id === pinnedThread.id)) {
                    state.pinnedThreads = [
                        ...state.pinnedThreads,
                        {
                            id: pinnedThread.id,
                            topic: pinnedThread.topic,
                            image: pinnedThread.media?.[0] || null,
                        },
                    ];
                }

                // ✅ Update the thread in the main list to mark as pinned
                state.threads = state.threads.map((thread) =>
                    thread.id === pinnedThread.id
                        ? {...thread, pinned: true}
                        : thread
                );
            } else if (payload?.message === "Unpinned thread") {
                const unpinnedThread = payload.data.message;

                // ✅ Remove from pinnedThreads
                state.pinnedThreads = state.pinnedThreads.filter(
                    (thread) => thread.id !== unpinnedThread.id
                );

                // ✅ Update the thread in the main list to mark as unpinned
                state.threads = state.threads.map((thread) =>
                    thread.id === unpinnedThread.id
                        ? {...thread, pinned: false}
                        : thread
                );
            }
        });
        builder.addCase(pinThread.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(reportThread.pending, (state) => {
            // state.loading = true;
        });
        builder.addCase(reportThread.fulfilled, (state, {payload}) => {
            state.loading = false;
        });
        builder.addCase(reportThread.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(deleteThread.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteThread.fulfilled, (state, {payload}) => {
            state.loading = false;
            state.threads = state.threads.filter(
                (thread) => thread.id !== payload?.data?.thread_id
            );
            state.pinnedThreads = state.pinnedThreads.filter(
                (thread) => thread.id !== payload.data?.thread_id
            );
        });
        builder.addCase(deleteThread.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(searchTribe.pending, (state) => {
            state.searchLoading = true;
        });
        builder.addCase(searchTribe.fulfilled, (state, {payload}) => {
            state.searchLoading = false;
            state.searchResults = payload?.data?.tribes;
        });
        builder.addCase(searchTribe.rejected, (state) => {
            state.searchLoading = false;
        });

        builder.addCase(addTribeMember.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(addTribeMember.fulfilled, (state, {payload}) => {
            state.loading = false;
            state.tribe = payload?.data?.tribe;
        });
        builder.addCase(addTribeMember.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(verifyTribePayment.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(verifyTribePayment.fulfilled, (state, {payload}) => {
            state.loading = false;
            if (state.tribe) {
                state.tribe.has_joined = true;
            }
        });
        builder.addCase(verifyTribePayment.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(postComment.pending, (state) => {
            state.commentsLoading = true;
        });
        builder.addCase(postComment.fulfilled, (state, {payload}) => {
            state.commentsLoading = false;
            if (state.threads) {
                const threadIndex = state.threads.findIndex(
                    (thread) => thread.id === payload.data.comment.thread_id
                );

                state.threads[threadIndex].all_comments = [
                    payload.data.comment,
                    ...state.threads[threadIndex].all_comments,
                ];
            }
        });
        builder.addCase(postComment.rejected, (state) => {
            state.commentsLoading = false;
        });

        builder.addCase(getComments.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getComments.fulfilled, (state, {payload}) => {
            state.loading = false;
            state.comments = payload?.data?.comments;
        });
        builder.addCase(getComments.rejected, (state) => {
            state.loading = false;
        });
    },
});

export const {setTribeUser, removeTribeUser} = tribeSlice.actions;
export {
    getTribes,
    getTribe,
    joinTribe,
    verifyTribePayment,
    createThread,
    likeThread,
    submitVote,
    getThreads,
    filterThreads,
    viewProfile,
    pinThread,
    getPinThreads,
    reportThread,
    deleteThread,
    searchTribe,
    addTribeMember,
    postComment,
    getComments,
};
export default tribeSlice.reducer;
