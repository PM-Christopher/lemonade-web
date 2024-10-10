export interface EventInterface {
    id: number
    user_id: number
    event_image?: string
    event_name: string
    event_description?: string
    category: string
    event_type: string
    location: string
    time_zone: string
    start_date: Date
    end_date: Date
    affiliate_program: boolean
    commission: number
    socials?: string[]
    qr_code?: string
    owns: boolean
    created_by: {
        name: string
    }
    created_at: Date
    num_of_tickets: number
}