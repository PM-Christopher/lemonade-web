import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {axiosInstance} from "@/lib/axiosInstane";
import {ChatInterface, MessageInterface} from "@/interfaces/ChatInterface";

interface chatState {
    user: {} | null;
    loading: boolean;
    error: boolean;
    chat: ChatInterface | null
    messages: MessageInterface[]
    receiver_id: number|null
}

interface GetChatParams {
    receiver_id: number;
    token: string;
}

interface SendChatParams {
    message: string|null;
    token: string;
    receiver_id: number;
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
    receiver_id: null
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

const sendChat = createAsyncThunk<GetChatSuccessPayload, SendChatParams>("connect/sendChat", async ({message, token, receiver_id}: SendChatParams, { rejectWithValue }) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axiosInstance.post(`/messages?receiver_id=${receiver_id}`, { message }, { headers });
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

const connectSlice = createSlice({
    name: "connect",
    initialState,
    reducers: {
        addToMessages: (state, action) => {
            const message = action.payload.message
            const user = action.payload.user
            const format_message = {
                "id": message.id,
                "message": "This is a type message new",
                "sender": message.sender === user.id,
                "receiver": message.receiver === user.id,
                "media": message.media,
                "created_at": message.created_at
            }
            state.messages = [...state.messages, format_message];
        },
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
    }
    }
});

export const { addToMessages } = connectSlice.actions
export { getChat, sendChat, inviteResponse }
export default connectSlice.reducer;