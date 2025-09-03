import type {
  CreateInTransactionRequest,
  CreateTransactionResponse,
  Transaction,
} from "@/types/transaction";
import apiClient from "./api";
import type { ApiResponse, ApiParams } from "@/types/types";

export const getTransactions = async (
  params: ApiParams
): Promise<ApiResponse<Transaction>> => {
  const res = await apiClient.get<ApiResponse<Transaction>>(
    "/in-transactions",
    {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        q: params.q || "",
      },
    }
  );

  return res.data;
};

export const createTransaction = async (
  payload: CreateInTransactionRequest
): Promise<CreateTransactionResponse> => {
  const res = await apiClient.post<CreateTransactionResponse>(
    "/in-transactions/create",
    payload
  );
  return res.data;
};
