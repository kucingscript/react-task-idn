import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import type { PageInfo, ApiResponse } from "@/types/types";

type Fetcher<T, P> = (params: P) => Promise<ApiResponse<T>>;

export const useDataTable = <TData>(
  fetcher: Fetcher<TData, { page: number; q: string }>,
  defaultErrorMessage: string
) => {
  const [data, setData] = useState<TData[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetcher({ page, q: debouncedSearchTerm });
        if (response.code === 0) {
          setData(response.data);
          setPageInfo(response.pageInfo);
          setError(null);
        } else {
          toast.error(response.message);
          setError(response.message);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (debouncedSearchTerm && error.response?.status === 404) {
          setData([]);
          setPageInfo(null);
          setError(null);
        } else {
          const errorMessage =
            error.response?.data?.message || defaultErrorMessage;
          toast.error(errorMessage);
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, debouncedSearchTerm, fetcher, defaultErrorMessage]);

  return {
    data,
    pageInfo,
    loading,
    error,
    page,
    setPage,
    searchTerm,
    setSearchTerm,
  };
};
