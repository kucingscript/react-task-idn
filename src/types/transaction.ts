import type { CorporateInfo } from "./types";

export interface Transaction {
  in_transaction_id: string;
  code: string;
  transaction_date: string;
  total_qty: number;
  wash_type: string;
  infectious_type: "NON-INFECTIOUS" | "INFECTIOUS" | string;
  total_weight: number;
  total_weight_scales: number;
  status: string;
  corporates: CorporateInfo;
}
