import type { ItemType } from "@/types/item-types";
import apiClient from "./api";
import type { ApiResponse, ApiParams } from "@/types/types";

export const getItemTypes = async (
  params: ApiParams
): Promise<ApiResponse<ItemType>> => {
  const res = await apiClient.get<ApiResponse<ItemType>>("/item-types", {
    params: {
      page: params.page || 1,
      limit: params.limit || 10,
      q: params.q || "",
    },
  });

  return res.data;
};
