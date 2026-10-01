interface UserInterface {
  id: number;
  fullname: string;
  username: string;
  avatar: string;
}

export interface TribeInterface {
  id: number;
  image: string;
  tribe_name: string;
  monetized: number;
  category: string;
  description: string;
  members: number;
  membership_fee: number;
  slug: string;
  owner: boolean;
  private: boolean;
  status: number;
  threads: number;
  likes: number;
  comments: number;
  hasLiked: boolean;
  has_joined: boolean;
  created_by: string;
  created_at: Date;
  member_list: TribeMemberInterface[];
}

export interface TribeMemberInterface {
  id: number;
  user: UserInterface;
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
    id: number;
    option: string;
  } | null;
  total_votes: number;
}

// Matches ThreadCommentResource (backend) — was typed as `string[]` on
// Thread.all_comments, which never matched what postComment/getThreads
// actually return (comment objects).
export interface ThreadComment {
  id: number;
  thread_id: number;
  owner: boolean;
  body: string;
  user_id: number;
  user: {
    fullname: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  created_at: string;
  likes: number;
  hasLikedComment: boolean;
  children: ThreadComment[];
}

export interface Thread {
  id: number;
  owner: boolean;
  user: UserInterface;
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
  all_comments: ThreadComment[];
  created_at: string;
  created_by: CreatedBy;
  thread_polls: ThreadPolls;
}
