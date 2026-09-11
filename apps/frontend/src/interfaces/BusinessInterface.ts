export interface BusinessInterface {
    id: number;
    name: string;
    image: string;
    service_rate: number;
    services: string[];
    rating: number;
    featured: number;
    gallery: string[];
    description: string;
    reviews: string | null;
    categories: string[];
    phone_number: string;
    email: string;
    website_url: string;
    city: string;
    country: string;
    hasBoost: boolean;
    owner: boolean;
    hasActiveServiceRequest: boolean
}