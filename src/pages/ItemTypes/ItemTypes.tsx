import { ItemsTypesDataTable } from "@/components/ItemTypesDataTable/ItemTypesDataTable";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { getItemTypes } from "@/lib/ItemTypesService";
import type { ItemType } from "@/types/item-types";
import type { PageInfo } from "@/types/pagination";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ItemTypes = () => {
  const [items, setItems] = useState<ItemType[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchItems = async (currentPage: number, search: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getItemTypes({
        page: currentPage,
        limit,
        q: search,
      });
      if (response.code === 0) {
        setItems(response.data);
        setPageInfo(response.pageInfo);
      } else {
        setError(response.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch items.";
      toast.error(errorMessage);
      setError("Failed to fetch items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(page, debouncedSearchTerm);
  }, [page, debouncedSearchTerm, limit]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (error) {
    return <div className="p-4 lg:p-6">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Items</h1>
        <Input
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <ItemsTypesDataTable
          data={items}
          pageInfo={pageInfo}
          onPageChange={handlePageChange}
          currentPage={page}
        />
      )}
    </div>
  );
};

export default ItemTypes;
