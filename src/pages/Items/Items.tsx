import { useCallback, useEffect, useState } from "react";
import { getItemById, getItems } from "@/lib/itemService";
import type { Item, ItemStatus } from "@/types/item";
import type { PageInfo } from "@/types/types";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/DataTable/DataTable";
import { columns } from "@/components/ItemsDataTable/ItemsDataTable";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRooms } from "@/lib/roomService";
import { getItemTypes } from "@/lib/ItemTypesService";
import type { Room } from "@/types/room";
import type { ItemType } from "@/types/item-types";
import { ItemDetailDialog } from "@/components/ItemDialog/ItemDetailDIalog";
import ItemUpdateDialog from "@/components/ItemDialog/ItemUpdateDIalog";
import Loader from "@/components/Loader/Loader";

const itemStatuses: ItemStatus[] = [
  "REGISTERED",
  "WASH",
  "CLEAN",
  "STORED",
  "SENT",
  "USED",
  "DIRT",
  "DEFECT",
];

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
        const roomsRes = await getRooms({ limit: 1000 });
        if (roomsRes.code === 0) setRooms(roomsRes.data);
        const itemTypesRes = await getItemTypes({ limit: 1000 });
        if (itemTypesRes.code === 0) setItemTypes(itemTypesRes.data);
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
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-end gap-2 w-full max-w-full md:max-w-3xl">
          <Input
            placeholder="Search ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto"
          />
          <Select
            value={selectedItemType}
            onValueChange={(val) =>
              setSelectedItemType(val === "all-types" ? "" : val)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Item Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-types">All Item Types</SelectItem>
              {itemTypes.map((it) => (
                <SelectItem key={it.item_type_id} value={it.item_type_id}>
                  {it.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedRoom}
            onValueChange={(val) =>
              setSelectedRoom(val === "all-rooms" ? "" : val)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Rooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-rooms">All Rooms</SelectItem>
              {rooms.map((room) => (
                <SelectItem key={room.room_id} value={room.room_id}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedStatus}
            onValueChange={(val) =>
              setSelectedStatus(val === "all-statuses" ? "" : val)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-statuses">All Statuses</SelectItem>
              {itemStatuses.map((status) => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>
            <IconPlus className="mr-2 h-4 w-4" /> Create Item
          </Button>
        </div>
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
