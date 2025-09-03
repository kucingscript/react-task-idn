export interface PageInfo {
  page: number;
  total_data: number;
  total_page: number;
}

export interface CorporateInfo {
  corporate_id: string;
  name: string;
  code: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T[];
  pageInfo: PageInfo;
}

export interface ApiParams {
  page?: number;
  limit?: number;
  q?: string;
}
