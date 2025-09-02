import type { GetItemTypesParams, ItemTypeApiResponse } from "@/types/item";
import apiClient from "./api";

export const getItemTypes = async (
  params: GetItemTypesParams
): Promise<ItemTypeApiResponse> => {
  const res = await apiClient.get<ItemTypeApiResponse>("/item-types", {
    params: {
      page: params.page || 1,
      limit: params.limit || 10,
      q: params.q || "",
    },
  });

  return res.data;
};
