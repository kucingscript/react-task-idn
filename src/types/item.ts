import type { CorporateInfo } from "./types";

export type ItemStatus =
  | "REGISTERED"
  | "WASH"
  | "CLEAN"
  | "STORED"
  | "SENT"
  | "USED"
  | "DIRT"
  | "DEFECT";

export interface Item {
  item_id: string;
  status: ItemStatus;
  last_status: ItemStatus;
  wash_count: number;
  procurement_date: string;
  created_at: string;
  item_types: {
    item_type_id: string;
    name: string;
  };
  rooms: {
    room_id: string;
    name: string;
  };
  corporates: CorporateInfo;
  vendors: {
    name: string;
  };
}

export interface GetItemParams {
  page?: number;
  limit?: number;
  q?: string;
  room_id?: string;
  item_type_id?: string;
  status?: string;
}

export interface ItemApiResponse {
  code: number;
  message: string;
  data: Item;
}

export interface UpdateItemPayload {
  item_type_id: string;
  room_id: string;
  corporate_id: string;
}
