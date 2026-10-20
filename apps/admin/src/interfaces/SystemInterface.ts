export interface UserInterface {
  id: number;
  name: string;
  email: string;
  status: number;
  role: string;
  image: string;
  unique_id: string;
  created_at: string;
}

export interface PlatformStatistics {
  total_users: number;
  total_subscription_revenue: number;
  total_tickets_revenue: number;
  total_business_boosting_revenue: number;
  total_event_promotion_revenue: number;
  total_referral_earnings: number;
  total_affiliate_earnings: number;
  total_membership_plan_users: number;
  total_free_plan_users: number;
  total_number_of_referrers: number;
  total_number_of_referrals: number;
  total_tribes: number;
  total_business: number;
  total_events: number;
  total_boosted_business: number;
  total_promoted_events: number;
  // Server-formatted naira, e.g. "4500.00".
  total_paid_tribe_earnings: number | string;
  total_paid_tribe_commissions: number | string;
  total_paid_tribes: number;
  pending_events: number;
  pending_businesses: number;
  open_reports: number;
}
