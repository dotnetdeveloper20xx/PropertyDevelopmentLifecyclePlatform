/**
 * Standard API response envelope matching the backend ApiResponse<T>.
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors: string[];
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
