import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "@/lib/axiosInstane";
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
};

const getTribe = createAsyncThunk<JoinTribeSuccessPayload, JoinTribeParams>(
  "tribe/getTribe",
  async ({ id, token }: JoinTribeParams, { rejectWithValue }) => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axiosInstance.get(`/tribes/${id}`, { headers });
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
  async ({ id, token, data }: { id: any, token: string, data: any }, { rejectWithValue }) => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axiosInstance.post(
        `/tribes/join-tribe/${id}`,
        data,
        { headers }
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

const verifyTribePayment = createAsyncThunk(
  "tribe/verifyTribePayment",
  async (
    { reference, token }: { reference: string; token: string },
    { rejectWithValue }
  ) => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axiosInstance.get(
        `/tribes/payment/verify?reference=${reference}`,
        { headers }
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
  async ({ id, token, data }: CreateThreadParams, { rejectWithValue }) => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axiosInstance.post(
        `/tribes/${id}/threads/create-thread`,
        data,
        { headers }
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

const likeThread = createAsyncThunk(
  "tribe/likeThread",
  async (
    { id, tribe_id, token }: { id: number; tribe_id: number; token: string },
    { rejectWithValue }
  ) => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axiosInstance.post(
        `/threads/${tribe_id}/${id}/post-like`,
        {},
        { headers }
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
    { rejectWithValue }
  ) => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axiosInstance.post(
        `/threads/${tribe_id}/${thread_id}/${poll_id}/poll-action`,
        data,
        { headers }
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

const getThreads = createAsyncThunk(
  "tribe/getThreads",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axiosInstance.get(`/tribes/${id}/threads/all`, {
        headers,
      });
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
    { id, token, data }: { id: string; token: string; data: any },
    { rejectWithValue }
  ) => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axiosInstance.post(
        `/tribes/${id}/threads/sort-thread`,
        data,
        { headers }
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

const viewProfile = createAsyncThunk(
  "tribe/viewProfile",
  async ({ id, token }: { id: number; token: string }, { rejectWithValue }) => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axiosInstance.get(`/threads/view-profile/${id}`, {
        headers,
      });
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
  async ({ id, token }: { id: number; token: string }, { rejectWithValue }) => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axiosInstance.post(
        `/threads/${id}/pin-thread`,
        {},
        { headers }
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

const getPinThreads = createAsyncThunk(
  "tribe/getPinThreads",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axiosInstance.get(`/threads/${id}/pinned`, {
        headers,
      });
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
    { id, token, data }: { id: number | null; token: string; data: any },
    { rejectWithValue }
  ) => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axiosInstance.post(
        `/threads/${id}/report-thread`,
        data,
        { headers }
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

const deleteThread = createAsyncThunk(
  "tribe/deleteThread",
  async (
    { id, token }: { id: number | null; token: string },
    { rejectWithValue }
  ) => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axiosInstance.delete(
        `/threads/${id}/delete-thread`,
        { headers }
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

const searchTribe = createAsyncThunk(
  "tribe/searchTribe",
  async ({ data }: { data: any }, { rejectWithValue }) => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    try {
      const response = await axiosInstance.post(`/tribes/search-tribe`, data, {
        headers,
      });
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
    { data, id, token }: { data: any; id: any; token: string },
    { rejectWithValue }
  ) => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axiosInstance.post(
        `/tribes/add-member/${id}`,
        data,
        { headers }
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

const postComment = createAsyncThunk(
  "tribe/postComment",
  async (
    {
      data,
      tribe_id,
      thread_id,
      token,
    }: { data: any; tribe_id: number; thread_id: number; token: string },
    { rejectWithValue }
  ) => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axiosInstance.post(
        `/threads/${tribe_id}/${thread_id}/post-comment`,
        data,
        { headers }
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

const getComments = createAsyncThunk(
  "tribe/getComments",
  async (
    {
      tribe_id,
      thread_id,
      token,
    }: { tribe_id: number; thread_id: number; token: string },
    { rejectWithValue }
  ) => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axiosInstance.get(
        `/threads/${tribe_id}/${thread_id}/comments`,
        { headers }
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

const tribeSlice = createSlice({
  name: "tribe",
  initialState,
  reducers: {
    setTribeUser: (state, { payload }) => {
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
    builder.addCase(getTribe.pending, (state) => {
      state.loading = true;
      state.tribe = null;
    });
    builder.addCase(getTribe.fulfilled, (state, { payload }) => {
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
    builder.addCase(joinTribe.fulfilled, (state, { payload }) => {
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
    builder.addCase(createThread.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.threads = [...state.threads, payload.data.thread];
    });
    builder.addCase(createThread.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(likeThread.pending, (state) => {
      // state.loading = true;
    });
    builder.addCase(likeThread.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.threads = state.threads.map((thread) =>
        thread.id === payload.data.thread.id ? payload.data.thread : thread
      );
    });
    builder.addCase(likeThread.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(submitVote.pending, (state) => {
      // state.loading = true;
    });
    builder.addCase(submitVote.fulfilled, (state, { payload }) => {
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
    builder.addCase(getThreads.fulfilled, (state, { payload }) => {
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
    builder.addCase(getPinThreads.fulfilled, (state, { payload }) => {
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
    builder.addCase(filterThreads.fulfilled, (state, { payload }) => {
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
    builder.addCase(viewProfile.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload?.data?.user;
    });
    builder.addCase(viewProfile.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(pinThread.pending, (state) => {
      // state.loading = true;
    });
    builder.addCase(pinThread.fulfilled, (state, { payload }) => {
      state.loading = false;
      console.log(payload.message);
      if (payload?.message === "Pinned thread") {
        state.pinnedThreads = [
          ...state.pinnedThreads,
          {
            id: payload?.data?.message?.id,
            topic: payload?.data?.message?.topic,
            image: payload?.data?.message?.media[0],
          },
        ];
        state.threads = state.threads.map((thread) =>
          thread.id === payload.data.message.id ? payload.data.message : thread
        );
      } else {
        state.pinnedThreads = state.pinnedThreads.filter(
          (thread) => thread.id !== payload.data?.message?.id
        );
        state.threads = state.threads.map((thread) =>
          thread.id === payload.data.message.id ? payload.data.message : thread
        );
      }
    });
    builder.addCase(pinThread.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(reportThread.pending, (state) => {
      // state.loading = true;
    });
    builder.addCase(reportThread.fulfilled, (state, { payload }) => {
      state.loading = false;
    });
    builder.addCase(reportThread.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(deleteThread.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteThread.fulfilled, (state, { payload }) => {
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
      state.loading = true;
    });
    builder.addCase(searchTribe.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.searchResults = payload?.data?.tribes;
    });
    builder.addCase(searchTribe.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(addTribeMember.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addTribeMember.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.tribe = payload?.data?.tribe;
    });
    builder.addCase(addTribeMember.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(verifyTribePayment.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(verifyTribePayment.fulfilled, (state, { payload }) => {
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
    builder.addCase(postComment.fulfilled, (state, { payload }) => {
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
    builder.addCase(getComments.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.comments = payload?.data?.comments;
    });
    builder.addCase(getComments.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const { setTribeUser, removeTribeUser } = tribeSlice.actions;
export {
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
