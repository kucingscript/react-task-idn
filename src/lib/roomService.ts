import type { GetRoomsParams, RoomApiResponse } from "@/types/room";
import apiClient from "./api";

export const getRooms = async (
  params: GetRoomsParams
): Promise<RoomApiResponse> => {
  const res = await apiClient.get<RoomApiResponse>("/rooms", {
    params: {
      page: params.page || 1,
      limit: params.limit || 10,
      q: params.q || "",
    },
  });

  return res.data;
};
