import type { CorporateInfo } from "./types";

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
