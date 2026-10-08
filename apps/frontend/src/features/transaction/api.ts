// Endpoints for the transaction domain.
import { browserApi } from "@/lib/browser-api";
import { userTransactionRoutes } from "@lemonade/api-types/generated";

export interface VerifyTransactionPayload {
  trx_ref: string;
}

// `data` is the transaction meta, whose shape depends on what was purchased.
export interface VerifyTransactionResponse<TData = unknown> {
  status: "successful" | "unsuccessful";
  data: TData;
}

export const transactionApi = {
  verifyTransaction: <TData = unknown>(data: VerifyTransactionPayload) =>
    browserApi.post<VerifyTransactionResponse<TData>>(userTransactionRoutes.VERIFY, data),
};
