import type { CorporateInfo } from "./corporates";
import type { PageInfo } from "./pagination";

export interface ItemType {
  item_type_id: string;
  name: string;
  size: string;
  color: string;
  weight: number;
  medical_type: string;
  specs: string;
  corporate_id: string;
  created_at: string;
  corporates: CorporateInfo;
}

export interface GetItemTypesParams {
  page?: number;
  limit?: number;
  q?: string;
}

export interface ItemTypeApiResponse {
  code: number;
  message: string;
  data: ItemType[];
  pageInfo: PageInfo;
}
