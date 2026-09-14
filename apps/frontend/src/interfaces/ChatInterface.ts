interface User {
    id: number;
    username: string;
    lemon_id: string;
    avatar: string;
}

interface LatestMessage {
    message: string;
    type: string;
    created_at: string;
}

export interface ChatInterface {
    id: number
    sender: User;
    receiver: User;
    latest: LatestMessage;
    isReceiver: boolean
    isSender: boolean
}

export interface MessageInterface {
    id: number;
    message: string;
    sender: boolean;
    receiver: boolean;
    media: string[] | null;
    created_at: string;
}