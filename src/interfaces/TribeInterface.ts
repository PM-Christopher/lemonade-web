interface UserInterface {
    id: number
    fullname: string
    username: string
    avatar: string
}

export interface TribeInterface {
    id: number
    image: string
    tribe_name: string
    monetized: number
    category: string
    description: string
    members: number
    membership_fee: number
    slug: any
    owner: boolean
    private: boolean
    status: number
    threads: number
    likes: number
    comments: number
    hasLiked: boolean
    has_joined: boolean
    created_by: string
    created_at: Date
    member_list: TribeMemberInterface[]
}

export interface TribeMemberInterface {
    id: number
    user: UserInterface
}


interface User {
    id: number;
    fullname: string;
    username: string;
    email: string;
    avatar: string;
    industry: string;
    bio: string;
    socials: string[];
    verified: boolean;
}

interface CreatedBy {
    user: User;
}

interface PollOption {
    id: number;
    content: string;
    vote_count: number;
    vote_percentage: number;
}

interface ThreadPolls {
    id: number;
    title: string;
    options: PollOption[];
    start_at: string;
    end_at: string;
    poll_ended: boolean;
    has_voted: boolean;
    user_vote: {
        id: number,
        option: string
    } | null;
    total_votes: number
}

export interface Thread {
    id: number;
    owner: boolean;
    user: UserInterface
    topic: string;
    thoughts: string;
    media: string[];
    videos: string[];
    tags: string[];
    polls: boolean;
    pinned: boolean;
    hasLiked: boolean;
    likes: number;
    comments: number;
    all_comments: string[];
    created_at: string;
    created_by: CreatedBy;
    thread_polls: ThreadPolls;
}

export interface TribeThreadInterface {
    id: number
    user: UserInterface
    hasLiked: boolean;
    hasCommented: boolean;
    topic: string;
    thoughts: string;
    media: string[];
    tags: string[];
    polls: number;
    created_at: string;
    videos: string[];
    pinned: boolean;
    likes: number;
    comments: number;
    all_comments: [];
}

