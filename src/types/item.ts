interface CorporateInfo {
  corporate_id: string;
  name: string;
  code: string;
}

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

export interface PageInfo {
  page: number;
  total_data: number;
  total_page: number;
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
