import { DataTable } from "@/components/DataTable/DataTable";
import Loader from "@/components/Loader/Loader";
import { Input } from "@/components/ui/input";
import { useDataTable } from "@/hooks/use-data-table";
import type { ApiParams, ApiResponse } from "@/types/types";
import type { ColumnDef } from "@tanstack/react-table";

type Fetcher<T> = (params: ApiParams) => Promise<ApiResponse<T>>;

interface ResourcePageProps<T> {
  title: string;
  fetcher: Fetcher<T>;
  columns: ColumnDef<T>[];
  getRowId: (row: T) => string;
  searchPlaceholder: string;
  actionButtons?: React.ReactNode;
}

export const ResourcePage = <T,>({
  title,
  fetcher,
  columns,
  getRowId,
  searchPlaceholder,
  actionButtons,
}: ResourcePageProps<T>) => {
  const {
    data,
    pageInfo,
    loading,
    error,
    page,
    setPage,
    searchTerm,
    setSearchTerm,
  } = useDataTable<T>(fetcher, `Failed to fetch ${title.toLowerCase()}.`);

  if (error && data.length === 0) {
    return (
      <div className="p-4 lg:p-6 text-center text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Input
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:max-w-sm"
        />
        {actionButtons}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          pageInfo={pageInfo}
          currentPage={page}
          onPageChange={setPage}
          getRowId={getRowId}
        />
      )}
    </div>
  );
};
