interface Social {
    name: string;
    value: string;
}

export interface GuestListCardProps {
    name: string;
    type: string;
    id: number;
    ticket_name: string
    status: string
    checked_in: boolean
}

export interface EventInterface {
    id: number
    user_id: number
    event_image: string
    event_name: string
    event_description?: string
    category: string
    event_type: string
    location: string
    time_zone: string
    start_date: string|Date
    end_date: string|Date
    affiliate_program: boolean
    commission: number
    socials: Social[]
    qr_code?: string
    owns: boolean
    created_by: {
        name: string
    }
    created_at: Date
    num_of_tickets: number
    minimum_price: number
    tickets: TicketInterface[]
    hosting_platform?: string
    meeting_link?: string
    meeting_passcode?: string
}

export interface TicketInterface {
    created_at: string;
    description: string;
    event_id: number;
    id: number;
    name: string;
    price: number;
    purchase_limit: number;
    stock_type: string;
    ticket_id: string;
    ticket_stock: number;
    ticket_type: string;
    transfer_commission: number;
    updated_at: string;
}

export interface TicketDetails {
    id: number;
    ticket_name: string;
    ticket_description: string;
    quantity: number;
    price: number
    purchase_limit: number
}

export interface MyTicketInterface {
    id: number
    status: string
    ticket_count: number
    unique_id: string
    event: EventInterface
}

export interface EventTicketInterface {
    id: number;
    event_name: string;
    date: Date;
    ticket_type: string;
    venue: string;
    ticket_code: string;
    qr_code: string;
    void: boolean;
}

export interface PromotionInterface {
    id: number;
    name: string;
    price_option: 'one-time' | 'recurring' | string; // adjust if more options exist
    price: number;
    breakdown: string[];
    status: 'active' | 'inactive' | string; // adjust based on possible statuses
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}