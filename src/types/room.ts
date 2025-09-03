import type { CorporateInfo } from "./corporates";
import type { PageInfo } from "./pagination";

export interface Room {
  room_id: string;
  name: string;
  code: string;
  status: string;
  corporates: CorporateInfo;
}

export interface GetRoomsParams {
  page?: number;
  limit?: number;
  q?: string;
}

export interface RoomApiResponse {
  code: number;
  message: string;
  data: Room[];
  pageInfo: PageInfo;
}
