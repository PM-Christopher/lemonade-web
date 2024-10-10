
export interface TribeInterface {
    id: number
    image?: string
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
    created_by: string
    created_at: Date
}