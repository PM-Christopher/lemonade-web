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
  hasActiveServiceRequest: boolean;
  // PENDING, REJECTED, SUSPENDED, INACTIVE or ACTIVE.
  status?: string;
  rejection_reason?: string | null;
  // Confirmed live against BusinessResource — was missing entirely (every
  // consumer read it off an `any`-typed object before this migration).
  boost?: {
    full_start_date: string;
    full_end_date: string;
    start_date: string;
    start_time: string;
    duration: number | null;
  } | null;
}
