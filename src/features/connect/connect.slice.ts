import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {axiosInstance} from "@/lib/axiosInstane";
import {ChatInterface, MessageInterface} from "@/interfaces/ChatInterface";

interface chatState {
    user: {} | null;
    loading: boolean;
    error: boolean;
    chat: ChatInterface | null
    messages: MessageInterface[]
    receiver_id: number | null,
    invites: any[],
    chats: any[]
    connection_info: {} | null
}

interface GetChatParams {
    receiver_id: number;
    token: string;
}

interface SendChatParams {
    message: string|null;
    token: string;
    receiver_id: number;
    media: string[]
}

interface ChatResponse {
    chat: ChatInterface;
    messages: MessageInterface[];
}

interface GetChatSuccessPayload {
    data: ChatResponse;
}

const initialState: chatState = {
    user: null,
    loading: false,
    error: false,
    chat: null,
    messages: [],
    receiver_id: null,
    invites: [],
    chats: [],
    connection_info: null
};

const getChat = createAsyncThunk<GetChatSuccessPayload, GetChatParams>("connect/getChat", async ({receiver_id, token}: GetChatParams, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.get(`/messages/chat?receiver_id=${receiver_id}`, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const sendChat = createAsyncThunk<GetChatSuccessPayload, SendChatParams>("connect/sendChat", async ({message, media, token, receiver_id}: SendChatParams, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.post(`/messages?receiver_id=${receiver_id}`, { message, media }, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const inviteResponse = createAsyncThunk("connect/inviteResponse", async ({token, id, data}: {token: string, id: number, data: {option: string}}, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.post(`/connect/invite-response/${id}`, data, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const findUser = createAsyncThunk("connect/findUser", async ({token, search}: {token: string, search: string}, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.get(`/connect/find-user?search=${search}`, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const sendInvite = createAsyncThunk("connect/sendInvite", async ({token, data}: {token: string, data: any}, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.post(`/connect/send-invite`, data, { headers });
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getInvites = createAsyncThunk("connect/getInvites", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/connect/get-invites`);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getConnection = createAsyncThunk("connect/getConnection", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/connect`);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getMessages = createAsyncThunk("connect/getMessages", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/messages`);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const connectSlice = createSlice({
    name: "connect",
    initialState,
    reducers: {
        addToMessages: (state, action) => {
            const message = action.payload.message
            const user = action.payload.user
            const format_message = {
                "id": message.id,
                "message": message?.message,
                "sender": message.sender === user.id,
                "receiver": message.receiver === user.id,
                "media": message.media,
                "created_at": message.created_at
            }
            state.messages = [...state.messages, format_message];
        },
        removeChat: (state) => {
            state.chat = null
            state.messages = []
        }
    },
    extraReducers: (builder) => { {
        builder.addCase(getChat.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getChat.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.chat = payload.data.chat
            state.messages = payload.data.messages
        });
        builder.addCase(getChat.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(sendChat.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(sendChat.fulfilled, (state, { payload }) => {
            state.loading = false;
        });
        builder.addCase(sendChat.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(inviteResponse.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(inviteResponse.fulfilled, (state, { payload }) => {
            state.loading = false;
        });
        builder.addCase(inviteResponse.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(findUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(findUser.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.user = payload.data
        });
        builder.addCase(findUser.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(sendInvite.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(sendInvite.fulfilled, (state, { payload }) => {
            state.loading = false;
        });
        builder.addCase(sendInvite.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(getInvites.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getInvites.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.invites = payload?.data?.invites;
        });
        builder.addCase(getInvites.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(getConnection.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getConnection.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.connection_info = payload?.data;
        });
        builder.addCase(getConnection.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(getMessages.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getMessages.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.chats = payload?.data?.chats;
        });
        builder.addCase(getMessages.rejected, (state) => {
            state.loading = false;
        });
    }
    }
});

export const { addToMessages, removeChat } = connectSlice.actions
export { getChat, sendChat, inviteResponse, findUser, sendInvite, getInvites, getConnection, getMessages }
export default connectSlice.reducer;