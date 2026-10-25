// GENERATED FILE — do not hand-edit. Run `node tooling/generate-api-types/generate.mjs`.
// Source: lemonade-backend's FormRequest::rules() (introspect.php).
//
// Field types are inferred from validation rule tokens (see rules-to-type.mjs)
// — a rule this generator doesn't recognize falls through to `unknown` rather
// than guessing, so `unknown` here means "check the FormRequest by hand", not
// "this field can be anything". Dot-notation fields (settings.email,
// tickets.*.id) become real nested objects/arrays, not literal dotted keys.

export interface AddAdminTribeThreadRequest {
  topic: string;
  thoughts: string;
  media?: {}[];
  videos?: {}[];
  tags?: {}[];
  polls?: boolean;
  thread_polls?: {
    title?: string;
    options?: {}[];
    start_at?: string;
    end_at?: string;
  };
}

export interface AddForumMemberRequest {
  username: string;
}

export interface AddressRequest {
  address: string;
  country: string;
  state: string;
  city: string;
}

export interface AddTribeMemberRequest {
  usernames: unknown[];
}

export interface AddUserWalletBalanceRequest {
  amount: number;
}

export interface AdminRoleRequest {
  name: string;
  permissions: {}[];
}

export interface AnnouncementRequest {
  title: string;
  content: string;
  draft?: boolean;
  date_scheduled?: string;
}

export interface AppNotificationSettingsRequest {
  type:
    | "new_thread"
    | "thread_engagements"
    | "ticket_sales"
    | "ticket_payout"
    | "service_offer"
    | "service_status"
    | "service_payout"
    | "connect_request"
    | "new_message";
  settings: {
    push_notification?: boolean;
    in_app_notification: boolean;
    email: boolean;
  };
}

export interface AssignDisputeRequest {
  admin_id?: string;
}

export interface AssignEventTicketsRequest {
  fullname: string;
  email: string;
  assign_multiple: boolean;
  referral?: string;
  tickets?: {
    id: string;
    quantity: number;
  }[];
  assigned_tickets?: {
    id?: string;
    quantity?: number;
    fullname?: string;
    email?: string;
  }[];
  redirect_url?: string;
}

export interface AssignSupportRequest {
  admin_id?: string;
}

export interface AuditLogRequest {
  admin_id?: string;
  area?: string;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  per_page?: number;
}

export interface BankAccountRequest {
  bank_name: string;
  account_name: string;
  account_number: string;
  bank_code?: string;
}

export interface BioRequest {
  bio: string;
}

export interface BoostBusinessRequest {
  package: string;
  option: number;
  start_date: string;
  start_time: string;
  callback_url?: string;
}

export interface BusinessFilterRequest {
  status?: string;
  from?: string;
  to?: string;
  search?: string;
}

export interface CategoryRequest {
  type: string;
  name: string;
  description?: string;
}

export interface ChangeAdminPasswordRequest {
  password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface ChangeAdminProfileImageRequest {
  image: string;
}

export interface ChangePasswordRequest {
  password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface ChangeSubscriptionPlanRequest {
  subscription_id: string;
  reason?: string;
  type?: "monthly" | "yearly";
  mode: "upgrade" | "downgrade";
}

export interface ChatContactRequest {
  receiver_id: string;
}

export interface CommentOnTribeThreadRequest {
  body: string;
  parent_id?: unknown;
}

export interface CreateAdminTribeRequest {
  tribe_name: string;
  image: string;
  category: string;
  description: string;
}

export interface CreateAdminUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface CreateBusinessRequest {
  name: string;
  image: string;
  categories: unknown[];
  description: string;
  city: string;
  country: string;
  services: unknown[];
  service_rate?: number;
  gallery?: unknown[];
  email: string;
  phone_number: string;
  website_url: string;
  account_number?: string;
  account_name?: string;
  bank_name?: string;
}

export interface CreateEventRequest {
  event: {
    event_image: string;
    event_name: string;
    event_description: string;
    category: string;
    event_type: string;
    location?: string;
    hosting_platform?: string;
    meeting_link?: string;
    meeting_passcode?: string;
    time_zone: string;
    start_date: string;
    end_date: string;
    affiliate_program: boolean;
    commission?: number;
    socials?: unknown;
    status?: "draft";
  };
  tickets: {
    ticket_type: string;
    name: string;
    price: number;
    transfer_commission: boolean;
    stock_type: string;
    ticket_stock: number;
    purchase_limit: number;
    description: string;
  }[];
}

export interface CreateForumRequest {
  title: string;
  category: string;
  description: string;
  image: string;
  private: boolean;
}

export interface CreateForumThreadRequest {
  topic: string;
  thoughts: string;
  media?: unknown[];
  tags?: unknown[];
  polls: boolean;
}

export interface CreatePromotionRequest {
  name: string;
  price_option: string;
  price: number;
  image: string;
  breakdown: {}[];
}

export interface CreateTribeThreadRequest {
  topic: string;
  thoughts: string;
  polls: boolean;
  media?: {}[];
  videos?: {}[];
  tags?: {}[];
  thread_polls?: {
    title?: string;
    options?: {}[];
    start_at?: string;
    end_at?: string;
  };
}

export interface DateRangeRequest {
  from?: string;
  to?: string;
  status?: "successful" | "failed" | "pending" | "rejected" | "active" | "inactive";
  search?: string;
  page?: number;
  per_page?: number;
}

export interface DecideTribeDeletionRequest {
  reason?: string;
}

export interface DeductUserWalletBalanceRequest {
  amount: number;
}

export interface DeleteAccountRequest {
  confirmation: "DELETE";
}

export interface DeleteBusinessRequest {
  reason?: string;
}

export interface DeleteReportedContentRequest {
  category: string;
  category_id: string;
}

export interface DeleteTribeRequest {
  reason?: string;
}

export interface DisputeJobRequest {
  dispute: string;
  attachments: unknown[];
}

export interface EditEventTicketsRequest {
  tickets: {
    ticket_id?: string;
    ticket_type: string;
    name: string;
    price: number;
    transfer_commission: boolean;
    stock_type: string;
    ticket_stock: number;
    purchase_limit: number;
    description: string;
  }[];
}

export interface EditThreadCommentRequest {
  body: string;
}

export interface EventActionReasonRequest {
  reason?: string;
}

export interface FaqRequest {
  category: string;
  question: string;
  answer: string;
  is_published?: boolean;
}

export interface FindConnectUserRequest {
  search: string;
}

export interface ListLedgerEntriesRequest {
  account_type?: string;
  account_id?: string;
  transaction_id?: string;
  from?: string;
  to?: string;
  per_page?: number;
}

export interface ListModeratedContentRequest {
  deleted?: boolean;
  search?: string;
  user_id?: string;
  per_page?: number;
}

export interface ListPlanSubscribersRequest {
  status?: string;
  cycle?: "free" | "monthly" | "yearly";
  search?: string;
  per_page?: number;
}

export interface ListTransactionsRequest {
  type?: "ticket" | "subscription" | "tribe" | "promotion" | "boost" | "service_request";
  status?: "pending" | "success" | "failed" | "abandoned";
  user_id?: string;
  from?: string;
  to?: string;
  search?: string;
  per_page?: number;
}

export interface MarkJobStatusRequest {
  status: string;
  remark?: string;
}

export interface MenuPreferencesRequest {
  menu_order?: {}[];
  hidden_menu?: {}[];
}

export interface PageContentRequest {
  category: string;
  content: string;
}

export interface PaymentsToReviewRequest {
  status?: "stuck" | "failed" | "settled" | "all";
  type?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface PlatformSettingsRequest {
  platform_name: string;
  logo_url?: string;
  inactivity_timeout_minutes: number;
  support_email?: string;
  support_phone?: string;
  audit_retention_days: number;
  user_activity_retention_days: number;
  account_deletion_grace_days: number;
}

export interface ProcessWithdrawalRequestRequest {
  type: string;
  acknowledge_risk?: boolean;
}

export interface ProfessionRequest {
  industry: string;
}

export interface ProfileImageRequest {
  profile_image: string;
}

export interface ProfileSetupRequest {
  profile_image?: string;
  username: string;
  bio: string;
  industry: string;
}

export interface PromoteEventRequest {
  promo: number;
  unit: number;
  promotion_date: string;
  redirect_url?: string;
}

export interface PushNotificationSettingsRequest {
  push_notification: boolean;
}

export interface QuoteEventTicketsRequest {
  tickets: {
    id: string;
    quantity: number;
  }[];
}

export interface RedeemRewardPointsRequest {
  points?: number;
  idempotency_key: string;
  currency?: string;
}

export interface RegisterAdminDeviceTokenRequest {
  device_token: string;
  device_type?: string;
  platform?: string;
}

export interface RegisterDeviceTokenRequest {
  device_token: string;
  device_type?: string;
  platform?: string;
}

export interface RejectSubmissionRequest {
  reason: string;
}

export interface RemoveForumMemberRequest {
  username: string;
}

export interface RemoveTribeMemberRequest {}

export interface RenewSubscriptionRequest {
  redirect_url?: string;
}

export interface ReorderFaqsRequest {
  ids: {}[];
}

export interface ReportClientErrorRequest {
  message: string;
  app: "frontend" | "admin";
  path?: string;
  digest?: string;
  stack?: string;
  correlation_id?: string;
  context?: unknown[];
}

export interface ReportTribeThreadRequest {
  report: string;
}

export interface RequestAccountDeletionRequest {
  email: string;
}

export interface RequestAdminPasswordResetRequest {
  email: string;
}

export interface RequestBusinessServiceRequest {
  amount: number;
  services: unknown[];
  additional_information?: string;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface RequestWithdrawalRequest {
  amount?: number;
  bank_account_id?: string;
}

export interface ResetAdminPasswordRequest {
  code: string;
  password: string;
}

export interface ResetUserPasswordRequest {
  password: string;
}

export interface ResolveDisputeRequest {
  resolution: "refund" | "release";
}

export interface ReviewCompletedJobRequest {
  title: string;
  rating: number;
  description: string;
}

export interface SavedReplyRequest {
  title: string;
  body: string;
}

export interface ScheduleEventPromotionRequest {
  promotion_date: string;
}

export interface SendChatMessageRequest {
  receiver_id: string;
  message?: string;
  media?: unknown[];
}

export interface SendSupportMessageRequest {
  message?: string;
  media?: {
    type: "image" | "video";
    url: string;
  }[];
}

export interface SendTypingIndicatorRequest {
  receiver_id: string;
}

export interface SignInAdminRequest {
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  fullname: string;
  email: string;
  password: string;
}

export interface SkillsAndInterestsRequest {
  skills: {}[];
  interests: {}[];
}

export interface SocialsRequest {
  socials?: {
    name: string;
    value: string;
  }[];
}

export interface SortTribeThreadsRequest {
  filter: "popular" | "newest" | "oldest";
}

export interface SubscriptionPlanRequest {
  title: string;
  access_type: string;
  monthly_charge: number;
  yearly_charge: number;
  ver_badge: boolean;
  forum_creation: boolean;
  business_listing?: boolean;
  lemon_id: boolean;
  event_creation?: number;
  tribe_limit?: number;
  thread_limit?: number;
  business_limit?: number;
  sales_commission: number;
  service_commission: number;
  connection_range: string;
  offline_benefits: boolean;
  recommended?: boolean;
  active?: boolean;
}

export interface UpdateBusinessRequest {
  name: string;
  image: string;
  categories: unknown[];
  description: string;
  city: string;
  country: string;
  services: unknown[];
  service_rate?: number;
  gallery: unknown[];
  email: string;
  phone_number: string;
  website_url: string;
}

export interface UpdateConnectVisibilityRequest {
  visibility: boolean;
}

export interface UpdateEventPaymentSettingsRequest {
  type: "monthly" | "weekly";
}

export interface UpdateEventRequest {
  event: {
    event_image: string;
    event_name: string;
    event_description: string;
    category: string;
    event_type: string;
    location?: string;
    hosting_platform?: string;
    meeting_link?: string;
    meeting_passcode?: string;
    time_zone: string;
    start_date: string;
    end_date: string;
    affiliate_program: boolean;
    commission?: number;
    socials?: unknown;
    status?: "draft" | "active";
  };
}

export interface UpdateForumStatusRequest {
  status:
    | "active"
    | "inactive"
    | "suspended"
    | "Active"
    | "Inactive"
    | "Suspended"
    | "ACTIVE"
    | "INACTIVE"
    | "SUSPENDED";
}

export interface UpdatePointsRedemptionRateRequest {
  rate: number;
}

export interface UpdatePromotionRequest {
  name: string;
  price_option: string;
  price: number;
  image: string;
  breakdown: {}[];
}

export interface UpdateServiceCommissionRequest {
  commission_percentage: number;
}

export interface UpdateTribeThreadRequest {
  topic?: string;
  thoughts?: string;
}

export interface UpdateWithdrawalThresholdRequest {
  threshold: number;
}

export interface UploadFileRequest {
  file: unknown;
}

export interface UploadMultipleFilesRequest {
  files: {}[];
}

export interface UsernameRequest {
  username: string;
}

export interface UserStatusReasonRequest {
  reason: string;
}

export interface VerifyAccountDeletionRequest {
  code: string;
}

export interface VerifyAccountOtpRequest {
  code: number;
}

export interface VerifyAdminPasswordResetOtpRequest {}

export interface VerifyPasswordResetOtpRequest {
  code: number;
}

export interface VerifyPaymentReferenceRequest {
  reference: string;
}

export interface VoteOnTribePollRequest {
  option_id: string;
}

export interface WriteBusinessReviewRequest {
  rating: number;
  title: string;
  description: string;
}
