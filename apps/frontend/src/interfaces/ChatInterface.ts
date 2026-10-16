interface User {
  id: string;
  username: string;
  lemon_id: string;
  avatar: string;
  industry?: string | null;
  bio?: string | null;
  socials?: Array<{ name?: string; value?: string }>;
}

interface LatestMessage {
  message: string;
  type: string;
  created_at: string;
}

export interface ChatInterface {
  id: string;
  sender: User;
  receiver: User;
  latest: LatestMessage;
  isReceiver: boolean;
  isSender: boolean;
}

export interface MessageInterface {
  id: string;
  message: string;
  sender: boolean;
  receiver: boolean;
  media: string[] | null;
  created_at: string;
}
