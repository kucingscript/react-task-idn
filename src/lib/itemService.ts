import type {
  DetailItemApiResponse,
  GetItemParams,
  ItemApiResponse,
} from "@/types/item";
import apiClient from "./api";

export const getItems = async (
  params: GetItemParams
): Promise<ItemApiResponse> => {
  const res = await apiClient.get<ItemApiResponse>("/items", {
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

export const getItemById = async (
  itemId: string
): Promise<DetailItemApiResponse> => {
  const res = await apiClient.get<DetailItemApiResponse>(`/items/${itemId}`);
  return res.data;
};
