import apiClient from "./api";
import type { ApiResponse, ApiParams } from "@/types/types";
import type { Room } from "@/types/room";

export const getRooms = async (
  params: ApiParams
): Promise<ApiResponse<Room>> => {
  const res = await apiClient.get<ApiResponse<Room>>("/rooms", {
    params: {
      page: params.page || 1,
      limit: params.limit || 10,
      q: params.q || "",
    },
  });

  return res.data;
};
