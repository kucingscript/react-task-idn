import { useCallback, useEffect, useState } from "react";
import { getItemById, getItems } from "@/lib/itemService";
import type { Item, ItemStatus } from "@/types/item";
import type { PageInfo } from "@/types/types";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { DataTable } from "@/components/DataTable/DataTable";
import { columns } from "@/components/ItemsDataTable/ItemsDataTable";

import { getRooms } from "@/lib/roomService";
import { getItemTypes } from "@/lib/ItemTypesService";
import type { Room } from "@/types/room";
import type { ItemType } from "@/types/item-types";
import { ItemDetailDialog } from "@/components/ItemDialog/ItemDetailDIalog";
import ItemUpdateDialog from "@/components/ItemDialog/ItemUpdateDIalog";
import Loader from "@/components/Loader/Loader";
import ItemsFilter from "@/components/ItemsFilter/ItemsFilter";

const Items = () => {
  const [data, setData] = useState<Item[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedItemType, setSelectedItemType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getItems({
        page,
        q: debouncedSearchTerm,
        room_id: selectedRoom,
        item_type_id: selectedItemType,
        status: selectedStatus as ItemStatus,
      });
      if (response.code === 0) {
        setData(response.data);
        setPageInfo(response.pageInfo);
      } else {
        toast.error(response.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (debouncedSearchTerm && error.response?.status === 404) {
        setData([]);
        setPageInfo(null);
        setError(null);
      } else {
        const errorMessage =
          error.response?.data?.message || "Failed to fetch items";
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [
    page,
    debouncedSearchTerm,
    selectedRoom,
    selectedItemType,
    selectedStatus,
  ]);

  const handleViewDetails = async (itemId: string) => {
    try {
      const response = await getItemById(itemId);
      if (response.code === 0) {
        setSelectedItem(response.data);
        setIsDetailOpen(true);
      } else {
        toast.error(response.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
      setError(error.message);
    }
  };

  const handleEdit = (item: Item) => {
    setSelectedItem(item);
    setIsUpdateOpen(true);
  };

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [roomsInfoRes, itemTypesInfoRes] = await Promise.all([
          getRooms({ limit: 1 }),
          getItemTypes({ limit: 1 }),
        ]);

        const totalRooms = roomsInfoRes.pageInfo?.total_data ?? 0;
        const totalItemTypes = itemTypesInfoRes.pageInfo?.total_data ?? 0;

        const [roomsRes, itemTypesRes] = await Promise.all([
          totalRooms > 0
            ? getRooms({ limit: totalRooms })
            : Promise.resolve(null),
          totalItemTypes > 0
            ? getItemTypes({ limit: totalItemTypes })
            : Promise.resolve(null),
        ]);

        if (roomsRes && roomsRes.code === 0) {
          setRooms(roomsRes.data);
        }

        if (itemTypesRes && itemTypesRes.code === 0) {
          setItemTypes(itemTypesRes.data);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        toast.error("Failed to load filter options.");
        setError(err);
      }
    };
    fetchFilterData();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  if (error && data.length === 0) {
    return (
      <div className="p-4 lg:p-6 text-center text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4 flex-wrap">
        <h1 className="text-2xl font-bold">Items</h1>
        <ItemsFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedItemType={selectedItemType}
          setSelectedItemType={setSelectedItemType}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          itemTypes={itemTypes}
          rooms={rooms}
        />
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
          getRowId={(row) => row.item_id}
          meta={{
            onViewDetails: handleViewDetails,
            onEdit: handleEdit,
          }}
        />
      )}

      <ItemDetailDialog
        item={selectedItem}
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />

      <ItemUpdateDialog
        item={selectedItem}
        isOpen={isUpdateOpen}
        onOpenChange={setIsUpdateOpen}
        onSuccess={fetchItems}
      />
    </div>
  );
};

export default Items;
