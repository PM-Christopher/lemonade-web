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
    owner: boolean
    private: boolean
    status: number
    threads: number
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
}

