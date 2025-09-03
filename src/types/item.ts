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
    name: string;
  };
  rooms: {
    name: string;
  };
  corporates: CorporateInfo;
}

export interface GetItemParams {
  page?: number;
  limit?: number;
  q?: string;
  room_id?: string;
  item_type_id?: string;
  status?: string;
}

export interface DetailItemApiResponse {
  code: number;
  message: string;
  data: Item;
}
