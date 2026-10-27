// Endpoints for payments that need a human look, over the BFF transport (browserApi).
import { browserApi } from "@/lib/browser-api";
import { adminPaymentsRoutes, buildPath } from "@lemonade/api-types/generated";

export interface PaymentToReview {
  id: string;
  reference: string;
  type: string;
  // Naira, formatted by the backend.
  amount: string;
  status: string;
  // "stuck" is pending too long, "failed" was declined, "successful" went through.
  state: "stuck" | "failed" | "successful";
  // What Paystack said about it, when it said anything.
  reason: string | null;
  settled_at: string | null;
  settled_by: { id: string; name: string } | null;
  provider: string;
  created_at: string;
  age_minutes: number;
  user: { id: string; name: string; email: string } | null;
}

export interface PaymentsToReviewFilters {
  status?: string;
  type?: string;
  search?: string;
  page?: number;
}

export interface PaymentsToReviewResponse {
  stuck_count: number;
  failed_count: number;
  successful_count: number;
  amount_at_risk: string;
  types: string[];
  payments: PaymentToReview[];
  meta?: { current_page: number; last_page: number; per_page: number; total: number };
}

export interface PaymentDetails {
  id: string;
  reference: string;
  status: string;
  type: string;
  provider: string;
  channel: string | null;
  currency: string;
  // Naira, formatted by the backend.
  amount: string;
  created_at: string;
  paid_at: string | null;
  refunded_at: string | null;
  refund_reference: string | null;
  settled_at: string | null;
  settled_by: { id: string; name: string } | null;
  user: { id: string; name: string; email: string } | null;
  // A short line on what was bought.
  for: string | null;
  gateway: {
    status: string | null;
    message: string | null;
    transaction_id: number | string | null;
    ip_address: string | null;
  };
  ledger: Array<{
    account: string;
    direction: string;
    amount: string;
    description: string | null;
    at: string;
  }>;
}

export interface VerifyPaymentResult {
  id: string;
  status: string;
  message: string;
}

export const paymentsApi = {
  getPayments: (filters: PaymentsToReviewFilters) =>
    browserApi.get<PaymentsToReviewResponse>(adminPaymentsRoutes.LIST, { params: filters }),

  getPayment: (id: string) =>
    browserApi.get<{ payment: PaymentDetails }>(buildPath(adminPaymentsRoutes.SHOW, { id })),

  // Asks Paystack what really happened and finishes the payment if it went through.
  verify: (id: string) =>
    browserApi.post<VerifyPaymentResult>(buildPath(adminPaymentsRoutes.VERIFY, { id }), {}),
};
