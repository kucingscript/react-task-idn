import type { Transaction } from "@/types/transaction";
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
