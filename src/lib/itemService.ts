import type {
  GetItemParams,
  Item,
  ItemApiResponse,
  UpdateItemPayload,
} from "@/types/item";
import apiClient from "./api";
import type { ApiResponse } from "@/types/types";

export const getItems = async (
  params: GetItemParams
): Promise<ApiResponse<Item>> => {
  const res = await apiClient.get<ApiResponse<Item>>("/items", {
    params: {
      page: params.page || 1,
      limit: params.limit || 10,
      q: params.q || "",
      room_id: params.room_id || "",
      item_type_id: params.item_type_id || "",
      status: params.status || "",
    },
  });

  return res.data;
};

export const getItemById = async (itemId: string): Promise<ItemApiResponse> => {
  const res = await apiClient.get<ItemApiResponse>(`/items/${itemId}`);
  return res.data;
};

export const updateItem = async (
  itemId: string,
  payload: UpdateItemPayload
): Promise<ItemApiResponse> => {
  const res = await apiClient.post<ItemApiResponse>(
    `/items/${itemId}/update`,
    payload
  );
  return res.data;
};
