import type { CorporateInfo } from "./types";

export type TransactionStatus = "DONE" | "PENDING";
export type infectious_type = "NON_INFECTIOUS" | "INFECTIOUS";

export interface Transaction {
  in_transaction_id: string;
  code: string;
  transaction_date: string;
  total_qty: number;
  wash_type: string;
  infectious_type: infectious_type;
  total_weight: number;
  total_weight_scales: number;
  status: TransactionStatus;
  corporates: CorporateInfo;
}

interface TransactionDetailPayload {
  item_id: string;
}

export interface CreateTransactionPayload {
  wash_type: string;
  infectious_type: infectious_type;
  total_weight: number;
  total_weight_scales: number;
  total_qty: number;
  corporate_id: string;
  details: TransactionDetailPayload[];
}

export interface CreateTransactionResponse {
  code: number;
  message: string;
  requestId: string;
  data: Transaction;
}
